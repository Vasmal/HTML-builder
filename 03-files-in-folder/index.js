const fs = require('fs');
const path = require('path');
const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        const name = file.name;
        const filePath = path.join(secretFolderPath, name);
        const ext = path.extname(filePath);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.log(err);
            return;
          }
          const size = stats.size;
          console.log(
            `${name.replace(ext, '')} - ${ext.replace('.', '')} - ${size}`,
          );
        });
      }
    });
  }
});
