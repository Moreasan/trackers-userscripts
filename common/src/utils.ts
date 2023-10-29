const isValidStartingChar = (char: string) => /[a-zA-Z$_]/.test(char);

const isValidChar = (char: string) => /[a-zA-Z0-9$_]/.test(char);

export const transformVariableName = (varName: string): string => {
  if (!varName) return '_';

  let transformedName = '';

  for (let i = 0; i < varName.length; i++) {
    if (i === 0 && !isValidStartingChar(varName[i])) {
      transformedName += '_';
    }
    if (isValidChar(varName[i])) {
      transformedName += varName[i];
    } else {
      transformedName += '_';
    }
  }

  return transformedName;
}
