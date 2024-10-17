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
  if (!request.query.name) {
    const responseJSON = {
      message: 'Missing name query parameter.',
    };
    return respondJSON(request, response, 400, responseJSON);
  }
  const name = request.query.name.charAt(0).toUpperCase()
  + request.query.name.slice(1).toLowerCase();
  const content = dataset.filter((x) => x.name === name);
  return respondJSON(request, response, 200, content);
};

const getByType = (request, response) => {
  if (!request.query.type) {
    const responseJSON = {
      message: 'Missing type query parameter.',
    };
    return respondJSON(request, response, 400, responseJSON);
  }
  const type = request.query.type.charAt(0).toUpperCase()
  + request.query.type.slice(1).toLowerCase();
  const content = dataset.filter((x) => x.type.includes(type));
  return respondJSON(request, response, 200, content);
};

const getByWeakness = (request, response) => {
  if (!request.query.weakness) {
    const responseJSON = {
      message: 'Missing weakness query parameter.',
    };
    return respondJSON(request, response, 400, responseJSON);
  }
  const weakness = request.query.weakness.charAt(0).toUpperCase()
  + request.query.weakness.slice(1).toLowerCase();
  const content = dataset.filter((x) => x.weakness.includes(weakness));
  return respondJSON(request, response, 200, content);
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

const addPokemon = async (request, response) => { // default json message
  const responseJSON = {
    message: 'Name, type, and weakness are all required.',
  };

  // grab name and age out of request.body for convenience
  // If either name or age do not exist in the request,
  // they will be set to undefined
  const { name, type, weight, height } = request.body;

  // check to make sure we have both fields
  // We might want more validation than just checking if they exist
  // This could easily be abused with invalid types (such as booleans, numbers, etc)
  // If either are missing, send back an error message as a 400 badRequest
  if (!name || !type || !weakness) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 204 updated
  let responseCode = 204;

  const filteredDataset = dataset.filter((x) => x.name === name);
  if(filteredDataset.length() != 0){
    return editPokemon(request, response); //if mon already exists, edit that one instead.
  }
  let imageURL;
  let monExists = await fetch('https://pokeapi.co/api/v2/pokemon/' + name);
  let obj = await monExists.json();
  let monExistsString = JSON.stringify(obj);
  if(monExistsString != "Not Found"){
    let idString = monExists.id.toString();
    if(idString.length < 3){
      if(idString.length > 1){
        idString = "0" + idString;
      }else{
        idString = "00" + idString;
      }
    }
    imageURL = "http://www.serebii.net/pokemongo/pokemon/" + idString + ".png";
  } else{
    imageURL = "";
  }

  let getWeak = await fetch('https://pokeapi.co/api/v2/type/' + type);
  let weaknessess = [];
  for(let i=0; i < getWeak.damage_relations.half_damage_from.length(); i++){
    weaknessess.push(getWeak.damage_relations.half_damage_from[i].name);
  }
  for(let i=0; i < getWeak.damage_relations.no_damage_from.length(); i++){
    weaknessess.push(getWeak.damage_relations.no_damage_from[i].name);
  }

  const newMon = {
    id: dataset.length + 1,
    num: (dataset.length + 1).toString(),
    img: imageURL,
    type: type,
    height: height + " m",
    weight: weight + " kg", 
    weakness: weaknessess,
  }

  dataset.push(newMon);

  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // When we send back a 204 status code, it will not send response
  // body. However, if we didn't pass in an object as the 4th param
  // to our respondJSON function it would break. So we send in an
  // empty object, which will stringify to an empty string.
  return respondJSON(request, response, responseCode, {});
};

const editPokemon = (request, response) => {
  const responseJSON = {
    message: 'the name of the Pokemon is required.',
  };

  // grab name and age out of request.body for convenience
  // If either name or age do not exist in the request,
  // they will be set to undefined
  const { name, type, weakness } = request.body;
  const fixedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const fixedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  const fixedWeakness = weakness.charAt(0).toUpperCase() + weakness.slice(1).toLowerCase();
  const filteredDataset = dataset.filter((x) => x.name === fixedName);

  // check to make sure we have both fields
  // We might want more validation than just checking if they exist
  // This could easily be abused with invalid types (such as booleans, numbers, etc)
  // If either are missing, send back an error message as a 400 badRequest
  if (!name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  if (filteredDataset.length() === 0) {
    responseJSON.id = 'doesn\'tExist';
    responseJSON.message = 'That pokemon doesn\'t exist in our database yet. please send a pokemon who exists in our database';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 204 updated
  const responseCode = 204;

  // add or update fields for this pokemon name
  filteredDataset[0].type = fixedType;
  filteredDataset[0].weakness = fixedWeakness;

  // When we send back a 204 status code, it will not send response
  // body. However, if we didn't pass in an object as the 4th param
  // to our respondJSON function it would break. So we send in an
  // empty object, which will stringify to an empty string.
  return respondJSON(request, response, responseCode, {});
};

// set out public exports
module.exports = {
  getAll,
  getByType,
  getByName,
  getByWeakness,
  addPokemon,
  editPokemon,
  notFound,
};
