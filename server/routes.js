
module.exports = function(app) {

	app.get('/', function(req, res) {
		res.sendfile('./public/index.html');
	});

	app.get('/data', function(req, res) {

	});


};
