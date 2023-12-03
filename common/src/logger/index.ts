export enum LEVEL {
  DEBUG,
  INFO,
}

export const logger = {
  level: LEVEL.INFO,
  prefix: "",

  setLevel: (level: LEVEL) => {
    logger.level = level;
  },

  setPrefix: (prefix: string) => {
    logger.prefix = prefix;
  },

  info: (message: string, ...args: Array<any>) => {
    if (logger.level <= LEVEL.INFO) {
      console.log(formatMessage(LEVEL.INFO, message, args));
    }
  },

  debug: (message: string, ...args: Array<any>) => {
    if (logger.level <= LEVEL.DEBUG) {
      console.log(formatMessage(LEVEL.DEBUG, message, args));
    }
  },
};

const formatMessage = (level: LEVEL, message: string, args: any[]): string => {
  let levelPrefix = "";
  if (level == LEVEL.INFO) {
    levelPrefix = "[INFO]";
  } else if (level == LEVEL.DEBUG) {
    levelPrefix = "[DEBUG]";
  }
  return (
    `${logger.prefix} ${levelPrefix} "` +
    message
      .replace(/{(\d+)}/g, (match, index) => {
        const argIndex = parseInt(index, 10);
        const argValue = args[argIndex];

        return typeof argValue === "object"
          ? JSON.stringify(argValue)
          : argValue;
      })
      .trim()
  );
};
