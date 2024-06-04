import { ANSI, FontEffect } from "./enums.js";

export class Debug {
  static #log = console.log;

  static log(message: string, ...args: any[]): void {
    const label = Debug.#paint("[LOG]: ", ANSI.BRIGHT_BLACK);
    this.#log(label + message, ...args);
  }

  static error(message: string, ...args: any[]): void {
    const label = Debug.#paint("[ERROR]: ", ANSI.RED, FontEffect.BOLD);
    this.#log(label + message, ...args);
  }

  static status(message: string, ...args: any[]): void {
    const label = Debug.#paint("[STATUS]: ", ANSI.GREEN, FontEffect.BOLD);
    this.#log(label + message, ...args);
  }

  static disable() {
    // @ts-ignore: disable logging by passing an empty function
    // eslint-disable-next-line
    this.#log = (..._) => {};
  }

  static enable() {
    this.#log = console.log;
  }

  static #paint(message: string, color: ANSI, effect?: FontEffect): string {
    let paint: string | ANSI = color;

    switch (effect) {
      case FontEffect.BOLD:
        paint = color.replace("m", ";") + effect + "m";
    }

    return `${paint}${message}${ANSI.RESET}`;
  }
}
