const fs = require('fs'); // pull in the file system module

const dataset = fs.readFileSync(`${__dirname}/../assets/jsonDatasets/pokedex.json`);
