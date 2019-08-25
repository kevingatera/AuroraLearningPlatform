/* USER REGISTRATION API ROUTE */

var User = require('../models/user');
var S3 = require('../helpers/AWSS3');
var AWS = require('aws-sdk');
var multer = require('multer');
var jwt = require('jsonwebtoken');
var secret = 'testingSecretFormula';

var credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
AWS.config.credentials = credentials;

module.exports = function (router) {
    // Form validation mechanism
    // http://localhost://8080
    router.post('/users', function (req, res) {
        // res.send('testing users route');
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        var userData = [user.name, user.username, user.password, user.email];
        // Form validation mechanism
        var flagForMissing = false;
        var missingCriteria = function () {
            for (i in userData) {
                console.log('Analysing > ' + userData[i]);
                if (userData[i] == ('' || null)) {
                    flagForMissing = true
                }
                // else { console.log('I am here! > ' + userData[i]); }
            }
            return flagForMissing;
        };

        if (missingCriteria()) {
            // res.send("There is a missing field!");
            res.json({ success: false, message: 'There is ONE or SEVERAL missing field(s)' })
        } else {
            user.save(function (err) {
                if (err) {
                    // Check if there is any error whatoever
                    if (err.errors != null) {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message }) // check the name validity
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message }) // Check the email validity
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message }) // check the username validity
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message }) // Check the password validity
                        }
                    } else {
                        if (err.code === 11000) {
                            res.json({ success: false, message: "Username or password already exist" })
                        } else {
                            res.json({ success: false, message: err }) // Check and output uncaught errors
                        }
                    }
                } else {
                    // res.send('The user was SUCCESSFULLY created!');
                    res.json({ success: true, message: 'The user was SUCCESSFULLY created!' })
                }
            });
        }
    });

    /* API to check if the email exists */
    router.post('/checkEmail', function (req, res) {
        /* the following will find the account by email */
        User.findOne({ email: req.body.email }).select('email').exec(function (err, user) {
            if (err) {
                throw err; // For when the username doesn't exist
            } else {
                /* This is where i am gonna begin authernticatin the user
                by comparing the given user to the database */
                if (!user) {
                    res.json({ success: true, message: 'This email is valid' })
                } else if (user) {
                    res.json({ success: false, message: 'This email is already taken' })
                }
            }
        })
    })

    /* API to check if the username exists */
    router.post('/checkUsername', function (req, res) {
        /* the following will find the account by username */
        User.findOne({ username: req.body.username }).select('username').exec(function (err, user) {
            if (err) {
                throw err; // For when the username doesn't exist
            } else {
                /* This is where i am gonna begin authernticatin the user
                by comparing the given user to the database */
                if (!user) {
                    res.json({ success: true, message: 'This username is valid' })
                } else if (user) {
                    res.json({ success: false, message: 'This username is already taken' })
                }
            }
        })
    })
    
    // Replace <Subscription Key> with your valid subscription key.
    const subscriptionKey = '384a2381543b4fadaa26f8202c1d4bc3';
    const uriBase =
        'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/analyze';

    const imageUrl =
        'https://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg';
    // Request parameters.
    const params = {
        'visualFeatures': 'Categories,Description,Color',
        'details': '',
        'language': 'en'
    };
    
    const analyze_image_options = {
        uri: uriBase,
        qs: params,
        body: '{"url": ' + '"' + imageUrl + '"}',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };
    
    router.get('/analyzeimage', function (req, res) {
        // res.json({ success: true, message: 'Yesss!' });

        router.post(analyze_image_options, (error, response, body) => {
            if (error) {
                console.log('Error: ', error);
                return;
            }
            let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
            console.log('JSON Response\n');
            console.log(jsonResponse);
        });
    })


    // 267362

    var uploading = multer({
        dest: __dirname + '/temp/uploads/',
    })

    router.post(
        '/upload',
        uploading.single("file" /* name attribute of <file> element in your form */),
        (req, res) => {

            const handleError = (err, res) => {
                res
                    .status(500)
                    .contentType("text/plain")
                    .end("Oops! Something went wrong!");
            };

            const tempPath = req.file.path;

            S3.upload(tempPath, "testName.png");

            router.post(analyze_image_options, (error, response, body) => {
                if (error) {
                    console.log('Error: ', error);
                    return;
                }
                let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
                console.log('JSON Response\n');
                console.log(jsonResponse);
            });

            // const targetPath = path.join(uploading.dest, "./image.png");
            // if (path.extname(req.file.originalname).toLowerCase() === ".png") {
            //     fs.rename(tempPath, targetPath, err => {
            //         if (err) return handleError(err, res);

            //         S3.upload(targetPath, "testName.png");

            //         res
            //             .status(200)
            //             .contentType("text/plain")
            //             .end("File uploaded!");
            //     });
            // } else {
            //     fs.unlink(tempPath, err => {
            //         if (err) return handleError(err, res);

            //         res
            //             .status(403)
            //             .contentType("text/plain")
            //             .end("Only .png files are allowed!");
            //     });
            // }
        }
    );

    // API route for articles
    router.get('/article', function (req, res) {
        res.json({ success: true, message: 'Yesss!' });
    })

    /* USER LOGIN ROUTE */
    // This will look like https://$servername/api/authenticate
    router.post('/authenticate', function (req, res) {
        // res.send('Testing new API route');
        /* the following will find the account by username */
        User.findOne({ username: req.body.username }).select('username email password').exec(function (err, user) {
            if (err) {
                throw err; // For when the username doesn't exist
            } else {
                /* This is where i am gonna begin authernticatin the user
                by comparing the given user to the database */
                if (!user) {
                    res.json({ success: false, message: 'Could not authenticate the username' })
                } else if (user) {
                    if (!req.body.password) {
                        // This will avoid cases where the username is provided without a password
                        res.json({ success: false, message: 'Please provide a password.' })
                    } else {
                        var validPassword = user.comparePasswords(req.body.password);
                        if (!validPassword) {
                            res.json({ success: false, message: 'Could not authenticate the password' })
                        } else if (validPassword) {
                            /* since the username and password are correct then I am going to issue
                            tokens to keep the user logged in */
                            var token = jwt.sign({
                                username: user.username,
                                email: user.email
                            }, secret, { expiresIn: '1h' });
                            // I used user because i am working off the username
                            res.json({ success: true, message: 'User authenticated!', token: token });
                        }
                    }

                }
            }
        })
    });

    /* the following will decrypt the token and send it back to the user
    and that will be possible with this middleware */
    router.use(function (req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if (token) {
            // Proceed with the token verification
            // It will take the token verify it and send it back decoded ie
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    // the following will ensure that the token is always valid
                    res.json({ success: false, message: 'The provided token is INVALID' })
                } else {
                    // The following ensures that the decoded secret is available outside this function
                    req.decoded = decoded;
                    // the following tells the middleware to continue normal course
                    next();
                }
            });
        } else {
            res.json({ success: false, message: 'Failure: NOi token provided' })
        }
    })

    /* The following is a user specific route */
    router.post('/me', function (req, res) {
        res.send(req.decoded);
    })

    return router;
}
