const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');
const readline = require('readline');
const rl = readline.createInterface(stdin, stdout);
stdout.write('Hello, write anything you like\n');
const file = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(file);

function stopReadline() {
  console.log('Good Bye');
  rl.close();
}

rl.on('line', (input) => {
  if (input === 'exit') {
    stopReadline();
    return;
  }
  output.write(`${input}\n`);
});

rl.on('SIGINT', stopReadline);
