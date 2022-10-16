const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const { stringify } = require('querystring');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }
  
  localStorage.setItem('myFirstKey', 'myFirstValue');
  console.log(localStorage.getItem('myFirstKey'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Osjomj070521!',
    database: 'CTFLOGIN'
});

    const app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));


app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/login.html'))
});


app.post('/auth', function(request, response){
    const password = request.body.password;
    const username = request.body.username;
    
    if (password && username ) {
    
    //connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
    console.log(`SELECT * FROM login WHERE username = '${username}' AND password = '${password}'`);
    connection.query(`SELECT * FROM login WHERE username = '${username}' AND password = '${password}'`, function(error, results, fields) {
    
    if (error) throw error;
    
    if (results.length > 0) {
        request.session.loggedin = true;
        request.session.username = username;
        
        response.redirect('/home');
    }
    else    {
        response.send('incorrect valuer');
    }
    response.end();
    });
    }else {
        response.send("Put your username or password");
        response.end();
    }
    
});

app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname + '/landing.html'))
    } else {
      response.send("You're not logged in");
    }
  });

app.get('/blog', function(request, response){
    response.sendFile(path.join(__dirname + '/blog.html'))
});

app.listen(3000);