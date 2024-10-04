const fs = require('fs'); // pull in the file system module

const dataset = fs.readFileSync(`${__dirname}/../assets/jsonDatasets/pokedex.json`);

const getAll = (request, response, status) => {
  const content = JSON.stringify(dataset);
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

const getByName = (request, response, status, name) => {
  let content = JSON.stringify(dataset);
  const contentArray = content.split(' ');
  const arrayLength = contentArray.length;
  content = '';
  for (let i = 0; i < arrayLength; i++) {
    if (contentArray[i].includes(name)) {
      content += contentArray[i];
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
  let content = JSON.stringify(dataset);
  const contentArray = content.split(' ');
  const arrayLength = contentArray.length;
  content = '';
  for (let i = 0; i < arrayLength; i++) {
    if (contentArray[i].includes(type)) {
      content += contentArray[i];
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
  let content = JSON.stringify(dataset);
  const contentArray = content.split(' ');
  const arrayLength = contentArray.length;
  content = '';
  for (let i = 0; i < arrayLength; i++) {
    if (contentArray[i].includes(weakness)) {
      content += contentArray[i];
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

// set out public exports
module.exports = {
  getAll,
  getByType,
  getByName,
  getByWeakness,
};
