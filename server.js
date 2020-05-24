// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');

var db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ todos: [] })
  .write();

app.set('view engine', 'pug');
app.set('views', './views')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.send("I love CodersX");
});
  
app.get("/todos", (req, res) => {
  res.render("index.pug", {
    todos: db.get('todos').map('todo').value()
  });
});

app.get("/todos/search", function(req, res) {
  var q = req.query.q;
  var matchedTodos = db.get('todos').value().filter(function(todo){
    return todo.toLowerCase().indexOf(q.toLowerCase()) !== -1
  })
  
  res.render('index.pug', {
    todos: matchedTodos
  })
});



app.get('/todos/create', function(req, res){
  res.render('create.pug')
})

app.post('/todos/create', function(req, res){
  db.get('todos').push(req.body.name).write();
  res.redirect('/todos')
})


// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
