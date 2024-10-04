const fs = require('fs'); // pull in the file system module

const dataset = JSON.parse(fs.readFileSync(`${__dirname}/../assets/jsonDatasets/pokedex.json`));

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

const getAll = (request, response) => {
  respondJSON(request, response, 200, dataset);
};

const getByName = (request, response, status, name) => {
  const arrayLength = dataset.length;
  let content = '';
  for (let i = 0; i < arrayLength; i++) {
    if (dataset[i].name.toUpperCase() === name.toUpperCase()) {
      content += JSON.stringify(dataset[i]);
    }
  }
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  // HEAD requests don't get a body with their response.
  // Similarly, 204 status codes are "no content" responses
  // so they also do not get a response body.
  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }

  response.end();
};

const getByType = (request, response, status, type) => {
  const arrayLength = dataset.length;
  let content = '';
  for (let i = 0; i < arrayLength; i++) {
    if (dataset[i].name.toUpperCase() === type.toUpperCase()) {
      content += JSON.stringify(dataset[i]);
    }
  }
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  // HEAD requests don't get a body with their response.
  // Similarly, 204 status codes are "no content" responses
  // so they also do not get a response body.
  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }

  response.end();
};

const getByWeakness = (request, response, status, weakness) => {
  const arrayLength = dataset.length;
  let content = '';
  for (let i = 0; i < arrayLength; i++) {
    if (dataset[i].name.toUpperCase() === weakness.toUpperCase()) {
      content += JSON.stringify(dataset[i]);
    }
  }
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  // HEAD requests don't get a body with their response.
  // Similarly, 204 status codes are "no content" responses
  // so they also do not get a response body.
  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }

  response.end();
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

// set out public exports
module.exports = {
  getAll,
  getByType,
  getByName,
  getByWeakness,
  notFound,
};
