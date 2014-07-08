var express = require('express'),
    app = express(),
    resource = require('./resource'),
    http = require('http').createServer(app);

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(
        function crossOrigin(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "content-type");
            res.header('Access-Control-Allow-Methods', 'GET,PUT,UPDATE,POST,DELETE');
            return next();
        }
    );
});

// request on resource
app.get('/resources/:year', resource.getAllResourceByYear);
app.get('/resources/:year/:id', resource.getResource);
app.post('/resources/:year', resource.addResource);
app.put('/resources/:year/:id', resource.updateResource);
app.delete('/resources/:year/:id', resource.delResource);

http.listen(8081);
console.log('Server running at 8081');