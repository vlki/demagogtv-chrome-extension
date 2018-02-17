const fs = require('fs');
const path = require('path');
const ChromeExtension = require('crx');

const NAME = 'demagogtv-chrome-extension';

const crx = new ChromeExtension({
  privateKey: fs.readFileSync('./key.pem')
});

crx.load(path.resolve(__dirname, '../build'))
  .then(() => crx.loadContents())
  .then((archiveBuffer) => {
    fs.writeFileSync(`${NAME}.zip`, archiveBuffer);

    crx.pack(archiveBuffer).then((crxBuffer) => {
      fs.writeFileSync(`${NAME}.crx`, crxBuffer);
    });
  });
