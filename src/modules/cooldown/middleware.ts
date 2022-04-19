import { CommandMiddleware } from '@tagger'
import { CooldownHandler } from './CooldownHandler'

export const cooldownMiddlewareFactory = (
  cooldownHandler: CooldownHandler
): CommandMiddleware => new CommandMiddleware({
  failMessage: 'Try again later!',
  run: (_, context) => {
    const cooldownTime = cooldownHandler
      .getCoolDownTime(context.msg.author.id)

    if (cooldownTime) {
      throw Error(`Try again in ${(cooldownTime / 1000).toFixed(0)}s`)
    }

    cooldownHandler.addEntry(context.msg.author.id)
  }
})
