import { createCommand } from '@hephaestus/eris'
import {
  getTag,
  uploadToShare,
  upsertTag,
} from '~modules/tagger'

export const add = createCommand({
  type: 1,
  name: 'add',
  description: 'Add a tag',
  options: [
    {
      type: 3, name: 'id', description: 'The tag id', required: true,
    },
    {
      type: 3, name: 'url', description: 'The tag url', required: true,
    },
    // {
    //   type: 11,
    //   name: 'attachment',
    //   description: 'The tag attachment',
    //   required: false,
    // },
  ] as const,
  action: async (interaction, args) => {
    // const id = args.id.value

    // const attachmentOption = subCommand.options
    //   ?.find((option) => option.name === 'attachment')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // const url = args.url.value // = attachmentOption?.type === 11 ? attachmentOption.value : null

    // if (url == null) {
    //   if (urlOption?.type !== 3) {
    //     await interaction.createMessage({
    //       content: 'Please provide a url or attachment',
    //       flags: 64,
    //     })
    //     return
    //   }
    //   url = urlOption.value
    // }

    const tag = await getTag(args.id.value)
    if (tag) {
      await interaction.createMessage({
        content: `Tag \`${args.id.value}\` already exists`,
        flags: 64,
      })
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = interaction.member?.user ?? interaction.user!

    let newSrc: string | undefined
    try {
      await interaction.defer(64)
      newSrc = await uploadToShare(args.url.value, user.id)
    } catch (error) {
      await interaction.createMessage({
        content: 'Failed to upload tag',
        flags: 64,
      })
      return
    }
    // try {
    //   await interaction.defer(64)
    //   newSrc = await uploadToImgur(args.url.value)
    // } catch (e) {
    //   if (e instanceof ImgurError) {
    //     switch (e.code) {
    //       case 1003: {
    //         await interaction.createMessage({
    //           content: 'Tag url is not an image',
    //           flags: 64,
    //         })
    //         return
    //       }
    //       default: {
    //         await interaction.createMessage({
    //           content: 'Failed to upload tag',
    //           flags: 64,
    //         })
    //         return
    //       }
    //     }
    //   } else if (e instanceof UploadValidationError) {
    //     await interaction.createMessage({
    //       content: e.message,
    //       flags: 64,
    //     })
    //     return
    //   } else {
    //     throw e
    //   }
    // }
    await upsertTag({
      id: args.id.value, user: user.id, src: newSrc,
    })

    await interaction.createMessage({
      content: `Tag \`${args.id.value}\` added`,
      flags: 64,
    })
  },
})
