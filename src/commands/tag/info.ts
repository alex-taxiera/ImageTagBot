import { CommandResults } from 'eris-boiler'
import { Command } from '@tagger'

export default new Command({
  name: 'info',
  description: 'Get info on a tag.',
  options: {
    aliases: [ 'about' ],
    parameters: [ 'tag key' ]
  },
  run: function (bot, { params }): CommandResults {
    const key = params[0]
    if (!key) {
      return 'Missing key!'
    }

    return bot.getTag(key).then((tag) => {
      if (!tag) {
        return `Tag \`${key}\` doesn't exist`
      }

      const user = bot.users.get(tag.get('user'))
      return {
        embed: {
          author: {
            name: `${user?.username ?? 'ERR'}#${user?.discriminator ?? 'ERR'}`,
            icon_url: user?.avatarURL // eslint-disable-line @typescript-eslint/camelcase
          },
          thumbnail: {
            url: bot.IMAGE_REGEXP.test(tag.get('src')) ? tag.get('src') : ''
          },
          fields: [
            {
              name: 'Tag Name',
              value: tag.get('key')
            },
            {
              name: 'Tag Source',
              value: tag.get('src')
            },
            {
              name: 'Use Count',
              value: tag.get('count')
            }
          ]
        }
      }
    })
  }
})
