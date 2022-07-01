import { CommandMiddleware } from '@hephaestus/eris'
import { CooldownHandler } from './CooldownHandler'

export const cooldownMiddlewareFactory = (
  cooldownHandler: CooldownHandler,
): CommandMiddleware => ({
  // failMessage: 'Try again later!',
  action: async (interaction) => {
    const msg = await interaction.getOriginalMessage()
    const cooldownTime = cooldownHandler
      .getCoolDownTime(msg.author.id)

    if (cooldownTime != null) {
      throw Error(`Try again in ${(cooldownTime / 1000).toFixed(0)}s`)
    }

    cooldownHandler.addEntry(msg.author.id)
  },
})
