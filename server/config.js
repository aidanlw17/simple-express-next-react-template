require('dotenv').config(); // use environment variables defined in .env

const { Pool } = require('pg');

// Define port configuration and dev/production
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_DEV !== 'production';

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
const pool = new Pool({
	connectionString: dev ? connectionString : process.env.DATABASE_URL,
	ssl: !dev
});

module.exports = { PORT: PORT, dev: dev, pool: pool }
