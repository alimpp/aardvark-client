// server.js
const express = require('express');
const history = require('connect-history-api-fallback');
const app = express();

const env = process.env.NODE_ENV || 'development';

const forceSsl = function(req, res, next) {
	if (req.headers['x-forwarded-proto'] !== 'https') {
		return res.redirect(['https://', req.get('Host'), req.url].join(''));
	}
	return next();
};


const staticFileMiddleware = express.static(__dirname +  "/dist");

if (env === 'production' || env === 'staging') {
	app.use(forceSsl);
}

//1st call for unredirected requests
app.use(staticFileMiddleware);

app.use(history({
	disableDotRule: true,
	verbose: true
}));

//2nd call for redirected requests
app.use(staticFileMiddleware);

const port =  process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});
