export enum Quality {
  Major,
  Minor,
  Augmented,
  Diminished,
  Perfect,
}

type MajorMinorQuality =
  | Quality.Major
  | Quality.Minor
  | Quality.Augmented
  | Quality.Diminished
type PerfectQuality = Quality.Perfect | Quality.Augmented | Quality.Diminished

export function isMajorMinor(value: Quality): value is MajorMinorQuality {
  return [
    Quality.Major,
    Quality.Minor,
    Quality.Augmented,
    Quality.Diminished,
  ].includes(value)
}

export function isPerfect(value: Quality): value is PerfectQuality {
  return [Quality.Perfect, Quality.Augmented, Quality.Diminished].includes(
    value
  )
}

const mapping = {
  M: Quality.Major,
  m: Quality.Minor,
  '+': Quality.Augmented,
  o: Quality.Diminished,
  P: Quality.Perfect,
} as const

const reverseMapping = new Map(Object.entries(mapping).map(([k, v]) => [v, k]))

const names = {
  [Quality.Major]: 'major',
  [Quality.Minor]: 'minor',
  [Quality.Augmented]: 'augmented',
  [Quality.Diminished]: 'diminished',
  [Quality.Perfect]: 'perfect',
}

export function format(quality: Quality, long: boolean = false): string {
  const result = long ? names[quality] : reverseMapping.get(quality)
  if (result === undefined) {
    throw new Error('unknown quality: ' + Quality[quality])
  }
  return result
}

export function parse(str: string): Quality {
  const result = mapping[str as keyof typeof mapping]
  if (result === undefined) {
    throw new Error('unknown quality: ' + str)
  }
  return result
}
