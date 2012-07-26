// Module dependencies

var express    = require('express'),
    mysql      = require('mysql');

// Application initialization

var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'password'
    });
    
var app = module.exports = express.createServer();

// Database setup

connection.query('CREATE DATABASE test', function (err) {
    if (err) throw err;
    connection.query('USE test', function (err) {
        if (err) throw err;
        connection.query('CREATE TABLE users('
            + 'id INT NOT NULL AUTO_INCREMENT,'
            + 'PRIMARY KEY(id),'
            + 'name VARCHAR(30)'
            +  ')', function (err) {
                if (err) throw err;
            });
    });
});

// Configuration

app.use(express.bodyParser());

// Main route sends our HTML file

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

// Update MySQL database

app.post('/users', function (req, res) {
    connection.query('INSERT INTO users SET ?', req.body, 
        function (err, result) {
            if (err) throw err;
            res.send('sUer added to database with ID: ' + result.insertId);
        }
    );
});

// Begin listening

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);