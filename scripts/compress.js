const fs = require('fs');
const path = require('path');
const ChromeExtension = require('crx');

const NAME = 'demagogcz-chrome-extension'

const crx = new ChromeExtension({
  privateKey: fs.readFileSync('./key.pem')
});

crx.load(path.resolve(__dirname, '../build'))
  .then(crx => crx.pack())
  .then(crxBuffer => {
    fs.writeFileSync(`${NAME}.crx`, crxBuffer);
  });
