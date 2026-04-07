
export interface PasswordOptions {
  length: number;
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
}

export function generatePassword(options: PasswordOptions): string {
  const charSets = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  };

  let allowedChars = '';
  if (options.upper) allowedChars += charSets.upper;
  if (options.lower) allowedChars += charSets.lower;
  if (options.numbers) allowedChars += charSets.numbers;
  if (options.symbols) allowedChars += charSets.symbols;

  // Garantir que pelo menos um conjunto seja selecionado
  if (allowedChars === '') allowedChars = charSets.lower + charSets.numbers;

  let password = '';
  for (let i = 0; i < options.length; i++) {
    password += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
  }

  // Garantir que a senha contenha pelo menos um de cada tipo selecionado (melhoria opcional)
  // Mas para o LastPass, a geração básica aleatória costuma bastar se for longa.

  return password;
}
