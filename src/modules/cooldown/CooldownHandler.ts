interface CooldownEntry {
  userId: string
  timestamp: number
}

export class CooldownHandler {
  constructor (
    private readonly time = 60_000 * 5,
    private readonly amount = 5
  ) {}

  private readonly entries: CooldownEntry[] = []

  public addEntry (userId: string): void {
    this.entries.push({
      userId,
      timestamp: Date.now()
    })
  }

  public getCoolDownTime (userId: string): number | undefined {
    const entries = this.entries
      .filter((e) => e.userId === userId)
      .sort((a, b) => a.timestamp - b.timestamp)

    if (entries.length < this.amount || entries.length < 1) {
      return
    }

    let oldestEntry = entries.shift()
    const now = Date.now()
    while (oldestEntry && (now - oldestEntry.timestamp) > this.time) {
      this.entries.splice(this.entries.findIndex((e) => e === oldestEntry))
      oldestEntry = entries.shift()
    }

    if (!oldestEntry || entries.length < this.amount - 1) {
      return
    }

    return this.time - (now - oldestEntry.timestamp)
  }
}
