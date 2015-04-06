// Module dependencies
var express    = require('express'),
    mysql      = require('mysql');

// Application initialization
var connection = mysql.createConnection({
    host     : 'cwolf.cs.sonoma.edu',
    user     : 'jvillegas',
    password : '4644515'
});

var app = module.exports = express.createServer();


// Database setup
connection.query('USE jvillegas', function (err) {
    if (err) throw err;
});


function handleError(res, error) {
    console.log(error);
    res.send(error.toString());
}


var htmlHeader = '<html><head><title>Exercise Database</title></head><body>';
var htmlFooter = '</body></html>';


// Function to build view for a Person
function buildPersonView(result) {

    // Build the HTML table from the data in the Student table
    var responseHTML = htmlHeader + '<h1>User Information</h1>';

    //Dynamic populating rows from the records returned
    for (var i=0; i < result.length; i++) {
        responseHTML += '<ul><li>First Name: ' + result[i].FirstName + '</li>' +
        '<li>Last Name: ' + result[i].LastName + '</li>' +
        '<li>Age: ' + result[i].Age + '</li>' +
        '<li>Start Weight: ' + result[i].StartWeight + '</li>' +
        '<li>Gender: ' + result[i].Gender + '</li></ul>'
    }
    responseHTML += htmlFooter;

    return responseHTML;
}


// Function to build view for a Cardio entry
function buildCardioView(result) {

    // Build the HTML table from the data in the Student table
    var responseHTML = htmlHeader + '<h1>Cardio Information</h1>';

    //Dynamic populating rows from the records returned
    for (var i=0; i < result.length; i++) {
        responseHTML += '<ul><li>Exercise ' + result[i].Exercise + '</li>' +
        '<li>length: ' + result[i].Time + '</li>' +
        '<li>Day: ' + result[i].Day + '</li></ul>'
    }
    responseHTML += htmlFooter;

    return responseHTML;
}



// Function to build view for a Lifting
function buildLiftingView(result) {

    // Build the HTML table from the data in the Student table
    var responseHTML = htmlHeader + '<h1>Lifting Day</h1>';

    //Dynamic populating rows from the records returned
    for (var i = 0; i < result.length; i++) {
        responseHTML += '<li>Day: ' + result[i].Day + '</li></ul>'
    }
    responseHTML += htmlFooter;

    return responseHTML;
}


function buildFoodView(result) {

    // Build the HTML table from the data in the Student table
    var responseHTML = htmlHeader + '<h1>Food Day Information</h1>';

    //Dynamic populating rows from the records returned
    for (var i=0; i < result.length; i++) {
        responseHTML += '<ul><li>Day: ' + result[i].Day + '</li>' +
        '<li>Day Weight: ' + result[i].DayWeight + '</li></ul>'
    }
    responseHTML += htmlFooter;

    return responseHTML;
}

// Function to build view for a Lifting Exercise
function buildExerciseLiftingView(result) {

    // Build the HTML table from the data in the Student table
    var responseHTML = htmlHeader + '<h1>Lifting Entry</h1>';

    //Dynamic populating rows from the records returned
    for (var i=0; i < result.length; i++) {
        responseHTML += '<ul><li>Exercise: ' + result[i].Exercise + '</li>' +
        '<li>Weight: ' + result[i].Weight + '</li>' +
        '<li>Reps: ' + result[i].Reps + '</li>' +
        '<li>Sets: ' + result[i].Sets + '</li></ul>'
    }
    responseHTML += htmlFooter;

    return responseHTML;
}


function buildMealView(result) {

    // Build the HTML table from the data in the Student table
    var responseHTML = htmlHeader + '<h1>Meal Information</h1>';

    //Dynamic populating rows from the records returned
    for (var i=0; i < result.length; i++) {
        responseHTML += '<ul><li>Time: ' + result[i].Time + '</li>' +
        '<li>Food: ' + result[i].Food + '</li>' +
        '<li>Calories: ' + result[i].Calories + '</li></ul>'
    }
    responseHTML += htmlFooter;

    return responseHTML;
}


// Configuration
app.use(express.bodyParser());


// ********************************** Start of Person section *************************************


// HTML Table for Persons
app.get('/', function (req, res) {

    var myQry = 'SELECT * FROM Person';

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
                req.send(err);
            }
            else {
                // Build the HTML table from the data in the Student table
                var responseHTML = '<h1>Users</h1>';
                responseHTML += '<table border=1>' +
                '<tr><th>First Name</th>' +
                '<th>Last Name</th>' +
                '<th>Age</th>' +
                '<th>Starting Weight (lbs)</th>' +
                '<th>Gender</th>' +
                '<th>ID</th>' +
                '<th><a href="/add">Add a User</a>' +
                '</tr>';

                //Dynamic populating rows from the records returned
                for (var i=0; i < result.length; i++) {
                    responseHTML += '<tr><td>' + result[i].FirstName + '</td>' +
                    '<td>' + result[i].LastName + '</td>' +
                    '<td>' + result[i].Age + '</td>' +
                    '<td>' + result[i].StartWeight + '</td>' +
                    '<td>' + result[i].Gender + '</td>' +
                    '<td><a href="/edit?ID=' + result[i].ID + '">Edit</a>' +
                    '<td><a href="/cardio?ID=' + result[i].ID + '">Cardio</a>' +
                    '<td><a href="/lifting?ID=' + result[i].ID + '">Lifting</a>' +
                    '<td><a href="/food?ID=' + result[i].ID + '">Food</a>' +
                    '<td><a href="/delete?ID=' + result[i].ID + '">Delete User</a>' +
                    '</td></tr>'
                }

                responseHTML += '</table>';
                res.send(responseHTML);
            }
        }
    );
});


// Display a form that allows user to enter a new User
app.get('/add', function(req, res){

    var responseHTML = htmlHeader;

    responseHTML += '<h1>Insert a Student</h1>' +
    '<form action="/insert" method="GET">' +
    '<input type="Hidden" name="ID" id="ID" />' +
    '<label for="FirstName">First Name</label> <input type="text" name="FirstName" id="FirstName" /><br />' +
    '<label for="LastName">Last Name</label> <input type="text" name="LastName" id="LastName" /><br />' +
    '<label for="Age">Age</label> <input type="text" name="Age" id="Age" /><br />' +
    '<label for="StartWeight">Start Weight</label> <input type="text" name="StartWeight" id="StartWeight" /><br />' +
    '<label for="Gender">Gender</label> <input type="text" name="Gender" id="Gender" /><br />' +
    '<input type="submit" />' +
    '</form>';

    responseHTML += htmlFooter;
    res.send(responseHTML);
});


// Display a form that allows User to enter a new User
app.get('/insert', function(req, res){

    var myQry = 'INSERT INTO Person (FirstName, LastName, Age, StartWeight, Gender) VALUES (' +
        '\'' + req.query.FirstName + '\', ' +
        '\'' + req.query.LastName + '\', ' +
        '\'' + req.query.Age + '\', ' +
        '\'' + req.query.StartWeight + '\',' +
        '\'' + req.query.Gender + '\'' +
        ')';

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM Person WHERE ID = ' + result.insertId,
                    function (err, result) {
                        if (err) {
                            handleError(res, err);
                        }
                        if(result.length == 1) {
                            res.send(buildPersonView(result));
                        }
                        else {
                            res.send('No user found.');
                        }
                    });
            }
        }
    );
});


// Display information about a Person when given their ID and allow them to edit it.
app.get('/edit', function (req, res) {

    var myQry = 'SELECT * FROM Person WHERE ID=' + req.query.ID;

    console.log(myQry);

    connection.query(myQry, function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {

                // Build the HTML table from the data in the Student table
                var responseHTML = htmlHeader + '<h1>Edit User Information</h1>';

                responseHTML += '<form action="/update" method="GET">';

                //Dynamic populating rows from the records returned
                if (result.length == 1) {

                    responseHTML += 'FirstName: <input type="text" name="FirstName" id="FirstName" value="' + result[0].FirstName + '" /><br />' +
                    'LastName: <input type="text" name="LastName" id="LastName" value="' + result[0].LastName + '" /><br />' +
                    'Age: <input type="text" name="Age" id="Age" value="' + result[0].Age + '" /><br />' +
                    'StartWeight: <input type="text" name="StartWeight" id="StartWeight" value="' + result[0].StartWeight + '" /><br />' +
                    'Gender: <input type="text" name="Gender" id="Gender" value="' + result[0].Gender + '" /><br />' +
                    '<input type="hidden" name="ID" id="ID" value="' + result[0].ID + '" />' +
                    '<input type="submit" />' +
                    '</form>' +
                    htmlFooter;

                    res.send(responseHTML);
                }
                else {
                    res.send('More than one User was returned.')
                }
            }
        }
    );
});


// Update a User given their ID
app.get('/update', function (req, res) {

    var myQry = 'UPDATE Person SET FirstName=' + "'" + req.query.FirstName + "'" + ', LastName=' + "'" + req.query.LastName + "'" + ', Age=' + req.query.Age + ', StartWeight=' + req.query.StartWeight + ', Gender=' + "'" + req.query.Gender + "'" + ' WHERE ID=' + req.query.ID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM Person WHERE ID = ' + req.query.ID,
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send('An error occurred');
                        }
                        if(result.length == 1) {
                            res.send(buildPersonView(result));
                        }
                        else {
                            res.send('No User found.');
                        }
                    });
            }
        }
    );
});


// Route for deleting a Person record from the database.
app.get('/delete', function (req, res) {

    var myQry = 'DELETE FROM Person WHERE ID=' + req.query.ID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                res.send('User successfully deleted.');
            }
        }
    );
});


// ****************************** Start of Cardio section ****************************************


// HTML Table for Cardio
app.get('/cardio', function (req, res) {

    var myQry = 'SELECT * FROM Cardio WHERE ID=' + req.query.ID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
                req.send(err);
            }
            else {
                // Build the HTML table from the data in the Student table
                var responseHTML = '<h1>Users</h1>';
                responseHTML += '<table border=1>' +
                '<tr><th>Exercise</th>' +
                '<th>Time</th>' +
                '<th>Day</th>' +
                '<th><a href="/cardio/add?ID=' + req.query.ID + '">Add a Cardio Entry</a>' +
                '</tr>';

                //Dynamic populating rows from the records returned
                for (var i=0; i < result.length; i++) {
                    responseHTML += '<tr><td>' + result[i].Exercise + '</td>' +
                    '<td>' + result[i].Time + '</td>' +
                    '<td>' + result[i].Day + '</td>' +
                    '<td><a href="/cardio/edit?ExerciseID=' + result[i].ExerciseID + '">Edit</a>' +
                    '<td><a href="/cardio/delete?ExerciseID=' + result[i].ExerciseID + '">Delete</a>' +
                    '</td></tr>'
                }

                responseHTML += '</table>';
                res.send(responseHTML);
            }
        }
    );
});



// Display a form that allows user to enter a new Cardio entry
app.get('/cardio/add', function(req, res){

    var responseHTML = htmlHeader;

    responseHTML += '<h1>Insert a Cardio Entry</h1>' +
    '<form action="/cardio/insert" method="GET">' +
    '<input type="Hidden" name="ExerciseID" id="ExerciseID" />' +
    '<label for="Exercise">Exercise</label> <input type="text" name="Exercise" id="Exercise" /><br />' +
    '<label for="Time">Time</label> <input type="text" name="Time" id="Time" /><br />' +
    '<label for="Day">Day</label> <input type="text" name="Day" id="Day" /><br />' +
    '<input type="hidden" name="ID" id="ID" value="' + req.query.ID + '" />' +
    '<input type="submit" />' +
    '</form>';

    responseHTML += htmlFooter;
    res.send(responseHTML);
});


// Display a form that allows User to enter a new Cardio Entry
app.get('/cardio/insert', function(req, res){

    var myQry = 'INSERT INTO Cardio (Exercise, Time, Day, ID) VALUES (' +
        '\'' + req.query.Exercise + '\', ' +
        '\'' + req.query.Time + '\', ' +
        '\'' + req.query.Day + '\', ' +
        '\'' + req.query.ID + '\'' +
        ')';

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM Cardio WHERE ExerciseID = ' + result.insertId,
                    function (err, result) {
                        if (err) {
                            handleError(res, err);
                        }
                        if(result.length == 1) {
                            res.send(buildCardioView(result));
                        }
                        else {
                            res.send('No Cardio Entry found.');
                        }
                    });
            }
        }
    );
});


// Display information about a Cardio entry when given their ID and allow them to edit it.
app.get('/cardio/edit', function (req, res) {

    var myQry = 'SELECT * FROM Cardio WHERE ExerciseID=' + req.query.ExerciseID;

    console.log(myQry);

    connection.query(myQry, function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {

                // Build the HTML table from the data in the Student table
                var responseHTML = htmlHeader + '<h1>Edit Cardio Entry</h1>';

                responseHTML += '<form action="/cardio/update" method="GET">';

                //Dynamic populating rows from the records returned
                if (result.length == 1) {

                    responseHTML += 'Exercise: <input type="text" name="Exercise" id="Exercise" value="' + result[0].Exercise + '" /><br />' +
                    'Length: <input type="text" name="Time" id="Time" value="' + result[0].Time + '" /><br />' +
                    'Day: <input type="text" name="Day" id="Day" value="' + result[0].Day + '" /><br />' +
                    '<input type="hidden" name="ID" id="ID" value="' + result[0].ID + '" />' +
                    '<input type="hidden" name="ExerciseID" id="ExerciseID" value="' + result[0].ExerciseID + '" />' +
                    '<input type="submit" />' +
                    '</form>' +
                    htmlFooter;

                    res.send(responseHTML);
                }
                else {
                    res.send('More than one entry was returned.')
                }
            }
        }
    );
});



// Update a Cardio Entry given the ID
app.get('/cardio/update', function (req, res) {

    var myQry = 'UPDATE Cardio SET Exercise=' + "'" + req.query.Exercise + "'" + ', Time=' + req.query.Time + ', Day=' + "'" + req.query.Day + "'" + ' WHERE ExerciseID=' + req.query.ExerciseID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM Cardio WHERE ExerciseID = ' + req.query.ExerciseID,
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send('An error occurred');
                        }
                        if(result.length == 1) {
                            res.send(buildCardioView(result));
                        }
                        else {
                            res.send('No Entry found.');
                        }
                    });
            }
        }
    );
});


// Route for deleting a Cardio record from the database.
app.get('/cardio/delete', function (req, res) {

    var myQry = 'DELETE FROM Cardio WHERE ExerciseID=' + req.query.ExerciseID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                res.send('Entry successfully deleted.');
            }
        }
    );
});


// **************************** Lifting Section *****************************************


// HTML Table for Lifting
app.get('/lifting', function (req, res) {

    var myQry = 'SELECT * FROM Lifting WHERE ID=' + req.query.ID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
                req.send(err);
            }
            else {
                // Build the HTML table from the data in the Student table
                var responseHTML = '<h1>Lifting</h1>';
                responseHTML += '<table border=1>' +
                '<tr><th>Day</th>' +
                '<th><a href="/lifting/add?ID=' + req.query.ID + '">Add a Lifting Entry</a>' +
                '</tr>';

                //Dynamic populating rows from the records returned
                for (var i=0; i < result.length; i++) {
                    responseHTML += '<tr><td>' + result[i].Day + '</td>' +
                    '<td><a href="/lifting/edit?Day=' + result[i].Day + '&ID=' + result[i].ID +'">Edit</a>' +
                    '<td><a href="/lifting/exercise?Day=' + result[i].Day + '&ID=' + result[i].ID + '">Exercises</a>' +
                    '<td><a href="/lifting/delete?ID=' + result[i].ID + '&Day=' + result[i].Day + '">Delete</a>' +
                    '</td></tr>'
                }

                responseHTML += '</table>';
                res.send(responseHTML);
            }
        }
    );
});


// Display a form that allows user to enter a new Lifting entry
app.get('/lifting/add', function(req, res){

    var responseHTML = htmlHeader;

    responseHTML += '<h1>Insert a Lifting Entry</h1>' +
    '<form action="/lifting/insert" method="GET">' +
    '<label for="Day">Day</label> <input type="text" name="Day" id="Day" /><br />' +
    '<input type="hidden" name="ID" id="ID" value="' + req.query.ID + '" />' +
    '<input type="submit" />' +
    '</form>';

    responseHTML += htmlFooter;
    res.send(responseHTML);
});


// Display a form that allows User to enter a new Lifting Entry
app.get('/lifting/insert', function(req, res){

    var myQry = 'INSERT INTO Lifting (Day, ID) VALUES (' +
        '\'' + req.query.Day + '\', ' +
        '\'' + req.query.ID + '\'' +
        ')';

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM Lifting WHERE ID = ' + req.query.ID + ' AND Day=' + "'" + req.query.Day + "'",
                    function (err, result) {
                        if (err) {
                            handleError(res, err);
                        }
                        if(result.length == 1) {
                            res.send(buildLiftingView(result));
                        }
                        else {
                            res.send('No Lifting Entry found.');
                        }
                    });
            }
        }
    );
});


// Display information about a Lifting Day entry when given the Day and their ID and allow them to edit it.
app.get('/lifting/edit', function (req, res) {

    var myQry = 'SELECT * FROM Lifting WHERE Day=' + "'" + req.query.Day + "'" + ' AND ID=' + req.query.ID;

    console.log(myQry);

    connection.query(myQry, function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {

                // Build the HTML table from the data in the Student table
                var responseHTML = htmlHeader + '<h1>Edit Lifting Day</h1>';

                responseHTML += '<form action="/lifting/update" method="GET">';

                //Dynamic populating rows from the records returned
                if (result.length == 1) {

                    responseHTML += 'Day: <input type="text" name="Day" id="Day" value="' + result[0].Day + '" /><br />' +
                    '<input type="hidden" name="ID" id="ID" value="' + result[0].ID + '" />' +
                    '<input type="submit" />' +
                    '</form>' +
                    htmlFooter;

                    res.send(responseHTML);
                }
                else {
                    res.send('More than one entry was returned.')
                }
            }
        }
    );
});


// Update a Lifting Entry given the ID
app.get('/lifting/update', function (req, res) {

    var myQry = 'UPDATE Lifting SET Day=' + "'" + req.query.Day + "'";

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM Lifting WHERE Day = ' + "'" + req.query.Day + "'" + ' AND ID=' + req.query.ID,
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send('An error occurred');
                        }
                        if(result.length == 1) {
                            res.send(buildLiftingView(result));
                        }
                        else {
                            res.send('No Entry found.');
                        }
                    });
            }
        }
    );
});


// Route for deleting a Cardio entry from the database.
app.get('/lifting/delete', function (req, res) {

    var myQry = 'DELETE FROM Lifting WHERE Day=' + "'" + req.query.Day + "'" + 'AND ID=' + req.query.ID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                res.send('Entry successfully deleted.');
            }
        }
    );
});


// ****************************** Lifting Exercises ****************************************


// HTML Table for Lifting Exercises
app.get('/lifting/exercise', function (req, res) {

    var myQry = 'SELECT * FROM ExerciseLifting WHERE Day=' + "'" + req.query.Day + "'" + ' AND ID=' + req.query.ID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
                req.send(err);
            }
            else {
                // Build the HTML table from the data in the Student table
                var responseHTML = '<h1>Exercises</h1>';
                responseHTML += '<table border=1>' +
                '<tr><th>Day</th>' +
                '<th>Exercise</th>' +
                '<th>Weight</th>' +
                '<th>Reps</th>' +
                '<th>Sets</th>' +
                '<th><a href="/lifting/exercise/add?Day=' + req.query.Day +  '&ID=' + req.query.ID + '">Add a Lifting Entry</a>' +
                '</tr>';

                //Dynamic populating rows from the records returned
                for (var i=0; i < result.length; i++) {
                    responseHTML += '<tr><td>' + result[i].Day + '</td>' +
                    '<td>' + result[i].Exercise + '</td>' +
                    '<td>' + result[i].Weight + '</td>' +
                    '<td>' + result[i].Reps + '</td>' +
                    '<td>' + result[i].Sets + '</td>' +
                    '<td><a href="/lifting/exercise/edit?ExerciseID=' + result[i].ExerciseID +  '&ID=' + req.query.ID + '">Edit</a>' +
                    '<td><a href="/lifting/exercise/delete?ExerciseID=' + result[i].ExerciseID + '">Delete</a>' +
                    '</td></tr>'
                }

                responseHTML += '</table>';
                res.send(responseHTML);
            }
        }
    );
});

// Display a form that allows user to enter a new Lifting Exercise entry
app.get('/lifting/exercise/add', function(req, res){

    var responseHTML = htmlHeader;

    responseHTML += '<h1>Insert a Lifting Exercise Entry</h1>' +
    '<form action="/lifting/exercise/insert" method="GET">' +
    '<input type="hidden" name="ExerciseID" id="ExerciseID" />' +
    '<input type="hidden" name="Day" id="Day" value="' + req.query.Day + '" />' +
    '<label for="Exercise">Exercise</label> <input type="text" name="Exercise" id="Exercise" /><br />' +
    '<label for="Weight">Weight</label> <input type="text" name="Weight" id="Weight" /><br />' +
    '<label for="Reps">Reps</label> <input type="text" name="Reps" id="Reps" /><br />' +
    '<label for="Sets">Sets</label> <input type="text" name="Sets" id="Sets" /><br />' +
    '<input type="hidden" name="ID" id="ID" value="' + req.query.ID + '" />' +
    '<input type="submit" />' +
    '</form>';

    responseHTML += htmlFooter;
    res.send(responseHTML);
});


// Display a form that allows User to enter a new Lifting Entry
app.get('/lifting/exercise/insert', function(req, res){

    var myQry = 'INSERT INTO ExerciseLifting (Day, Exercise, Weight, Reps, Sets, ID) VALUES (' +
        '\'' + req.query.Day + '\', ' +
        '\'' + req.query.Exercise + '\', ' +
        '\'' + req.query.Weight + '\', ' +
        '\'' + req.query.Reps + '\', ' +
        '\'' + req.query.Sets + '\', ' +
        '\'' + req.query.ID + '\'' +
        ')';

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM ExerciseLifting WHERE ExerciseID = ' + result.insertId,
                    function (err, result) {
                        if (err) {
                            handleError(res, err);
                        }
                        if(result.length == 1) {
                            res.send(buildExerciseLiftingView(result));
                        }
                        else {
                            res.send('No Lifting Entry found.');
                        }
                    });
            }
        }
    );
});


// Display information about a Lifting entry when given the Day and their ID and allow them to edit it.
app.get('/lifting/exercise/edit', function (req, res) {

    var myQry = 'SELECT * FROM ExerciseLifting WHERE ExerciseID=' + req.query.ExerciseID;

    console.log(myQry);

    connection.query(myQry, function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {

                // Build the HTML table from the data in the Student table
                var responseHTML = htmlHeader + '<h1>Edit Lifting Day</h1>';

                responseHTML += '<form action="/lifting/exercise/update" method="GET">';

                //Dynamic populating rows from the records returned
                if (result.length == 1) {

                    responseHTML += '<input type="Hidden" name="ExerciseID" id="ExerciseID" value="' + req.query.ExerciseID + '" />' +
                    '<input type="Hidden" name="Day" id="Day" value="' + req.query.Day + '" />' +
                    'Exercise: <input type="text" name="Exercise" id="Exercise" value="' + result[0].Exercise + '" /><br />' +
                    'Weight: <input type="text" name="Weight" id="Weight" value="' + result[0].Weight + '" /><br />' +
                    'Reps: <input type="text" name="Reps" id="Reps" value="' + result[0].Reps + '" /><br />' +
                    'Sets: <input type="text" name="Sets" id="Sets" value="' + result[0].Sets + '" /><br />' +
                    '<input type="hidden" name="ID" id="ID" value="' + req.query.ID + '" />' +
                    '<input type="submit" />' +
                    '</form>' +
                    htmlFooter;

                    res.send(responseHTML);
                }
                else {
                    res.send('More than one entry was returned.')
                }
            }
        }
    );
});


// Update a Lifting Entry given the ID
app.get('/lifting/exercise/update', function (req, res) {

    var myQry = 'UPDATE ExerciseLifting SET Exercise=' + "'" + req.query.Exercise + "'" + ', Weight=' +  req.query.Weight  + ', Reps=' + req.query.Reps + ', Sets=' + req.query.Sets + ' WHERE ExerciseID=' + req.query.ExerciseID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM ExerciseLifting WHERE ExerciseID=' + req.query.ExerciseID,
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send('An error occurred');
                        }
                        if(result.length == 1) {
                            res.send(buildExerciseLiftingView(result));
                        }
                        else {
                            res.send('No Entry found.');
                        }
                    });
            }
        }
    );
});


// Route for deleting a Lifting Exercise entry from the database.
app.get('/lifting/exercise/delete', function (req, res) {

    var myQry = 'DELETE FROM ExerciseLifting WHERE ExerciseID=' + req.query.ExerciseID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                res.send('Entry successfully deleted.');
            }
        }
    );
});


// ******************************** Food Section **************************************


// Create table for Food
app.get('/food', function (req, res) {

    var myQry = 'SELECT * FROM Food WHERE ID=' + req.query.ID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
                req.send(err);
            }
            else {
                // Build the HTML table from the data in the Student table
                var responseHTML = '<h1>Food Days</h1>';
                responseHTML += '<table border=1>' +
                '<tr><th>Day</th>' +
                '<th>Day Weight</th>' +
                '<th><a href="/food/add?ID=' + req.query.ID + '">Add</a>' +
                '</tr>';

                //Dynamic populating rows from the records returned
                for (var i=0; i < result.length; i++) {
                    responseHTML += '<tr><td>' + result[i].Day + '</td>' +
                    '<td>' + result[i].DayWeight + '</td>' +
                    '<td><a href="/food/edit?Day=' + result[i].Day + '&ID=' + req.query.ID + '">Edit</a>' +
                    '<td><a href="/food/meals?Day=' + result[i].Day + '&ID=' + req.query.ID + '">Meals</a>' +
                    '<td><a href="/food/delete?Day=' + result[i].Day + '&ID=' + req.query.ID + '">Delete</a>' +
                    '</td></tr>'
                }

                responseHTML += '</table>';
                res.send(responseHTML);
            }
        }
    );
});


// Display information about a Food entry when given the Day and their ID and allow them to edit it.
app.get('/food/edit', function (req, res) {

    var myQry = 'SELECT * FROM Food WHERE Day=' + "'" + req.query.Day + "'" + ' AND ID=' + req.query.ID;;

    console.log(myQry);

    connection.query(myQry, function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {

                // Build the HTML table from the data in the Student table
                var responseHTML = htmlHeader + '<h1>Edit Food Information</h1>';

                responseHTML += '<form action="/food/update" method="GET">';

                //Dynamic populating rows from the records returned
                if (result.length == 1) {

                    responseHTML += 'Day Weight: <input type="text" name="DayWeight" id="DayWeight" value="' + result[0].DayWeight + '" /><br />' +
                    '<input type="hidden" name="ID" id="ID" value="' + req.query.ID + '" />' +
                    '<input type="submit" />' +
                    '</form>' +
                    htmlFooter;

                    res.send(responseHTML);
                }
                else {
                    res.send('More than one entry was returned.')
                }
            }
        }
    );
});


// Update a Lifting Entry given the ID
app.get('/food/update', function (req, res) {

    var myQry = 'UPDATE Food SET DayWeight=' +  req.query.DayWeight  + ' WHERE ID=' + req.query.ID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM Food WHERE Day=' + "'" + req.query.Day + "'",
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send('An error occurred');
                        }
                        if(result.length == 1) {
                            res.send(buildFoodView(result));
                        }
                        else {
                            res.send('No Entry found.');
                        }
                    });
            }
        }
    );
});


// Display a form that allows user to enter a new Food Day entry
app.get('/food/add', function(req, res){

    var responseHTML = htmlHeader;

    responseHTML += '<h1>Insert a Food Day Entry</h1>' +
    '<form action="/food/insert?ID=' + req.query.ID + '" method="GET">' +
    '<label for="Day">Day</label> <input type="text" name="Day" id="Day" /><br />' +
    '<label for="DayWeight">Day Weight</label> <input type="text" name="DayWeight" id="DayWeight" /><br />' +
    '<input type="hidden" name="ID" id="ID" value="' + req.query.ID + '" />' +
    '<input type="submit" />' +
    '</form>';

    responseHTML += htmlFooter;
    res.send(responseHTML);
});


// Display a form that allows User to enter a new Lifting Entry
app.get('/food/insert', function(req, res){

    var myQry = 'INSERT INTO Food VALUES (' +
        '\'' + req.query.Day + '\', ' +
        '\'' + req.query.DayWeight + '\', ' +
        '\'' + req.query.ID + '\'' +
        ')';

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM Food WHERE ID = ' + req.query.ID + ' AND Day=' + "'" + req.query.Day + "'",
                    function (err, result) {
                        if (err) {
                            handleError(res, err);
                        }
                        if(result.length == 1) {
                            res.send(buildFoodView(result));
                        }
                        else {
                            res.send('No Food Entry found.');
                        }
                    });
            }
        }
    );
});


// Route for deleting a Food Day entry from the database.
app.get('/food/delete', function (req, res) {

    var myQry = 'DELETE FROM Food WHERE Day=' + "'" + req.query.Day + "'" + ' AND ID=' + req.query.ID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                res.send('Entry successfully deleted.');
            }
        }
    );
});


// ********************************** Meals Section ***********************************


// Create table for Food
app.get('/food/meals', function (req, res) {

    var myQry = 'SELECT * FROM Meal WHERE Day=' + "'" + req.query.Day + "'" + ' AND ID=' + req.query.ID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
                req.send(err);
            }
            else {
                // Build the HTML table from the data in the Student table
                var responseHTML = '<h1>Meals</h1>';
                responseHTML += '<table border=1>' +
                '<tr><th>Time</th>' +
                '<th>Food</th>' +
                '<th>Calories</th>' +
                '<th><a href="/food/meals/add?ID=' + req.query.ID + '&Day=' + req.query.Day +  '">Add</a>' +
                '</tr>';

                //Dynamic populating rows from the records returned
                for (var i=0; i < result.length; i++) {
                    responseHTML += '<tr><td>' + result[i].Time + '</td>' +
                    '<td>' + result[i].Food + '</td>' +
                    '<td>' + result[i].Calories + '</td>' +
                    '<td><a href="/food/meals/edit?FoodID=' + result[i].FoodID + '">Edit</a>' +
                    '<td><a href="/food/meals/delete?FoodID=' + result[i].FoodID + '">Delete</a>' +
                    '</td></tr>'
                }

                responseHTML += '</table>';
                res.send(responseHTML);
            }
        }
    );
});


// Display information about a Food entry when given the Day and their ID and allow them to edit it.
app.get('/food/meals/edit', function (req, res) {

    var myQry = 'SELECT * FROM Meal WHERE FoodID=' + req.query.FoodID;

    console.log(myQry);

    connection.query(myQry, function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {

                // Build the HTML table from the data in the Student table
                var responseHTML = htmlHeader + '<h1>Edit Meal Information</h1>';

                responseHTML += '<form action="/food/meals/update" method="GET">';

                //Dynamic populating rows from the records returned
                if (result.length == 1) {

                    responseHTML += '<input type="hidden" name="FoodID" id="FoodID" value="' + req.query.FoodID + '" />' +
                    'Time: <input type="text" name="Time" id="Time" value="' + result[0].Time + '" /><br />' +
                    'Food: <input type="text" name="Food" id="Food" value="' + result[0].Food + '" /><br />' +
                    'Calories: <input type="text" name="Calories" id="Calories" value="' + result[0].Calories + '" /><br />' +
                    '<input type="hidden" name="Day" id="Day" value="' + req.query.Day + '" />' +
                    '<input type="hidden" name="ID" id="ID" value="' + req.query.ID + '" />' +
                    '<input type="submit" />' +
                    '</form>' +
                    htmlFooter;

                    res.send(responseHTML);
                }
                else {
                    res.send('More than one entry was returned.')
                }
            }
        }
    );
});


// Update a Meal given their ID and the Day
app.get('/food/meals/update', function (req, res) {

    var myQry = 'UPDATE Meal SET Time=' + "'" + req.query.Time + "'" + ', Food=' + "'" + req.query.Food + "'" + ', Calories=' + req.query.Calories  + ' WHERE FoodID=' + req.query.FoodID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM Meal WHERE FoodID = ' + req.query.FoodID,
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send('An error occurred');
                        }
                        if(result.length == 1) {
                            res.send(buildMealView(result));
                        }
                        else {
                            res.send('No User found.');
                        }
                    });
            }
        }
    );
});


// Display a form that allows user to enter a new User
app.get('/food/meals/add', function(req, res){

    var responseHTML = htmlHeader;

    responseHTML += '<h1>Insert a Meal</h1>' +
    '<form action="/food/meals/insert" method="GET">' +
    '<input type="Hidden" name="FoodID" id="FoodID" />' +
    '<label for="Time">Time</label> <input type="text" name="Time" id="Time" /><br />' +
    '<label for="Food">Food</label> <input type="text" name="Food" id="Food" /><br />' +
    '<label for="Calories">Calories</label> <input type="text" name="Calories" id="Calories" /><br />' +
    '<input type="Hidden" name="Day" id="Day" value="' + req.query.Day + '"/>' +
    '<input type="Hidden" name="ID" id="ID" value="' + req.query.ID + '" />' +
    '<input type="submit" />' +
    '</form>';

    responseHTML += htmlFooter;
    res.send(responseHTML);
});


// Display a form that allows a Person to enter a new Meal
app.get('/food/meals/insert', function(req, res){

    var myQry = 'INSERT INTO Meal (Time, Food, Calories, Day, ID) VALUES (' +
        '\'' + req.query.Time + '\', ' +
        '\'' + req.query.Food + '\', ' +
        '\'' + req.query.Calories + '\', ' +
        '\'' + req.query.Day + '\', ' +
        '\'' + req.query.ID + '\'' +
        ')';

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM Meal WHERE FoodID = ' + result.insertId,
                    function (err, result) {
                        if (err) {
                            handleError(res, err);
                        }
                        if(result.length == 1) {
                            res.send(buildMealView(result));
                        }
                        else {
                            res.send('No user found.');
                        }
                    });
            }
        }
    );
});


// Route for deleting a Meal entry from the database.
app.get('/food/meals/delete', function (req, res) {

    var myQry = 'DELETE FROM Meal WHERE FoodID=' + req.query.FoodID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                res.send('Entry successfully deleted.');
            }
        }
    );
});


// Begin listening
app.listen(8000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);