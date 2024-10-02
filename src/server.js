const http = require('http'); // http module
const query = require('querystring'); // querystring module
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/getUsers': jsonHandler.getUsers,
  '/notReal': jsonHandler.notFound,
  notFound: jsonHandler.notFound,
};

const parseBody = (request, response, handler) => {
  // The request will come in in pieces, which we store in this array.
  const body = [];

  // The body reassembly process is event driven, much like when we are streaming
  // media like videos, etc. We will set up a few event handlers. This first one
  // is for if there is an error. If there is, write it to the console and send
  // back a 400-Bad Request error to the client.
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // The second possible event is the "data" event. This gets fired when we
  // get a piece (or "chunk") of the body. Each time we do, we will put it in
  // the array. We will always recieve these chunks in the correct order.
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // The final event is when the request is finished sending and we have recieved
  // all of the information. When the request "ends", we can proceed. Turn the body
  // array into a single entity using Buffer.concat, then turn that into a string.
  // With that string, we can use the querystring library to turn it into an object
  // stored in bodyParams. We can do this because we know that the client sends
  // us data in X-WWW-FORM-URLENCODED format. If it was in JSON we could use JSON.parse.
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    request.body = query.parse(bodyString);

    // Once we have the bodyParams object, we will call the handler function. We then
    // proceed much like we would with a GET request.
    handler(request, response);
  });
};

// handle POST requests
const handlePost = (request, response, parsedUrl) => {
  // If they go to /addUser
  if (parsedUrl.pathname === '/addUser') {
    // Call our below parseBody handler, and in turn pass in the
    // jsonHandler.addUser function as the handler callback function.
    parseBody(request, response, jsonHandler.addUser);
  }
};

// function to handle requests
const onRequest = (request, response) => {
  // parse url into individual parts
  // returns an object of url parts by name
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  // check if method was POST, otherwise check URLstruct for path.
  if (request.method === 'POST') {
    return handlePost(request, response, parsedUrl);
  } if (urlStruct[parsedUrl.pathname]) {
    return urlStruct[parsedUrl.pathname](request, response);
  }
  return urlStruct.notFound(request, response);
};

// start server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
