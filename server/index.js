const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');

const { PORT, dev } = require('./config');

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler(); // next config

// connect to db

nextApp.prepare().then(() => {
	// Express goes here
	const app = express();
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	// require API routes here
	app.use('/api/index', require('./routes/index'));

	// Any routes not yet specified should just be handled by React
	app.get('*', (req, res) => {
		return handle(req, res);
	})

	app.listen(PORT, err => {
		if (err) throw err;
		console.log(`Ready at http://localhost:${PORT}`);
	});
});
