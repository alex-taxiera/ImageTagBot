import { Command } from '@tagger'

export default new Command({
  name: 'top',
  description: 'top 10 tags', // TODO: add sub commands for guild/user top 10 ("help top" for filters)
  run: function (bot) {
    return bot.getTags().then((tags) => {
      if (!tags.length) {
        return 'No tags found.'
      }

      return {
        embed: {
          title: 'Top 10 Tags!',
          description: tags
            .sort((a, b) => b.get('count') - a.get('count'))
            .slice(0, 10)
            .map(
              (dbo) => `${<string>dbo.get('id')} (${<string>dbo.get('count')})`
            )
            .join('\n')
        }
      }
    })
  }
})
