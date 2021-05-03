const path = require('path');
const express = require('express'); //express is a fn, not an obj. It is called to create a new instance of an application
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

//Setting up routes
const app = express();

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials')

//Set up handlebars engine (to display dynamic content, we use handlebars) and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath)
hbs. registerPartials(partialsPath);

//Set up static directory to serve
//Serving the directory PUBLIC up for display in browser
app.use(express.static(publicDirectoryPath));

//Setting up routes to display pages, if index.html is not set to be served by using express.static inside app.use
//If index.html is served using line 9, then, I can access other HTML pages by typing in browser
    // at the end of URL as help.html, about.html. Then, I don't have to set up routes for them as below.

// app.get('', (req, res) => {
//     res.send('<h1>Home page</h1>'); //Sending HTML as response
// })

// app.get('/help', (req, res) => {
//     res.send('Help page');          
// })

// app.get('/about', (req, res) => {
//     res.send('<h1>About WEATHER App</h1>');
// })

//When you use template engine and set up views to render your homepage, you have to set up a route like this:
//Before doing this, create index.hbs under views folder and delete index.html from public folder
app.get('', (req, res) => {
    res.render('index', {               //pass the dynamic content to be shown on handlebar file, as object
        title: 'Weather',
        name: 'Naomi'
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Naomi'
    });
})

app.get('/help', (req,res) => {
    res.render('help', {
        helpText: 'This is some help content',
        title: 'Help',
        name: 'Naomi'
    })
})
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        });
    }
    geocode.geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({
                error                   //shorthand for error: error
            });
        }
        forecast.forecast(latitude, longitude, (error,forecastData) => {
            if (error) {
                return res.send({
                    error             //shorthand for error: error
                });
            }
            res.send({                //When you pass an object, it is automatically stringyfied into JSON string
                location,          //shorthand for location: location
                forecast: forecastData,
                address: req.query.address
            });
        });
    }); 
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        });
    }
    console.log(req.query.search);
    res.send({
        products: []
    });
})

//Setting up a 404 route handler for URLs that start with /help
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Naomi',
        errorMessage: 'Help article not found.'
    });
})


//Setting up a 404 route handler
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Naomi',
        errorMessage: 'Page not found.'
    })
})

//Starting the server up and running on port 3000 on local deployment environment
app.listen(3000, () => {
    console.log('Server is up on port 3000');
})