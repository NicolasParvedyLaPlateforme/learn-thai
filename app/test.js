const fs = require('fs');
const tsConfig = require('./tsconfig.json');
const text = 'เก้าอี้';
const characters = [];
for (let i = 0; i < text.length; i++) {
  characters.push(text[i]);
}
console.log(characters);
