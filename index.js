var httpProxy = require('http-proxy');
var http = require('http');

var proxy = new httpProxy.createProxyServer({
	target: {
		host: 'localhost',
		port: 8080
	}
});

var proxyServer = http.createServer(function (req, res) {
	// Set CORS headers
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', '*');
	if ( req.method === 'OPTIONS' ) {
		res.writeHead(200);
		res.end();
		return;
	}

	proxy.web(req, res);
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
	proxyReq.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	proxyReq.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS"); 
});

// Listen to the `upgrade` event and proxy the
// WebSocket requests as well.
//
proxyServer.on('upgrade', function(req, socket, head) {
	proxy.ws(req, socket, head);
});

proxyServer.listen(8015);
