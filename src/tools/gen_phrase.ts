const phraseLength = 32;

const chars = '+-./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~';
let result = '';

for (let i = 0; i < phraseLength; i++) {
  const random = Math.floor(Math.random() * chars.length);
  result += chars.slice(random, random + 1);
}

console.log(result);
