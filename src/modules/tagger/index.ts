import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'
import fetch from 'node-fetch'
import config from 'config'

import {
  ImgurError,
  ImgurException,
} from './exceptions'
import { streamFromBuffer } from '~modules/file'

import { prisma } from '~modules/utils/db'
import type { Tag } from '@prisma/client'

export const validTypes = [ 'image', 'video' ] as const

export class UploadValidationError extends Error {}

const API_URL = 'https://api.imgur.com/3'

const imgurClientId: string = config.get('IMGUR_CLIENT_ID')

export const IMAGE_REGEXP = /^(?:https|http):?\/.*\.(\w+)/

export async function uploadToImgur (
  src: string,
  type: typeof validTypes[number] = 'image',
  title: string = 'Cool Image',
): Promise<string> {
  const res = await fetch(src)
  const data = await res.buffer()
  const metadata = await fileTypeFromBuffer(data)

  if (
    !metadata ||
    validTypes.every((type) => !metadata.mime.startsWith(type))
  ) {
    throw new UploadValidationError('Not an image or video!')
  }

  const size = Buffer.byteLength(data)

  if (size > 1024 * 1024 * (type === 'image' ? 10 : 200)) {
    throw new UploadValidationError('File is too big!')
  }

  const stream = streamFromBuffer(data)
  const form = new FormData()
  form.append('title', title)
  form.append(type, stream, {
    filename: 'test.gif',
    contentType: res.headers.get('content-type') ?? undefined,
    knownLength: size,
  })
  form.append('type', 'file')

  const body = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      ...form.getHeaders(),
      Authorization: `Client-ID ${imgurClientId}`,
    },
    body: form,
  }).then(async (res) =>
    await res.json() as { data: { error?: ImgurException, link?: string } },
  )

  const {
    data: { error, link },
  } = body

  if (error) {
    throw new ImgurError(error)
  } else if (link == null) {
    throw Error('No Link')
  }

  return link
}

export async function upsertTag (
  data: Pick<Tag, 'id'> & Partial<Omit<Tag, 'id'>>,
): Promise<Tag> {
  const exists = await prisma.tag.findUnique({
    where: { id: data.id },
  })

  if (exists) {
    return await prisma.tag.update({
      where: { id: data.id },
      data: {
        ...data,
      },
    })
  }

  const {
    id,
    user,
    src,
    count,
  } = data

  if (id == null || user == null || src == null) {
    throw new Error('Could not create tag: Missing data')
  }

  return await prisma.tag.create({
    data: {
      id, user, src, count,
    },
  })
}

export async function getTag (id: string): Promise<Tag | null> {
  return await prisma.tag.findUnique({ where: { id } })
}

export async function getTagsForUser (user: string): Promise<Tag[]> {
  return await prisma.tag.findMany({ where: { user } })
}

export async function autocompleteSuggestions (
  id: string,
  userId?: string,
): Promise<Tag[]> {
  const exact = await getTag(id)
  const similar = await prisma.tag.findMany({
    where: { id: { contains: id, not: id }, user: userId },
    take: 25, // limited for discord autocomplete
  })

  if (exact) {
    return [ exact, ...similar.slice(24) ]
  }

  return similar
}

export async function incrementTagCount (
  id: string,
): Promise<number | undefined> {
  const tag = await getTag(id)
  if (tag) {
    const count = tag.count + 1
    await upsertTag({ id, count })
    return count
  }
}
