const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  ...process.env,
  NODE_ENV: process.env.NODE_ENV ?? 'development',
}
