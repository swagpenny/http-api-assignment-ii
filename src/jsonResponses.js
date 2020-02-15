const users = {}; // to be added in

const respond = (req, res, status, object) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  if (req.method !== 'HEAD' || status === 204) res.write(JSON.stringify(object));
  res.end();
};

const getUsers = (req, res) => {
  respond(req, res, 200, { users });
};

const addUser = (req, res, query) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };


  if (!query.name || !query.age) {
    responseJSON.id = 'missingParams';
    return respond(req, res, 400, responseJSON);
  }
  let responseCode = 201;

  if (users[query.name]) responseCode = 204;

  users[query.name] = {
    name: query.name,
    age: query.age,
  };

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respond(req, res, responseCode, responseJSON);
  }
  return respond(req, res, responseCode);
};

const notReal = (req, res) => {
  respond(req, res, 404, {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  });
};
module.exports = {
  getUsers,
  addUser,
  notReal,
};
