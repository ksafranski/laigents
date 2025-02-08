import chalk from "chalk";

type LogColor = "blue" | "green" | "teal" | "yellow" | "orange" | "purple";

const colorMap: Record<LogColor, chalk.ChalkFunction> = {
  blue: chalk.blue,
  green: chalk.green,
  teal: chalk.cyan,
  yellow: chalk.yellow,
  orange: chalk.hex("#FFA500"),
  purple: chalk.magenta,
};

const AVAILABLE_COLORS: LogColor[] = [
  "blue",
  "green",
  "teal",
  "yellow",
  "orange",
  "purple",
];

export class Logger {
  private static contextMap = new Map<string, LogColor>();
  private context: string;
  private color: chalk.ChalkFunction;

  constructor(context: string, preferredColor?: LogColor) {
    this.context = context;

    // If this context already exists, use its assigned color
    if (Logger.contextMap.has(context)) {
      const existingColor = Logger.contextMap.get(context)!;
      this.color = colorMap[existingColor];
      return;
    }

    // If a preferred color is specified and not in use, use it
    if (
      preferredColor &&
      !Array.from(Logger.contextMap.values()).includes(preferredColor)
    ) {
      Logger.contextMap.set(context, preferredColor);
      this.color = colorMap[preferredColor];
      return;
    }

    // Find the first available color that's not in use
    const usedColors = new Set(Logger.contextMap.values());
    const availableColor = AVAILABLE_COLORS.find(
      (color) => !usedColors.has(color)
    );

    if (availableColor) {
      // If we found an unused color, use it
      Logger.contextMap.set(context, availableColor);
      this.color = colorMap[availableColor];
    } else {
      // If all colors are in use, pick one randomly
      const randomColor =
        AVAILABLE_COLORS[Math.floor(Math.random() * AVAILABLE_COLORS.length)];
      Logger.contextMap.set(context, randomColor);
      this.color = colorMap[randomColor];
    }
  }

  static getContextColors(): Record<string, LogColor> {
    return Object.fromEntries(Logger.contextMap);
  }

  private getTimestamp(): string {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const ms = now.getMilliseconds().toString().padStart(3, "0");
    return chalk.gray(`${time}.${ms}`);
  }

  private formatMessage(message: string): string {
    return `${this.getTimestamp()} [${this.color(this.context)}]: ${message}`;
  }

  log(message: string): void {
    console.log(this.formatMessage(message));
  }

  error(message: string): void {
    console.error(this.formatMessage(chalk.red(message)));
  }

  warn(message: string): void {
    console.warn(this.formatMessage(chalk.yellow(message)));
  }

  info(message: string): void {
    console.info(this.formatMessage(chalk.blue(message)));
  }

  success(message: string): void {
    console.log(this.formatMessage(chalk.green(message)));
  }
}
