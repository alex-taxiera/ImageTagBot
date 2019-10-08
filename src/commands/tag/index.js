const { Command } = require('eris-boiler')
const { get } = require('superagent')

const add = require('./add')
const remove = require('./remove')
const update = require('./update')
const list = require('./list')
const search = require('./search')
const info = require('./info')
const top = require('./top')

module.exports = new Command({
  name: 'tag',
  description: 'Finds, Adds, Remove, or Edit tags',
  options: {
    parameters: ['query'],
    deleteInvoking: false,
    deleteResponse: false,
    subCommands: [add, remove, update, list, search, info, top]
  },
  run: async function ({ bot, msg, params }) {
    const key = params[0]
    const tag = await bot.dbm.getTag(key)
    if (!tag) return `Tag \`${key}\` doesn't exists`

    const { body } = await get(tag.src)
    const ext = tag.src.toLowerCase().match(bot.IMAGE_REGEXP).pop()
    bot.dbm.incrementTagCount(tag.key)
      .catch((error) => bot.logger.error('failed to count', error))

    return { file: { file: body, name: `${tag.key}.${ext}` } }
  }
})
