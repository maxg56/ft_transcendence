// src/utils/censor.ts

const forbiddenWords = [
  'merde', 'con', 'pute', 'abruti', 'salope', 'connard', 'batard', 'enculé', // ...
];

export function censorMessage(content: string): { censored: string, count: number } {
  let censored = content;
  let count = 0;
  for (const word of forbiddenWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(censored)) {
      censored = censored.replace(regex, '***');
      count++;
    }
  }
  return { censored, count };
}
