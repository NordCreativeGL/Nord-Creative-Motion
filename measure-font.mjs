import { createCanvas } from 'canvas';

const canvas = createCanvas(2000, 200);
const ctx = canvas.getContext('2d');
ctx.font = '200 100px Montserrat';

const letters = ['N', 'O', 'R', 'D', 'C', 'R', 'E', 'A', 'T', 'I', 'V', 'E'];
let x = 0;
const spacing = 14;
const positions = {};

for (const letter of letters) {
  const w = ctx.measureText(letter).width;
  positions[letter] = { x: Math.round(x), width: Math.round(w) };
  x += w + spacing;
}

console.log('Total width:', Math.round(x));
console.log('Letter positions:', JSON.stringify(positions, null, 2));
console.log('O center x:', Math.round(positions['O'].x + positions['O'].width / 2));
console.log('I center x:', Math.round(positions['I'].x + positions['I'].width / 2));
