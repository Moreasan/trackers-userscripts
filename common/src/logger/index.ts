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
      console.log(formatMessage(logger.level, message, args));
    }
  },

  debug: (message: string, ...args: Array<any>) => {
    // Log debug messages if level is 'debug'
    if (logger.level <= LEVEL.DEBUG) {
      console.log(formatMessage(logger.level, message, args));
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

        // Stringify objects and arrays
        return typeof argValue === 'object' ? JSON.stringify(argValue) : argValue;

      })
      .trim()
  );
};
