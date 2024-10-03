const http = require('http');
const url = require('url');
const shoppingOps = require('./controller.js');

module.exports = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  // GET endpoint to retrieve the shopping list
  if (reqUrl.pathname === '/shopping' && req.method === 'GET') {
    console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
    shoppingOps.getItems(req, res);

  // POST endpoint to add a new item to the shopping list
  } else if (reqUrl.pathname === '/shopping' && req.method === 'POST') {
    console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
    shoppingOps.addItem(req, res);

  // 404: Invalid URL
  } else {
    console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
    shoppingOps.invalidUrl(req, res);
  }
});
