let rad = 45.35; // 도형의 너비
let xpos, ypos; // 도형의 시작점

let xspeed = 9; // 도형의 속도
let yspeed = 12; // 도형의 속도

let xdirection = 1; // 왼쪽 또는 오른쪽
let ydirection = -1; // 위 또는 아래

let success = false;
let pressed = 0;

function setup() {
  createCanvas(800, 450);
  frameRate(60);

  ellipseMode(RADIUS);
  // 도형의 시작점 설정
  xpos = random(1+rad, width-rad);
  ypos = random(1+rad, height-rad);
}

function draw() {
  background(0);
  success = false;

  // 도형의 위치 업데이트
  xpos = xpos + xspeed * xdirection;
  ypos = ypos + yspeed * ydirection;

  // 도형이 화면 경계를 넘어가는 지 테스트
  // 넘어갈 경우, -1을 곱하여 방향을 반대로 돌린다.
  if (xpos > width - rad || xpos < rad) {
    xdirection *= -1;
  }
  if (ypos > height - rad || ypos < rad) {
    ydirection *= -1;
  }

  // let d = dist(mouseX, mouseY, xpos, ypos);
  if (
    mouseX >= xpos - rad &&
    mouseX <= xpos + rad &&
    mouseY >= ypos - rad &&
    mouseY <= ypos + rad
    // d <= rad
  ) {
    overBox = true;
    // stroke(255);
    //fill(244, 122, 158);
  } else {
    fill(255);
    overBox = false;
  }

  // 도형 그리기
  ellipse(xpos, ypos, rad, rad);
}

function mousePressed() {
  if (overBox) {
    success = true;
    fill(255, 255, 0);
    xpos = random(1+rad, width-rad);
    ypos = random(1+rad, height-rad);
  } else {
    success = false;
    xpos = random(1+rad, width-rad);
    ypos = random(1+rad, height-rad);
  }
}