const url = require('url');
const shoppingList = require('./shoppingData.js');

// GET /shopping - Retrieves the list of items
exports.getItems = function(req, res) {
  const response = [
    {
      message: 'Here is your shopping list'
    },
    shoppingList
  ];
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response));
};

// POST /shopping - Adds a new item to the shopping list
exports.addItem = function(req, res) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const postBody = JSON.parse(body);
    const newItem = {
      id: shoppingList.length + 1, // Assign a new ID
      item: postBody.item,
      quantity: postBody.quantity
    };
    shoppingList.push(newItem);

    const response = [
      {
        message: 'Item added successfully'
      },
      newItem
    ];

    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
  });
};

// Handles invalid URLs (404)
exports.invalidUrl = function(req, res) {
  const availableEndpoints = [
    {
      method: 'GET',
      endpoint: '/shopping'
    },
    {
      method: 'POST',
      endpoint: '/shopping'
    }
  ];

  const response = [
    {
      message: 'Oops! That is a wrong endpoint, here are the available endpoints:'
    },
    availableEndpoints
  ];

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response));
};
