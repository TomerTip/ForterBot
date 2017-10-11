// App
var socket = io.connect('localhost:3000');
var app = angular.module('app', []);

// Service to fetch some data..
app.factory('dataServ', ['$http',function($http) {
	return {
		get : function(q) {
			return $http.get('/data/' + q);
		}
	}
}]);

// App controller
app.controller('appController', function($scope,$compile) {

	var divId = 1;
	var userColor;
	$scope.nameSubmited = true;
	$scope.hasAnswer = false;

	/*When the user submits his name */
	$scope.submitName = function(){
		if($scope.name){
			$scope.submit = true;
			$scope.nameSubmited = false;

			userColor = getRandomColor();
			$scope.nameStyle = {'font-weight':'bold', 'color':userColor};
		}
	};

	/*Sends a question to the server.*/
	$scope.sendQuestion = function(){
			let packet = {name: $scope.name, color: userColor, question: $scope.q, answer:''};
			socket.emit('question', packet );

			$scope.q = ''; //emptys question field
			};

	/*When the users get back the message from the server, prints the message*/
	socket.on('question',function(data){

		let section = document.createElement("DIV");
		let question = document.createElement("DIV");
		let answer = document.createElement("DIV");

		let q_name = "<span style='color:" + data.color + "'>" + "<strong>"+ data.name +"</strong>" +": " + "</span>";
		let q_question = "<span>" + data.question + "</span>";
		question.innerHTML += q_name + q_question;

		let a_answer = ">>" + data.answer ;
		let a_input = "<input type='text' placeholder='Answer this question:'></input>";
		let a_button = "<button type='button' ng-click='sendAnswer($event)' name='button' class='ansBN'>Answer</button>";

		//answer / answer input :
		if(data.answer != ''){
			answer.innerHTML += a_answer;
		}else if(data.name != $scope.name){
			answer.innerHTML += a_input + a_button;
		}

		section.appendChild(question);
		section.appendChild(answer);
		section.appendChild(document.createElement("HR"));

		section.id = divId;
		divId++;

		//angular compiles the dynamicaly generated elements.
		let temp = $compile(section)($scope);
		angular.element(document.getElementById('chat')).append(temp);

		//keeps the view on last message.
		scrollDown();
	});

	/*When a user submits an answer to a question:*/
	$scope.sendAnswer = function($event){

			let parent = $event.currentTarget.parentNode;
			let grand_parent = parent.parentNode;


			let q = grand_parent.childNodes[0].childNodes[1].innerText; //gets the question.
			let a = parent.childNodes[0].value; //gets the answer of user.

			let div_id = grand_parent.id;

			let packet = {name:$scope.name,color:userColor,question:q,answer:a,div:div_id};
			socket.emit('answer',packet);
	}

	/*When the new answer is recieved by users:*/
	socket.on('answer',function(data){

		let div = document.getElementById(data.div);

		let answer = '';
		let a_name = "<span style='color:" + data.color + "'>" + "<strong>"+ data.name +"</strong>" +": " + "</span>";
		let a_answer = "<span>" + data.answer + "</span>";

		answer = a_name + a_answer;
		div.childNodes[1].innerHTML = answer; //prints the answer.

	});
});

/*Generates a random string that represents a color, for the user*/
function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

/* Keeps scrolling down to the bottom of the chat*/
function scrollDown()
{
	var elem = document.getElementById('chat');
	elem.scrollTop = elem.scrollHeight;
}
