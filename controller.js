const fs = require('fs');
const path = require('path');
const url = require('url');


const filePath = path.join(__dirname, 'shoppingData.json');


function readShoppingList() {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}


function writeShoppingList(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}


exports.getItems = function (req, res) {
  const shoppingList = readShoppingList();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    message: 'Here is your shopping list',
    shoppingList,
  }));
};

exports.addItem = function (req, res) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const postBody = JSON.parse(body);
    const shoppingList = readShoppingList();

    const newItem = {
      id: shoppingList.length + 1,
      item: postBody.item,
      quantity: postBody.quantity || 1,
    };
    shoppingList.push(newItem);
    writeShoppingList(shoppingList);

    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      message: 'Item added successfully',
      newItem,
    }));
  });
};


exports.updateItem = function (req, res) {
  const reqUrl = url.parse(req.url, true);
  const id = parseInt(reqUrl.query.id);

  if (!id) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Invalid item ID' }));
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const postBody = JSON.parse(body);
    const shoppingList = readShoppingList();
    const item = shoppingList.find((item) => item.id === id);

    if (item) {
      item.item = postBody.item || item.item;
      item.quantity = postBody.quantity || item.quantity;
      writeShoppingList(shoppingList);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        message: 'Item updated successfully',
        updatedItem: item,
      }));
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Item not found' }));
    }
  });
};


exports.deleteItem = function (req, res) {
  const reqUrl = url.parse(req.url, true);
  const id = parseInt(reqUrl.query.id);

  if (!id) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Invalid item ID' }));
    return;
  }

  const shoppingList = readShoppingList();
  const index = shoppingList.findIndex((item) => item.id === id);

  if (index !== -1) {
    const deletedItem = shoppingList.splice(index, 1);
    writeShoppingList(shoppingList);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      message: 'Item deleted successfully',
      deletedItem,
    }));
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Item not found' }));
  }
};


exports.invalidUrl = function (req, res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    message: 'Invalid endpoint. Available endpoints are:',
    endpoints: [
      { method: 'GET', endpoint: '/shopping' },
      { method: 'POST', endpoint: '/shopping' },
      { method: 'PUT', endpoint: '/shopping?id=<id>' },
      { method: 'DELETE', endpoint: '/shopping?id=<id>' },
    ],
  }));
};
