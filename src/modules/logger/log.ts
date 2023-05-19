import log from 'loglevel'
import prefix from 'loglevel-plugin-prefix'
import chalk, { ChalkInstance } from 'chalk'
import config from 'config'

const colors: Record<string, ChalkInstance> = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
}

prefix.reg(log)
log.setDefaultLevel(config.get('LOG_LEVEL') ?? 'info')

prefix.apply(log, {
  format: (level, _, timestamp) => {
    return `${
      chalk.gray(`[${timestamp.toString()}]`)
    } ${
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      colors[level.toUpperCase()]!(`[${level}]`)
    }`
  },
})

prefix.apply(log.getLogger('critical'), {
  format (level, name, timestamp) {
    return chalk.red
      .bold(`[${timestamp.toString()}] ${level} ${name != null ? name : ''}:`)
  },
})

/* eslint-disable @typescript-eslint/unbound-method */
export default {
  trace: log.trace,
  debug: log.debug,
  info: log.info,
  warn: log.warn,
  error: log.error,
  critical: log.getLogger('critical').info,
}
/* eslint-enable @typescript-eslint/unbound-method */
