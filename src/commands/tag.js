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
      subCommands: [add, remove, update, list, search, info, top]
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

      if (!key) return 'Missing key!'
      if (!src) return 'Please attach an image or specify a url!'
      if (!IMAGE_REGEXP.test(src.toLowerCase())) return 'Not an image!'

      let exists
      try {
        exists = await bot.tag.getTag(key)
      } catch (error) {
        return 'The database encountered an error!'
      }
      if (exists) return `Tag \`${key}\` already exists`

      let uploaded
      try {
        uploaded = await bot.imgur.upload(src)
        if (!uploaded.data) {
          throw Error('No data from imgur')
        }
      } catch (error) {
        return 'There was a problem uploading your image!'
      }

      try {
        await bot.tag.addTag(msg.author.id, key, uploaded.data.link)
        return `Added \`${key}\``
      } catch (error) {
        return 'There was a problem updating the database!'
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
      if (!key) return 'Missing key!'

      let tag
      try {
        tag = await bot.tag.getTag(key)
      } catch (error) {
        return 'The database encountered an error!'
      }
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
      if (!src) return 'Please attach an image or specify a url!'
      if (!IMAGE_REGEXP.test(src)) return 'Not an image!'

      let tag
      try {
        tag = await bot.tag.getTag(key)
      } catch (error) {
        return 'The database encountered an error!'
      }
      if (!tag) return 'Tag doesn\'t exist'

      if (msg.author.id !== tag.userId) return 'You cannot update tags you do not own!'

      let uploaded
      try {
        uploaded = await bot.imgur.upload(src)
        if (!uploaded.data) {
          throw Error('No data from imgur')
        }
      } catch (error) {
        return 'There was a problem uploading your image!'
      }

      try {
        await bot.tag.updateTag(key, uploaded.data.link)
        return `Update tag \`${key}\``
      } catch (error) {
        return 'There was a problem updating the database!'
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
      let tags
      try {
        tags = await bot.tag.selectTagsForUser(msg.author.id)
      } catch (error) {
        return 'The database encountered an error!'
      }
      if (!tags) return 'No tags found for you.'

      return {
        embed: {
          title: `${msg.author.username}'s Tags`,
          description: tags.map(({ key, count }) => `${key} (${count})`).join('\n')
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
      if (!query) return 'No query!'

      let tags
      try {
        tags = await bot.tag.searchLikeTags(query)
      } catch (error) {
        return 'The database encountered an error!'
      }
      if (!tags || tags.length < 1) return 'No tags found.'

      return {
        embed: {
          title: 'Search Results',
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
      if (!key) return 'Missing key!'

      let tag
      try {
        tag = await bot.tag.getTag(key)
      } catch (error) {
        return 'The database encountered an error!'
      }
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

const top = (bot) => new Command(
  bot,
  {
    name: 'top',
    description: 'top 10 tags',
    run: async ({ bot }) => {
      let tags
      try {
        tags = await bot.tag.selectAllTags()
      } catch (error) {
        return 'The database encountered an error!'
      }
      if (!tags || tags.length < 1) return 'No tags found.'

      return {
        embed: {
          title: 'Top 10 Tags!',
          description: tags
            .sort(({ count: a }, { count: b }) => b - a)
            .slice(10)
            .map(({ key, count }) => `${key} (${count})`)
            .join('\n')
        }
      }
    }
  }
)
