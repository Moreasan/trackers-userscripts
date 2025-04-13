import GM_fetch from "@trim21/gm-fetch";


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
          ? stringifyWithoutDOM(argValue)
          : argValue;
      })
      .trim()
  );
};

const stringifyWithoutDOM = (obj: any) => {
  const seen = new WeakSet(); // Use a WeakSet to track visited objects

  function replacer(_key: string, value: any) {
    if (value instanceof Node) {
      // Ignore DOM elements
      return undefined;
    }

    if (typeof value === "object" && value !== null) {
      // Check for circular references
      if (seen.has(value)) {
        return "[Circular Reference]";
      }

      seen.add(value);
    }

    return value;
  }

  return JSON.stringify(obj, replacer);
};
