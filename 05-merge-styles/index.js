const fs = require('fs');
const path = require('path');

const styleFiles = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist', 'bundle.css');

async function pipe() {
  await fs.promises.writeFile(bundle, '');

  const files = await fs.promises.readdir(styleFiles, { withFileTypes: true });
  for (let file of files) {
    if (file.isFile()) {
      const filePath = path.join(styleFiles, file.name);
      const ext = path.extname(filePath);
      if (ext === '.css') {
        const input = await fs.promises.readFile(filePath, 'utf-8');
        await fs.promises.appendFile(bundle, input);
      }
    }
  }
}

pipe();
