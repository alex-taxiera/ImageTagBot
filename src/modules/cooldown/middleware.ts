import { CommandMiddleware } from '@hephaestus/eris'
import { CooldownHandler } from './CooldownHandler'

export const cooldownMiddlewareFactory = (
  cooldownHandler: CooldownHandler,
): CommandMiddleware => ({
  // failMessage: 'Try again later!',
  action: (interaction) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = interaction.member?.user ?? interaction.user!
    const cooldownTime = cooldownHandler
      .getCoolDownTime(user.id)

    if (cooldownTime != null) {
      throw Error(`Try again in ${(cooldownTime / 1000).toFixed(0)}s`)
    }

    cooldownHandler.addEntry(user.id)
  },
})
