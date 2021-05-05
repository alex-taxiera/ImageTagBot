import { Command } from '@tagger'

export default new Command({
  name: 'info',
  description: 'Get info on a tag.',
  options: {
    aliases: [ 'about' ],
    parameters: [ 'tag id' ]
  },
  run: function (bot, { params }) {
    const id = params[0]
    if (!id) {
      return 'Missing id!'
    }

    return bot.getTag(id).then((tag) => {
      if (!tag) {
        return `Tag \`${id}\` doesn't exist`
      }

      const user = bot.users.get(tag.get('user'))
      return {
        embed: {
          author: {
            name: `${user?.username ?? 'ERR'}#${user?.discriminator ?? 'ERR'}`,
            icon_url: user?.avatarURL
          },
          thumbnail: {
            url: bot.IMAGE_REGEXP
              .test(<string>tag.get('src')) ? <string>tag.get('src') : ''
          },
          fields: [
            {
              name: 'Tag Name',
              value: <string>tag.get('id')
            },
            {
              name: 'Tag Source',
              value: <string>tag.get('src')
            },
            {
              name: 'Use Count',
              value: <string>tag.get('count')
            }
          ]
        }
      }
    })
  }
})
