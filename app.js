var express  = require('express');
var socket = require('socket.io');
var qna = require('./qna'); //requires the JSON of questions ans answers
var users = require('./users');
var response = require('./response');


var app      = express();
var port  	 = 3000;

app.use(express.static(__dirname + '/client')); 		// statics
require('./server/routes.js')(app);						// routes

var server = app.listen(port);										// let the games begin!
console.log("Web server listening on port " + port);

app.use(express.static('client/js'));

var io = socket(server);

//When user connects:
io.on('connection',function(socket){

  //When message is recieved:
  socket.on('question',function(data){

    let user = data.name;
    let question = data.question;
    let res="";

    let noUser = users[user] == undefined ? true : false;
    let noAnswer = qna[question] == undefined ? true : false;

    if(noUser)
    {
        users[user] = {};
    }

    if(noAnswer)
    {
      data.answer = '';
    }
    else {

      let noAsks = users[user][question] == undefined ? true : false;
      if(noAsks){
        users[user][question] = 0;
      }

      users[user][question] += 1;

      let counter = users[user][question];
      let rand = Math.floor((Math.random() * 10));

      let ans = qna[question];
      //Gets a random response, according to the number of times, the question has been asked by the same user.
      switch(counter){
        case 1:
            res = response["response_1"][rand%(10)];
          break;

        case 2:
            res = response["response_2"][rand%(7)];
          break;

        case 3:
            res = response["response_3"][rand%(5)];
          break;

        case 4:
            res = response["response_4"][rand%(5)];
          break;

        default:
            res = response["response_5"][rand%(6)];
            ans='';
          break;
      }


      data.answer = res + ans;
    }

    console.log(qna);
    console.log(data);
    console.log('');


    //sends the message back to all users, with an answer
    io.sockets.emit('question',data);
  });

  socket.on('answer',function(data){
      qna[data.question] = data.answer;
      console.log(qna);
      io.sockets.emit('answer',data);
  });

});
