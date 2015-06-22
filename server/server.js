var loopback = require('loopback');
var boot = require('loopback-boot');

//Initialize Logger
var log4js = require('log4js');
log4js.configure('server/log4js_configuration.json', {});
var logger = log4js.getLogger('app');

var app = module.exports = loopback();

app.log4js = log4js;


app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
    app.log4js.getLogger('app').debug('App started');
  });
};




// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

app.get('remoting').errorHandler = {
  handler: function(err, req, res, defaultHandler) {
  	err = app.buildError(err);
    var ret = {};
    ret.message = 'Unexpected Error occured on server when processing request!';
    ret.status = err.statusCode;
    app.log4js.getLogger('app').error('Sever Internal Error : ' + err.message);
    res.status(err.statusCode).json(ret);

    // send the error back to the original handlero
    defaultHandler(err);
  },
  disableStackTrace: true
}

app.buildError = function(err) {
  err.message =  err.message;
  return err;
}
