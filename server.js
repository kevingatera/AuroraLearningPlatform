// require("appdynamics").profile({
//  controllerHostName: 'blue2017082322185821.saas.appdynamics.com',
//  controllerPort: 443,
//  // If SSL, be sure to enable the next line
//  controllerSslEnabled: true,
//  accountName: 'blue2017082322185821',
//  accountAccessKey: 'y69t29s0nei7',
//  applicationName: 'test-app',
//  tierName: 'test-tier',
//  nodeName: 'process' // The controller will automatically append the node name with a unique number
// });

/* CODE FOR DATADOG */

// var StatsD = require('node-dogstatsd').StatsD;
// var dogstatsd = new StatsD();

// // Increment a counter.
// dogstatsd.increment('page.views');

var express = require('express');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var path = require('path');
var port = process.env.PORT || 8086;
var router = express.Router(); // Used to generate tokens
var appRoutes = require('./serverapp/routes/api.js')(router);
var social = require('./serverapp/passport/passport')(app, passport) ;

app.use(morgan('dev')); // Hey, start logging the data/requests
app.use(bodyParser.json()); // Start parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public/app'));
app.use('/api', appRoutes); // This comes last so that it cause the parsed data
/* Also, the '/api' will help us differentiate the frontend routes from the
    backend ones by appending '// http://localhost:27017/api' right in middle. */

mongoose.connect('mongodb://localhost:27017/AuroraLearningPatform', { useNewUrlParser: true }, function(err){
    if (err) {
        console.log('Not connected to MongoDB. What happenned? \n => ' + err );
    }
    else {
        console.log('OK.. Connected to the database');
    }
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/web/views/index.html'));
});

app.listen(port, function() {
    console.log('the dir is: ' + __dirname + '/public/app/web/views/index.html');
    console.log('Running the server on ' + port);
});


/* --------------- TESTING CODE ------------- *//*

app.get('/', function(req, res){
res.send('Hello World!!')
})


app.get('/users', function(req, res){
res.send('hello from the app page!');
})
XXYYYYYYYYYYYYYYYYYYCCCCCCCCCCXXXXXXXXXXXXXXXXXXXXXXXXXXX
*/
