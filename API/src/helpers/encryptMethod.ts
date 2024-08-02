export const encryptMethod = async (password: string): Promise<string> => {
  let result = "";
  let decalage = password.length + 4;
  const forbiddenChars = ['"', "'", '\\', '/', '<', '>', '&', '%', '@', '`', '?', " ", "%", "|"];

  for (let i = 0; i < password.length; i++) {
    let charCode = password.charCodeAt(i);
    let newCharCode = charCode + decalage;

    if (newCharCode < 32 || newCharCode > 126) {
      newCharCode = ((newCharCode - 32) % 95) + 32;
    }

    let newChar = String.fromCharCode(newCharCode);
    while (forbiddenChars.includes(newChar)) {
      newCharCode++;
      if (newCharCode > 126) newCharCode = 32;
      newChar = String.fromCharCode(newCharCode);
    }
    result += newChar;
  }

  return result;
};
