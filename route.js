const http = require('http');
const url = require('url');
const shoppingOps = require('./controller');

module.exports = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (reqUrl.pathname === '/shopping' && req.method === 'GET') {
    shoppingOps.getItems(req, res);
  } else if (reqUrl.pathname === '/shopping' && req.method === 'POST') {
    shoppingOps.addItem(req, res);
  } else if (reqUrl.pathname === '/shopping' && req.method === 'PUT') {
    shoppingOps.updateItem(req, res);
  } else if (reqUrl.pathname === '/shopping' && req.method === 'DELETE') {
    shoppingOps.deleteItem(req, res);
  } else {
    shoppingOps.invalidUrl(req, res);
  }
});
