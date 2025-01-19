const fs = require('fs');
const path = require('path');
const origFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) {
    return console.log(err);
  }

  fs.readdir(copyFolder, (err, copyFiles) => {
    if (err) {
      return console.log(err);
    }
    copyFiles.forEach((file) => {
      fs.unlink(path.join(copyFolder, file), (err) => {
        if (err) {
          return console.log('Error Found:', err);
        }
      });
    });

    fs.readdir(origFolder, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach((file) => {
          const origFile = path.join(__dirname, 'files', file);
          const copyFile = path.join(__dirname, 'files-copy', file);
          fs.copyFile(origFile, copyFile, (err) => {
            if (err) {
              console.log('Error Found:', err);
            }
          });
        });
      }
    });
  });
});
