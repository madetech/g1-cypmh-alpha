/**
* Automatically route pages
*
* Try to match a request to a template, for example a request for /test
* would look for /app/views/test.html and /app/views/test/index.html
*
* 1. Try to render the path
* 2. if success - send the response
* 3. if error other than template not found - call next with the error
* 4. Maybe it's a folder - try to render [path]/index.html
* 5. We got template not found both times - call next to trigger the 404 page
* 6. Remove the first slash, render won't work with it
* 7. If it's blank, render the root index
**/

function renderPath (path, res, next) {
  res.render(path, function (error, html) { // [1] //
    if (!error) {
      res.set({ 'Content-type': 'text/html; charset=utf-8' }) // [2] //
      res.end(html)
      return
    }
    
    if (error.message.startsWith('template not found')){

      if (path.substr(0,8)==="showcase") {
        path = path.substr(9)
        renderPath(path, res, next)
      }
    }
    if (!error.message.startsWith('template not found')) { // [3] //
      next(error) 
      return
    }
    if (!path.endsWith('/index')) {
      renderPath(path + '/index', res, next) // [4] //
      return
    }
    next() // [5] //
  })
}

exports.matchRoutes = function (req, res, next) {
  let encodedAuth = req.headers.authorization.split(" ")[1]
  let buff = new Buffer.from(encodedAuth, 'base64')
  let decodedAuth = buff.toString('ascii')
  let decodedUser = decodedAuth.split(":")[0]

  var path = req.path

  
  path = path.substr(1) // [6] //

  
  if (path === '') { // [7] //
    path = 'index'
  }

  if (path === 'logout') {
    res.status(401)
    path = 'index'
  }

  if (decodedUser == process.env.SHOWCASE_USER) {
    path = 'showcase/'+ path
  }
  renderPath(path, res, next)
}
