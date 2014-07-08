var mango = require('mongodb');

var Server = mango.Server,
    Db = mango.Db,
    BSON = mango.BSONPure;


var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('resourcedb', server);

db.open(function(err, db){
    if(!err){
        console.log("connectes to 'resourcedb' database");
        db.collection('2013', {strict:true}, function(err, collection){});
    }
});

exports.deleteCollection = function(){
    db.dropCollection('resource', function(){
        console.log('Collection resource deleted');
    })
};

exports.getResource = function(req, res){
    console.log('Get single resource');
    console.log('=============================');
    console.log('Retrieving resource : ' + req.params.id);
    console.log('=============================');
    db.collection(req.params.year, function(err, collection){
        collection.findOne({'_id':new BSON.ObjectID(req.params.id)},
            function(err, item){
                res.send(item);
            });
    });
};

exports.addResource = function(req, res){
    var project = req.body;
    db.collection(req.params.year, {safe:true}, function(err,collection){
        console.log('Ajout');
        console.log('=============================');
        console.log('Adding resource: ' + JSON.stringify(project));
        collection.insert(project, {safe:true}, function(err, result) {
            if(err){
                res.send({'error' : 'An error has occurred'});
            }
            else
            {
                console.log('Success: ' + JSON.stringify(result[0]) + 'in '+ req.params.year);
                console.log('=============================');
                res.send(result[0]);
            }
        });
    });
};

exports.updateResource = function(req, res){
    var project = req.body;
    var year = req.params.year;
    project._id = new BSON.ObjectID(project._id);
    db.collection(year, function(err, collection){
        console.log('Update');
        console.log('=============================');
        console.log('base: '+year);
        console.log(JSON.stringify(project));
        console.log('Updating resource: ' + req.params.id);
        collection.update({_id:new BSON.ObjectID(req.params.id)}, project, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating resource: ' + err);
                res.send({'error':'An error has occurred'});
            }
            else
            {
                console.log('' + result + ' resource(s) updated');
                console.log('=============================');
                res.send(project);
            }
        });
    });
};

exports.delResource = function(req, res) {
    console.log('Delete');
    console.log('=============================');
    console.log('Deleting resource: ' + req.params.id);
    db.collection(req.params.year, function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(req.params.id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            }
            else
            {
                console.log('' + result + ' document(s) deleted');
                console.log('=============================');
                res.send(JSON.stringify(req.body));
            }
        });
    });
};

exports.getAllResourceByYear = function(req, res){
    console.log('Get all resources');
    console.log('=============================');
    console.log('Retrieving all resources' + req.params.year);
    console.log('=============================');
    db.collection(req.params.year,
        function(err, collection){
            collection.find().toArray(function(err, items){
                res.send(items);
            });
        })
};

exports.login = function(req, res){
    var user = req.body;
    db.collection('users', function(err, collection){
        collection.findOne({'name':user.name},
            function(err, item){
                if(item.name == user.name && item.pwd == user.pwd){
                    console.log(item.name + ' Log in at ' + Date.now());
                    res.send(true);
                }
                else{
                    res.send(false);
                }
            });
    });
};

exports.getAllUsers = function(req, res){
    console.log('Retrieving all users');
    db.collection('users',
        function(err, collection){
            collection.find().toArray(function(err, items){
                res.send(items);
            });
        })
};
