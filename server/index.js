const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const cors = require('cors');
// For production security and efficiency
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { PORT, dev, pool } = require('./config');

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler(); // next config

nextApp.prepare().then(() => {
	// Express goes here
	const app = express();
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(compression());
	app.use(helmet());

	// Securing cors
	const origin = {
		origin: dev ? '*' :  'https://www.domain.com'
	}
	app.use(cors(origin));
	// Rate limiting
	const limiter = rateLimit({
		windowMs: 1*60*1000, // 1 minute window
		max: 1000 // max 5 requests
	});
	app.use(limiter);

	// require API routes here
	app.use('/api/index', require('./routes/index'));

	const getBooks = (request, response) => {
	  pool.query('SELECT * FROM books', (error, results) => {
	    if (error) {
	      throw error
	    }
	    response.status(200).json(results.rows)
	  })
	}

	const addBook = (request, response) => {
	  const { author, title } = request.body

	  pool.query('INSERT INTO books (author, title) VALUES ($1, $2)', [author, title], error => {
	    if (error) {
	      throw error
	    }
	    response.status(201).json({ status: 'success', message: 'Book added.' })
	  })
	}

	app.route('/books').get(getBooks).post(addBook)

	// Any routes not yet specified should just be handled by React
	app.get('*', (req, res) => {
		return handle(req, res);
	})

	app.listen(PORT, err => {
		if (err) throw err;
		console.log(`Ready at http://localhost:${PORT}`);
	});
});
