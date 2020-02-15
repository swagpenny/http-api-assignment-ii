const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': jsonHandler.getUsers,
    notReal: jsonHandler.notReal,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsers,
    notReal: jsonHandler.notReal,
  },
};

/* taken from body-parse example code */
const handlePost = (req, res, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    const body = [];

    // 400 reutrn, bad request
    req.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    req.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      jsonHandler.addUser(req, res, bodyParams);
    });
  }
};


const onRequest = (req, res) => {
  const parsedUrl = url.parse(req.url);

  const args = query.parse(parsedUrl.query);

  Object.defineProperty(args, 'type', {
    value: req.headers.accept.split(',')[0],
    writable: false,
  });

  if (req.method === 'POST') {
    handlePost(req, res, parsedUrl);
  } else if (urlStruct[req.method][parsedUrl.pathname]) {
    urlStruct[req.method][parsedUrl.pathname](req, res);
  } else {
    urlStruct[req.method].notReal(req, res);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on localhost:${port}`);
