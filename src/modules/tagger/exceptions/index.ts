export interface ImgurException {
  type: 'ImgurException'
  code: number
  message: string
  exception: unknown
}

export class ImgurError extends Error implements ImgurException {
  public readonly type: 'ImgurException' = 'ImgurException'
  public code: number
  public exception: unknown
  constructor (error: ImgurException) {
    super(error.message)

    this.code = error.code
    this.exception = error.exception
  }
}
