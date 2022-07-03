const dockerSecretEnv = require('docker-secret-env')

dockerSecretEnv.load()

module.exports = {
  ...process.env,
}
