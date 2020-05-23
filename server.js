
var express = require("express");
var app = express(); //create an app
var itemList = []; // store items on this array
var ItemDB;
var MessageDB;

/********************************************************
  *  Configuration
  *******************************************************/

// enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Rquested-With, Content-Type, Accept");
    next();
});

// config body-parser to read info in request
var bparser = require("body-parser");
app.use(bparser.json());

// to server static files (css, js, img, pdfs)
app.use(express.static(__dirname + '/public'))

// to serve HTML
var ejs = require('ejs');
app.set('views', __dirname + '/public'); // where are the HTML files
app.engine('html', ejs.renderFile);
app.set('view engine', ejs);

//MongoDB connection config
var mongoose = require('mongoose');
mongoose.connect("mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin");
var db = mongoose.connection;

/****************************************************************
*  Web Server Endpoints
*****************************************************************/

//this is the end request
//the root page
app.get('/', (req, res) => {
    console.log("Someone wants the root page");
    res.render('index.html');
});

//contact page
app.get('/contact', (req, res) => {
    res.render('contact.html');

});
app.get('/catalog', (req, res) => {
    res.render('Catalog.html');
});
app.get('/admin', (req, res) => {
    res.render('Admin.html');
});

app.get('/aboutme', (req, res) => {
    res.render('about.html');
});


app.get('/exc/:message', (req, res) => {
    console.log("Message from client: ", req.params.message);

    var msg = req.params.message;
    var vowels = '';
    var allVowels = ['a', 'e', 'i', 'o', 'u'];
    //1 travel the msg string and print on the console each letter
    for (var i = 0; i < msg.length; i++) {
        var letter = msg[i];
        console.log(letter);
        //2 check if each letter is a vowel
        //if it is, add the vowel to vowels string
        if (allVowels.indexOf(letter.toLowerCase()) != -1) {
            if (!vowels.includes(letter)) { //3 return each vowel ONLY ONCE
                //Decide 
                vowels += letter;
            }

        }

    }


    res.status(202);
    res.send(vowels);
    //res.send("Thanks for the message");
});


/*****************************************************************************
 *  API End Points
 *****************************************************************************/

app.post('/api/items', (req, res) => {
    console.log("clients wants to store items");


    var itemForMongo = ItemDB(req.body);
    itemForMongo.save(
        function (error, savedItem) {
            if (error) {
                console.log("**Error saving item", error);
                res.status(500); // internal server error
                res.send(error);
            }

            // no error:
            console.log("Item saved");
            res.status(201); // created
            res.json(savedItem);
        }
    );

});


app.post('/api/messages', (req, res) => {
    console.log("clients wants to message us");


    var messageForMongo = MessageDB(req.body);
    messageForMongo.save(
        function (error, savedMessage) {
            if (error) {
                console.log("**Error saving message", error);
                res.status(500); // internal server error
                res.send(error); //sending a String or texts
            }

            // no error:
            console.log("Message saved");
            res.status(201); // created
            res.json(savedMessage); //sending an object
        }
    );

});

app.get('/api/items', (req, res) => {
    ItemDB.find({}, function (error, data) { //{} is an empty filter
        if (error) {
            res.status(500);
            res.send(error);
        }

        res.status(200); //ok
        res.json(data);
    });
});

app.get('/api/messages', (req, res) => {
    MessageDB.find({}, function (error, data) { //{} is an empty filter
        if (error) {
            res.status(500);
            res.send(error);
        }

        res.status(200); //ok
        res.json(data);
    });
});


app.get('/api/items/:id', (req, res) => {
    var id = req.params.id;

    ItemDB.find({ _id: id }, function (error, item) {
        if (error) {
            res.status(404); // Not found
            res.send(error); 
        }
        res.status(200); //ok
        res.json(item); 

    });
});

app.get('/api/items/byName/:name', (req, res) => {
    var name = req.params.name;
    ItemDB.find({user: name}, function(error, data) {
        if (error) {
            res.status(404); // Not found
            res.send(error); 
        }
        res.status(200); // Ok
        res.json(data); 
    });
});

//To Delete
app.delete('/api/items', (req, res) => {
    var item = req.body;

    ItemDB.findByIdAndRemove(item._id, function (error) {
        if (error) {
            res.status(500);
            res.send(error);
        }

        res.status(200);
        res.send("Item removed");
    });

});

// localhost:8080/api/items/delete/091238091283901238
app.get('/api/items/delete/:id', (req, res) => {
    ItemDB.findByIdAndRemove(req.params.id, function (error) {
        if (error) {
            res.status(500);
            res.send(error);
        }

        res.status(200);
        res.send("Item removed");
    });
});



/******************************************************************************
 *  Start Server
 ******************************************************************************/

//always leave at the end

db.on('open', function () {
    console.log("Yay!!! DB connection was successful");

    /*
        Data types allowed for shemas:
        String, Number, Date, Buffer, Boolean, ObjectId, Array
    */

    //Define structure (models) for the objects on each collection
    var itemsSchema = mongoose.Schema({
        code: String,
        description: String,
        price: Number,
        image: String,
        category: String,
        stock: Number,
        deliveryDays: Number,
        user: String
    });

    var messageSchema = mongoose.Schema({
        firstName: String,
        surname: String,
        email: String,
        password: String,
        age: Number,
        message: String

    });    

    // create constructor (mongoose model)
    ItemDB = mongoose.model("itemsSandieCh6", itemsSchema);
    MessageDB = mongoose.model("messagesSandieCH6", messageSchema);
   
});

db.on('error', function (error) {
    console.log("Error connection to DB");
    console.log(error);
});


app.listen(8080, function () {
    console.log("server running at http://localhost:8080"); //local host has IP address 127.0.0.1
    console.log("Press ctrl+C to kill it");
});


/**
 * 
 * 1 - create contact.html
 * 2 - render from /contact
 * 3 - check that on localhost:8080/contact you can see the page
 * 4 - Create a form inside html page
 * 5 - (Done!) Create the model and API endpoint to handle messages  
 * 6 - Create a contact.js file that catches the click on send button
 * 7 - Create an AJAX POST request to /api/messages
 * 8 - Create endpoint GET on /api/messages that retrieves and sends all the messages
 * 9 - Modify Admin.js, on Init call a retrieveMessages function that 
 *      gets the messages from /api/messages

 */
