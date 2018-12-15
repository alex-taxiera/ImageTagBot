const { Command } = require('eris-boiler')
const { get } = require('superagent')

const IMAGE_REGEXP = new RegExp(/^(https|http):?\/(.*).(png|jpeg|jpg|gif|gifv)/)

module.exports = (bot) => new Command(
  bot,
  {
    name: 'tag',
    description: 'Finds, Adds, Remove, or Edit tags',
    options: {
      parameters: ['query'],
      deleteInvoking: false,
      deleteResponse: false,
      subCommands: [add, remove, update, list, search, info]
    },
    run: async function ({ bot, msg, params }) {
      const key = params[0]
      const tag = await bot.tag.getTag(key)
      if (!tag) return `Tag \`${key}\` doesn't exists`

      const { body } = await get(tag.src)
      const ext = tag.src.toLowerCase().match(IMAGE_REGEXP).pop()
      bot.tag.incrementTagCount(tag.key).catch((error) => bot.logger.error('failed to count', error))

      return { file: { file: body, name: `${tag.key}.${ext}` } }
    }
  }
)

const add = (bot) => new Command(
  bot,
  {
    name: 'add',
    description: 'Add a tag',
    options: {
      aliases: ['create'],
      parameters: ['tag key']
    },
    run: async function ({ bot, msg, params }) {
      const [key, url] = params
      const src = msg.attachments.length > 0 ? msg.attachments[0].url : url
      const tag = await bot.tag.getTag(key)

      if (!key) return 'Missing key!'
      if (tag) return `Tag \`${key}\` already exists`
      if (!src) return 'Please attach an image or specify a url!'
      if (!IMAGE_REGEXP.test(src.toLowerCase())) return 'Not an image!'

      try {
        const result = await bot.imgur.upload(src)
        if (!result.data) throw Error('No data from imgur')
        try {
          const { data } = result
          await bot.tag.addTag(msg.author.id, key, data.link)
          return `Added \`${key}\``
        } catch (error) {
          console.log(error)
          switch (error.code) {
            default:
              return `An unkown error occurred \`${error.message}\``
          }
        }
      } catch (error) {
        console.log(error)
        switch (error.code) {
          default:
            return `An unknown error has occurred \`${error.message}\``
        }
      }
    }
  }
)

const remove = (bot) => new Command(
  bot,
  {
    name: 'remove',
    description: 'Add a tag',
    options: {
      aliases: ['delete', 'del', 'rm'],
      parameters: ['tag key']
    },
    run: async function ({ bot, msg, params }) {
      const key = params[0]
      const tag = await bot.tag.getTag(key)
      if (!tag) return 'Tag doesn\'t exist'
      if (msg.author.id !== tag.userId) return 'You cannot remove tags you do not own!'

      await bot.tag.removeTag(key)
      return `Deleted tag \`${key}\``
    }
  }
)

const update = (bot) => new Command(
  bot,
  {
    name: 'update',
    description: 'Update a tag',
    options: {
      aliases: ['edit'],
      parameters: ['tag key']
    },
    run: async function ({ bot, msg, params }) {
      const [key, url] = params
      const src = msg.attachments.length > 0 ? msg.attachments[0].url : url

      if (!key) return 'Missing key!'
      const tag = await bot.tag.getTag(key)
      if (!tag) return 'Tag doesn\'t exist'
      if (msg.author.id !== tag.userId) return 'You cannot update tags you do not own!'
      if (!src) return 'Please attach an image or specify a url!'
      if (!IMAGE_REGEXP.test(src)) return 'Not an image!'

      try {
        await get(src)
      } catch (err) {
        return 'Bad link!'
      }

      try {
        const result = await bot.imgur.upload(src)
        if (!result.data) throw Error('No data from imgur')
        try {
          const { data } = result
          await bot.tag.updateTag(key, data.link)
          return `Update tag \`${key}\``
        } catch (error) {
          console.log(error)
          switch (key) {
            default:
              return `An unknown error occurred \`${error.message}\``
          }
        }
      } catch (error) {
        console.log(error)
        switch (key) {
          default:
            return `An unknown error occurred \`${error.message}\``
        }
      }
    }
  }
)

const list = (bot) => new Command(
  bot,
  {
    name: 'list',
    description: 'List your tags',
    run: async function ({ bot, msg, params }) {
      const tags = await bot.tag.selectTagsForUser(msg.author.id)
      if (!tags) return 'No tags found for you.'

      return {
        embed: {
          title: `${msg.author.username} Tags.`,
          description: tags.map(({ key }) => key).join('\n')
        }
      }
    }
  }
)

const search = (bot) => new Command(
  bot,
  {
    name: 'search',
    description: 'Search all tags',
    options: {
      aliases: ['find'],
      parameters: ['query']
    },
    run: async function ({ bot, msg, params }) {
      const query = params[0]
      const tags = await bot.tag.searchLikeTags(query)
      if (!tags || tags.length < 1) return 'No tags found.'

      return {
        embed: {
          title: 'Search results',
          description: tags.map(({ key }) => key).join('\n')
        }
      }
    }
  }
)

const info = (bot) => new Command(
  bot,
  {
    name: 'info',
    description: 'Get info on a tag.',
    options: {
      aliases: ['about'],
      parameters: ['tag key']
    },
    run: async function ({ bot, msg, params }) {
      const key = params[0]
      const tag = await bot.tag.getTag(key)
      if (!tag) return `Tag \`${key}\` doesn't exists`
      const user = bot.users.get(tag.userId)

      return {
        embed: {
          author: {
            name: `${user.username}#${user.discriminator}`,
            icon_url: user.avatarURL
          },
          thumbnail: { url: IMAGE_REGEXP.test(tag.src) ? tag.src : '' },
          fields: [
            {
              name: 'Tag Name',
              value: tag.key
            },
            {
              name: 'Tag Source',
              value: tag.src
            },
            {
              name: 'Use Count',
              value: tag.count
            }
          ]
        }
      }
    }
  }
)
