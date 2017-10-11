
var face;

function setup() {
  var canvas = createCanvas(500,500);
  canvas.parent('face'); //binding canvas to div

  face = loadImage('face.png');
}

function draw() {

  //the face:
  smooth();
  imageMode(CENTER);
  image(face, 250, 250, face.width/2, face.height/2);

  //the eyes:
  fill(0);
  ellipse(305 + cos(-0.09*mouseX/(2*PI))*20,250 + sin(-0.09*mouseY/(2*PI))*20,25,25);

  fill(0);
  ellipse(185 + cos(-0.09*mouseX/(2*PI))*20,250 + sin(-0.09*mouseY/(2*PI))*20,25,25);



}
