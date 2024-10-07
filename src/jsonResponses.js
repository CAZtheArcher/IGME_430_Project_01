const fs = require('fs'); // pull in the file system module

const dataset = JSON.parse(fs.readFileSync(`${__dirname}/../assets/jsonDatasets/pokedex.json`));

// Get Request Response
const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }

  response.end();
};

// Get Requests

const getAll = (request, response) => {
  respondJSON(request, response, 200, dataset);
};

const getByName = (request, response) => {
  let name = request.headers.get('Pokemon-Name');
  name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const content = dataset.filter((x) => x.name === name);
  respondJSON(request, response, 200, content);
};

const getByType = (request, response) => {
  let type = request.headers.get('Pokemon-Type');
  type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  const content = dataset.filter((x) => x.type.includes(type));
  respondJSON(request, response, 200, content);
};

const getByWeakness = (request, response) => {
  let weakness = request.headers.get('Pokemon-Weakness');
  weakness = weakness.charAt(0).toUpperCase() + weakness.slice(1).toLowerCase();
  const content = dataset.filter((x) => x.weakness.includes(weakness));
  respondJSON(request, response, 200, content);
};

// function for 404 not found requests with message
const notFound = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // return a 404 with an error message
  respondJSON(request, response, 404, responseJSON);
};

// Post Requests

// set out public exports
module.exports = {
  getAll,
  getByType,
  getByName,
  getByWeakness,
  notFound,
};
