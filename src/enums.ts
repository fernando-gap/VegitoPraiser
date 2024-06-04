export enum Color {
  CERULEAN = 0x0180fe,
  MIDNIGHT = 0x002774,
  TURQUOISE = 0x5bd9df,
  FROST = 0x94fdff,
  APRICOT = 0xf5af5d,
  MINT = 0x3eb489,
  INDIAN_RED = 0xcd5c5c,
}

export enum Emoji {
  POTARA_EARRINGS = "<:potaraearrings:1193378255407951982>",
  SENZU_BEANS = "<:senzubeans:1196163480269619230>",
  VEGITO_GI = "<:vegitogi:1195760497249755207>",
  DRAGON_BALL = "<:dragonball:1193963653788090479>",
  FLYING_NIMBUS = "<:flyingnimbus:1194292069108297778>",
}

export enum ANSI {
  RED = "\x1b[31m",
  GREEN = "\x1b[32m",
  RESET = "\x1b[0m",
  BRIGHT_BLACK = "\x1b[90m",
}

export enum FontEffect {
  BOLD = "1",
}

export enum ReminderType {
  DISABLED = 0,
  HOURLY = 1,
  DAILY = 2,
}

/* util */
export enum Environment {
  DEV = "-dev",
  PROD = "-prod",
}
