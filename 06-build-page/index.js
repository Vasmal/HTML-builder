const fs = require('fs');
const path = require('path');
const projectFolder = path.join(__dirname, 'project-dist');
const styleFiles = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist', 'style.css');
const projectAssets = path.join(projectFolder, 'assets');
const srcAssets = path.join(__dirname, 'assets');
const components = path.join(__dirname, 'components');

async function makeProject(dir) {
  await fs.promises.mkdir(dir, { recursive: true });

  async function deleteFolder(folderPath) {
    const entries = await fs.promises.readdir(folderPath, {
      withFileTypes: true,
    });
    for (let entry of entries) {
      const entryPath = path.join(folderPath, entry.name);

      if (entry.isDirectory()) {
        await deleteFolder(entryPath);
      } else {
        await fs.promises.unlink(entryPath);
      }
    }
  }

  await deleteFolder(projectFolder);

  await fs.promises.writeFile(bundle, '');

  // const styles = await fs.promises.readdir(styleFiles, { withFileTypes: true });
  // for() => {
  //   if (style.isFile()) {
  //     const filePath = path.join(styleFiles, style.name);
  //     const ext = path.extname(filePath);
  //     if (ext === '.css') {
  //       const input = await fs.promises.readFile(filePath);
  //       input.pipe(output);
  //     }
  //   }
  // });

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

  async function copyFolder(srcFolder, destFolder) {
    await fs.promises.mkdir(destFolder, { recursive: true });
    const entries = await fs.promises.readdir(srcFolder, {
      withFileTypes: true,
    });
    for (let entry of entries) {
      const srcPath = path.join(srcFolder, entry.name);
      const destPath = path.join(destFolder, entry.name);

      if (entry.isDirectory()) {
        await copyFolder(srcPath, destPath);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }
  }
  copyFolder(srcAssets, projectAssets);

  const html = path.join(projectFolder, 'index.html');
  const template = path.join(__dirname, 'template.html');
  let htmlData = await fs.promises.readFile(template, 'utf-8');
  const componentsFiles = await fs.promises.readdir(components, {
    withFileTypes: true,
  });

  for (let file of componentsFiles) {
    const ext = path.extname(path.join(components, file.name));
    if (ext === '.html') {
      const component = file.name.replace(ext, '');
      if (htmlData.includes(`{{${component}}}`)) {
        const componentPath = path.join(components, file.name);
        const componentData = await fs.promises.readFile(
          componentPath,
          'utf-8',
        );
        htmlData = htmlData.replaceAll(`{{${component}}}`, componentData);
      }
    }
  }

  fs.writeFile(html, htmlData, (err) => {
    if (err) {
      console.log(err);
    }
  });
}
makeProject(projectFolder);
