// Core dependencies
const path = require('path')
const fs = require('fs')

// External dependencies
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const express = require('express');
const nunjucks = require('nunjucks');
const sessionInCookie = require('client-sessions')
const sessionInMemory = require('express-session')
const bent = require('bent')
const qs = require('qs')
const url = require('url')
const _ = require('lodash')

// Run before other code to make sure variables from .env are available
dotenv.config()

// Local dependencies
const packageInfo = require('./package.json');
const authentication = require('./middleware/authentication');
const automaticRouting = require('./middleware/auto-routing');
const config = require('./app/config');
const locals = require('./app/locals');
const routes = require('./app/routes');
const documentationRoutes = require('./docs/documentation_routes');
const utils = require('./lib/utils.js')
const govNotifyAPI = require('./src/notify');
const getNextChatState = require('./src/chatbot-return-message');
const getServicesArray = require('./src/services-bot')
const filteredResults = require('./src/filtered-results')

// Set configuration variables
const port = process.env.PORT || config.port;
const useDocumentation = process.env.SHOW_DOCS || config.useDocumentation;
const onlyDocumentation = process.env.DOCS_ONLY;

// Initialise applications
const app = express();
const documentationApp = express();


// Set up logger
const winston = require('winston');
const { logError } = require('gulp-sass');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({level: 'info'})
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
    level: 'debug',
  }));
}


// Set up configuration variables
var useAutoStoreData = process.env.USE_AUTO_STORE_DATA || config.useAutoStoreData
var useCookieSessionStore = process.env.USE_COOKIE_SESSION_STORE || config.useCookieSessionStore

// Add variables that are available in all views
app.locals.asset_path = '/public/'
app.locals.useAutoStoreData = (useAutoStoreData === 'true')
app.locals.useCookieSessionStore = (useCookieSessionStore === 'true')
app.locals.serviceName = config.serviceName


// Nunjucks configuration for application
var appViews = [
  path.join(__dirname, 'app/views/'),
  path.join(__dirname, 'node_modules/nhsuk-frontend/packages/components'),
  path.join(__dirname, 'docs/views/')
]

var nunjucksConfig = {
  autoescape: true
}

nunjucksConfig.express = app

var nunjucksAppEnv = nunjucks.configure(appViews, nunjucksConfig);
nunjucksAppEnv.addGlobal('version', packageInfo.version);

// Add Nunjucks filters
utils.addNunjucksFilters(nunjucksAppEnv)


// Session uses service name to avoid clashes with other prototypes
const sessionName = 'nhsuk-prototype-kit-' + (Buffer.from(config.serviceName, 'utf8')).toString('hex')
let sessionOptions = {
  secret: sessionName,
  cookie: {
    maxAge: 1000 * 60 * 60 * 4 // 4 hours
  }
}

// Support session data in cookie or memory
if (useCookieSessionStore === 'true' && !onlyDocumentation) {
  app.use(sessionInCookie(Object.assign(sessionOptions, {
    cookieName: sessionName,
    proxy: true,
    requestKey: 'session'
  })))
} else {
  app.use(sessionInMemory(Object.assign(sessionOptions, {
    name: sessionName,
    resave: false,
    saveUninitialized: false
  })))
}


// Support for parsing data in POSTs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))


// Automatically store all data users enter
if (useAutoStoreData === 'true') {
  app.use(utils.autoStoreData)
  utils.addCheckedFunction(nunjucksAppEnv)
}


// initial checks
checkFiles()


// Warn if node_modules folder doesn't exist
function checkFiles () {
  const nodeModulesExists = fs.existsSync(path.join(__dirname, '/node_modules'))
  if (!nodeModulesExists) {
    console.error('ERROR: Node module folder missing. Try running `npm install`')
    process.exit(0)
  }

  // Create template .env file if it doesn't exist
  const envExists = fs.existsSync(path.join(__dirname, '/.env'))
  if (!envExists) {
    fs.createReadStream(path.join(__dirname, '/lib/template.env'))
      .pipe(fs.createWriteStream(path.join(__dirname, '/.env')))
  }
}

// Create template session data defaults file if it doesn't exist
const dataDirectory = path.join(__dirname, '/app/data')
const sessionDataDefaultsFile = path.join(dataDirectory, '/session-data-defaults.js')
const sessionDataDefaultsFileExists = fs.existsSync(sessionDataDefaultsFile)

if (!sessionDataDefaultsFileExists) {
  logger.debug('Creating session data defaults file')
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory)
  }

  fs.createReadStream(path.join(__dirname, '/lib/template.session-data-defaults.js'))
    .pipe(fs.createWriteStream(sessionDataDefaultsFile))
}

// Check if the app is documentation only
if(onlyDocumentation !== 'true') {
  // Require authentication if not
  // app.use("/api/message-callback", require("./middleware/bearer-authentication"))
  app.use(authentication);
}


// Local variables
app.use(locals(config));

// View engine
app.set('view engine', 'html');
documentationApp.set('view engine', 'html');

// Middleware to serve static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/nhsuk-frontend', express.static(path.join(__dirname, 'node_modules/nhsuk-frontend/packages')));
app.use('/nhsuk-frontend', express.static(path.join(__dirname, 'node_modules/nhsuk-frontend/dist')));


// Check if the app is documentation only
if(onlyDocumentation == 'true') {
  app.get('/', function(req, res) {
    // Redirect to the documentation pages if it is
    res.redirect('/docs');
  });
}

app.post('/tracking',(req, res)=>{
  logger.debug(req.body);
  res.send();
})

const unauthContentPost = bent(process.env.CONTENT_API_URL,'json','POST')

let contentToken = null
const contentAuth = async () => {
const current_time = new Date().getTime() / 1000;
  if (contentToken === null ||  current_time > contentToken.exp) {
    logger.debug("getting new token...")
    contentToken = await unauthContentPost('/auth/local',{
      identifier: process.env.CONTENT_API_USERNAME,
      password: process.env.CONTENT_API_PASSWORD,
    });
  }
  return contentToken;
}

const buildContentHandler = (endpoint) => async (req,res) =>{
  
  const token = await contentAuth()
  const contentGet = bent(process.env.CONTENT_API_URL,'json',{
    Authorization:
    'Bearer ' + token.jwt
  })
  try {
    let results = await contentGet("/" + endpoint)
    
    res.send(results)
  }
  catch (err) {
    res.send(404, err)
  }
}

app.get("/locations", buildContentHandler("locations"))
app.get("/schools", buildContentHandler("schools"))
app.get('/services-gloucester', buildContentHandler("services?national=false"))

app.get('/services', async (req,res)=> {
  const token = await contentAuth()
  const contentGet = bent(process.env.CONTENT_API_URL,'json',{
    Authorization:
    'Bearer ' + token.jwt
  })
  try {
    userData = req.session.data
    logger.debug("running query")

    let results = await contentGet("/services" + "?" + formatStrapiRequest(userData))
    res.send(results)
  }
  catch (err) {
    res.send(404, err)
  }
})

app.get('/services-gloucester', async (req,res)=> {
  const token = await contentAuth()
  const contentGet = bent(process.env.CONTENT_API_URL,'json',{
    Authorization:
    'Bearer ' + token.jwt
  })
  try {
    logger.debug("running query")
    let results = await contentGet("/services?national=false")
    res.send(results)
  }
  catch (err) {
    res.send(404, err)
  }
})


const formatStrapiRequest = (userData) => {
  let queryString = qs.stringify({_where : Object.keys(userData).map(key => {
    switch (key) {
      case "age": return  [{ minAge_lte: Number(userData.age) }, { maxAge_gte: Number(userData.age)}]
      case "virtualness": return [{_or: [].concat(userData.virtualness).reduce((accumulator,item) =>{return [...accumulator, {'virtualnesses.name': item}]}, [])}]
      case "diagnosis" : return {'diagnoses.name': userData.diagnosis}
      case "national" : return {national: userData.national}
      // case "care" : return [{_or: [].concat(userData.care).reduce((accumulator,item) =>{return [...accumulator, {'tags.name': item}]}, [])}]
    }
}).reduce((clauses, singleClause)=> clauses.concat(singleClause), [])})
  return (queryString)
}

const phoneData = {}

const formatTemplatedMessage = (message, data) => {
  const templatedRegexMatches = [...message.matchAll(/\(\(([^\)]*)\)\)/igm)]
  return templatedRegexMatches.reduce((adjustedMessage, regexMatch)=> adjustedMessage.replace(regexMatch[0], data[regexMatch[1]]), message)
}

app.get("/text-triage", async (req, res) => {
  let nextChatState = await getNextChatState()
  const name = req.session.data.name 
  let phoneNumber = req.session.data.phoneNumber.replace(/\D/g,'').replace(/^07|^00447/,"447")
  let message = [].concat(nextChatState.message).map(eachMessage => {
      return formatTemplatedMessage(eachMessage, req.session.data)
    }).join("\n\n\n")
    govNotifyAPI.sendMessage(message,phoneNumber)
    .then(result=>{
      phoneData[phoneNumber] = {
        "name":`${name}`,
        "phoneNumber":`${phoneNumber}`,
        "sentMessages": [`${result.content.body}`],
        "receivedMessages":[],
        "chatState": nextChatState.chatState,
        "history": _.get(phoneData,phoneNumber + ".history", []).concat([result]),
        "data":{}
      }
      res.redirect('/text-service-confirm')
    })
    .catch(err => {
      logger.warn(err)
      res.redirect('/text-service-error')
    })
})

const callStrapiApi = async (endpoint, query) => {
  const token = await contentAuth()
  const contentGet = bent(process.env.CONTENT_API_URL,'json',{
    Authorization:
    'Bearer ' + token.jwt
  })
  try {
    let results = await contentGet("/" + endpoint + "?" + query)
    return results 
  } catch (err){
    logger.error(err)
    return err
  }
}


app.post("/api/message-callback", async (req,res) => {
  const messageReceived = req.body.message
  const phoneNumber = req.body.source_number
  if (phoneData[phoneNumber] == undefined) {
    phoneData[phoneNumber] = {"name": ''}}
  
  const currentChatState = phoneData[phoneNumber].chatState

  let nextChatState = await getNextChatState(currentChatState,messageReceived)

  let message = [].concat(nextChatState.message).map(eachMessage => {
    return formatTemplatedMessage(eachMessage, phoneData[phoneNumber] )
  }).join("\n\n\n")

  phoneData[phoneNumber] = {
    ...phoneData[phoneNumber],
    "receivedMessages":_.get(phoneData,phoneNumber + ".receivedMessages", []).concat([req.body.message]),
    "chatState": nextChatState.chatState,
    "data":{..._.get(phoneData,phoneNumber + ".data"),...nextChatState.data},
    "history": _.get(phoneData,phoneNumber + ".history", []).concat([req.body])
  } 

  govNotifyAPI.sendMessage(message,phoneNumber)
    .then(result=>{
      phoneData[phoneNumber] = {
        ...phoneData[phoneNumber],
        "sentMessages":_.get(phoneData,phoneNumber + ".sentMessages", []).concat([result.content.body]),
        "history": _.get(phoneData,phoneNumber + ".history", []).concat([result])
      } 
      logger.info("response sent")

    })
    .catch(err => {
      logger.info("error sending response", err)
    })


  if (nextChatState.chatState === 100) {
    phoneData[phoneNumber] = {
      ...phoneData[phoneNumber],
        "data":{..._.get(phoneData,phoneNumber + ".data"), age: messageReceived}
      }

    // let messages = await callStrapiApi("services", "id=6047e095d129840015b3c37b&id=6047e096d129840015b3c38e&id=6047e095d129840015b3c37e")
    let messages = await filteredResults(phoneData[phoneNumber].data)
    
    firstThree = messages.slice(0,3)

    formattedMessages = getServicesArray(firstThree)

    formattedMessages.forEach(async message => {
      let result = await govNotifyAPI.sendMessage(message,phoneNumber)
      logger.info("response sent")
      phoneData[phoneNumber] = {
        ...phoneData[phoneNumber],
        "sentMessages":_.get(phoneData,phoneNumber + ".sentMessages", []).concat([result.content.body]),
        "history": _.get(phoneData,phoneNumber + ".history", []).concat([result])
      } 
    })
    }
})

const sendOutShutdownMessage = async () => {
  let promises = Object.entries(phoneData).map((item) => {
    const message = "Thanks for taking part in the Gloucester NHS prototype testing. The chatbot won’t reply to you after the research session. If you need to talk to someone about your mental health, here are some options:\n\ntic+chat is an anonymous, safe, confidential, 1-2-1 support service for young people aged 9-21 living in Gloucestershire. It’s open 5-9pm, Sunday to Thursday. Website: https://www.ticplus.org.uk/ticpluschat/.\nKooth provides free online counselling and a support network, available 24/7. Website: https://www.kooth.com/."
    return govNotifyAPI.sendMessage(message,item[1].phoneNumber)
    .then(logger.info("Shutdown message sent" ))
    .catch (err => {logger.info("Error sending message", err)})    
  })
  return Promise.all(promises)   
}

// Use custom application routes
app.use('/', routes);

// Automatically route pages
app.get(/^([^.]+)$/, function (req, res, next) {
  automaticRouting.matchRoutes(req, res, next)
})

// Check if the app is using documentation
if (useDocumentation || onlyDocumentation == 'true') {
  // Documentation routes
  app.use('/docs', documentationApp);

  // Nunjucks configuration for documentation
  var docViews = [
    path.join(__dirname, 'docs/views/'),
    path.join(__dirname, 'node_modules/nhsuk-frontend/packages/components')
  ]

  var nunjucksAppEnv = nunjucks.configure(docViews, {
    autoescape: true,
    express: documentationApp
  });
  nunjucksAppEnv.addGlobal('version', packageInfo.version);

  // Add Nunjucks filters
  utils.addNunjucksFilters(nunjucksAppEnv)

  // Automatically store all data users enter
  if (useAutoStoreData === 'true') {
    documentationApp.use(utils.autoStoreData)
    utils.addCheckedFunction(nunjucksAppEnv)
  }

  // Support for parsing data in POSTs
  documentationApp.use(bodyParser.json());
  documentationApp.use(bodyParser.urlencoded({
    extended: true
  }))

  // Custom documentation routes
  documentationApp.use('/', documentationRoutes);

  // Automatically route documentation pages
  documentationApp.get(/^([^.]+)$/, function (req, res, next) {
    automaticRouting.matchRoutes(req, res, next)
  })

}



// Clear all data in session if you open /mental-health-check-in/clear-data
app.post('/mental-health-check-in/clear-data', function (req, res) {
  req.session.data = {}
  res.redirect('/landing-page')
})

// Redirect all POSTs to GETs - this allows users to use POST for autoStoreData
app.post(/^\/((?!api)[^.]+)$/, function (req, res) {
  res.redirect('/' + req.params[0])
})

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error(`Page not found: ${req.path}`)
  err.status = 404
  next(err)
})

// Display error
app.use(function (err, req, res, next) {
  if (err) { 
    logger.error(err.message)
    res.status(err.status || 500).send(err.message)

  }
})

// Run the application
server = app.listen(port, (err, data) => {
  if (err) {
    logger.error(err)
  }});

process
  .on('SIGTERM', shutdown('SIGTERM'))
  .on('SIGINT',shutdown('SIGINT'))
  .on('uncaughtException',shutdown('uncaughtException'));

function shutdown(signal) {
  return (err) => {
    if (err) logger.error(err.stack || err);
    sendOutShutdownMessage()
    .then(() => {
      logger.info("shutdown messages all sent")
      phoneData = {}
      logger.info("phoneData cleared")
      process.exit(err ? 1 : 0);})
    .catch(() => {
      logger.warn("problem sending shutdown messages")
      process.exit(err ? 1 : 0);
    })
    
  };
}

module.exports = {app, server};
