var express = require('express');
var multer = require('multer');
var app = express();
var http = require('http').Server(app);
//var io = require('socket.io')(http);
//app.use(express.static(__dirname + '/public'));
var mongojs = require("mongodb");
var mongoUri = "mongodb://localhost:27017/portal";
//var fs = require('fs');
var fs = require('fs-extra');

app.use('/api/photo', multer({ dest: './uploads/',
	rename: function (fieldname, filename) {
		return Date.now() + '.upload';
	},
	onFileUploadStart: function (file) {
		console.log(file.originalname + ' is starting ...');
		var fileId = fileNameToFileId(file.name);
	},
	onFileUploadComplete: function (file) {
		console.log(file.fieldname + ' uploaded to  ' + file.path);
		done=true;
	},
	onFileUploadData: function (file, data) {
		console.log(data.length + ' of ' + file.fieldname + ' arrived');
		console.log(JSON.stringify(data.length));

		var fileId = fileNameToFileId(file.name);
		console.log('file id:' + fileId);
		if (!fs.existsSync('./meta/' + fileId)) {
			file.doneSize = 0;
			fs.outputFileSync('./meta/' + fileId, JSON.stringify(file));
		}
		var meta = fs.readJsonSync('./meta/' + fileId);
		meta.doneSize = meta.doneSize + data.length;
		console.log(JSON.stringify(meta));
		fs.outputFileSync('./meta/' + fileId, JSON.stringify(meta));
	}
}));

app.get('/m', function(req, res) {
	function testMongo() {
			mongojs.connect(mongoUri, ["articles"], function(err, db) {
				if (err) {
					res.write("Failed.");
					res.end();
					console.log(err);
					return;
				}
				var articles = db.collection('articles');
//				var article = articles.insert({ title: 'O mysiach', content: 'Toto vieme o mysiach.' }, function (err) {
//					console.log(err);
//				});
//				var BSON = mongojs.BSONPure;
//				var o_id = new BSON.ObjectID("54b3a9f4c58a907d1de45e8f");
////				articles.update({'_id' : o_id }, { $set: { content: 'Toto vieme o mysiach3.' } }, function (err) {
////					console.log(err);
////					res.write('Done.');
////					res.end();
////				});
//				articles.remove({_id: o_id}, function(err, result) {
//					console.log(err);
//					res.write('Done.');
//					res.end();
//				});
				articles.find({}, {}, function (err, cursor) {
					cursor.toArray(function(err, data) {
						if (err) {
							console.log('error');
							return;
						}
	
						res.write('found: ' + data.length);
						for (var i = 0; i < data.length; i++) {
							//res.write(data[i]._id + ': ' + data[i].title + '<br/>');
							res.write(JSON.stringify(data[i]) + '<br/>     ');
						}
						res.end();
						return;
					})
				});

				//res.write(out.count());
//				out.each(function(err, article) {
//					if (article) {
//						res.write('1');
//						res.write(article._id + ':' + article.title + '<br/>');
//					} else {
//						res.write('??');
//					}
//				});
				//res.write(articles);
			});
			
	}

	testMongo();
});
app.get('/', function(req, res){
  res.sendfile('test.html');
});
app.post('/api/photo', function(req,res) {
	if (done == true) {
		console.log('file uploaded');
		var filePath = req.files['uploaded_file'].path;
		var fileIdent = fileNameToFileId(req.files['uploaded_file'].name);
		var dest = './upload/' + fileIdent;
		console.log(filePath + '  ' + dest);
		fs.copy(filePath, dest, {}, function (err) {
			if (err) {
				console.log(err);
			}
		});
		res.json({ ok: true, fileIdent: fileIdent });
		res.end();
	}
});
app.get('/api/get/:id', function(req, res){
	var id = req.param('id');
	console.log('id:' + id);
	console.log('Returning file: ' + id)
	res.sendfile('./upload/' + id);
});
app.get('/api/meta/:id', function(req, res){
//	res.writeHead(200, {"Content-Type": "application/json"});
	var id = req.param('id');
	console.log('id:' + id);
	console.log('Returning file: ' + id)
	res.sendfile('./meta/' + id);
});
http.listen(8880, function(){
	  console.log('listening on *:8880');
});

function fileNameToFileId(fileName) {
	if (fileName) {
		var idLength = fileName.indexOf('.upload.jpg');
		return fileName.substring(0, idLength);
	}
	return "";
}

/*
var express = require('express');
var app = express();
var http = require('http');
var url = require("url");
var querystring = require("querystring");
var mongojs = require("mongodb");

var app = express();

http.createServer(function(request, response) {
//	response.writeHead(200, {"Content-Type": "text/plain"});
//	response.write("Hello World");
//	response.write("Url:" + request.url);

	var route = url.parse(request.url).pathname;
	var params = url.parse(request.url, true).query;

	app.get('/a/', function(req, res){
		res.sendfile('test.html');
	});
	
//	response.write("<br/><br/>");
//	response.write("Route: " + route);
//	response.write("<br/><br/>");
//	response.write("Param x: " + params.x);
//	response.write("<br/><br/>");
//	response.write(JSON.stringify(params));

	response.end();
}).listen(8880, 'localhost');
*/
console.log("Server started");
