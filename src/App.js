/*
 * For Tips and Advanced Usage read this Blog Post
 * https://levelup.gitconnected.com/integrating-p5-sketches-into-your-react-app-de44a8c74e91
 */
import React,{useState} from 'react';
import ReactDOM from 'react-dom';
import Sketch from 'react-p5';
import "./style.css"
// class Target extends React.Component{
//   constructor(props){
//     super(props);
//     const {p5} = props;
//     this.speed = props.speed / 60;
//     this.y_pos = p5.height / 2;
//     this.x_pos = 0;
//     this.c = p5.color(255,255,255);
//   }

//   move(p5){
//     if(this.x_pos > p5.width){
      
//     }
//   }
// }

export default function App (){

  // const [rad, setRad] = useState(45.35);
  let rad = (Math.random()*56.692913386 + 34.015748031); // 도형의 너비
  let xpos, ypos; // 도형의 시작점
  let xspeed = 9; // 도형의 속도
  let yspeed = 12; // 도형의 속도
  let speed = (Math.random()*192.37795276/60)
  
  let xdirection = Math.random()*2-1; // 왼쪽 또는 오른쪽
  let ydirection = Math.random()*2-1; // 위 또는 아래
  let success = false;
  let pressed = 0;
  let writer;
  const [mouse , setMouse] = useState();
	const setup = (p5, parentRef) => {
		p5.createCanvas(p5.windowWidth*4/5, p5.windowHeight*4/5).parent(parentRef);
    p5.frameRate(60);
    p5.ellipseMode(p5.RADIUS);
    xpos = p5.random(1+rad,p5.width-rad);
    ypos = p5.random(1+rad, p5.height-rad);
    writer = p5.createWriter('log.csv');
	};

	const draw = (p5) => {
		p5.background(0);
    success=false;
		// 도형의 위치 업데이트
    xpos = xpos + (speed * xdirection/Math.sqrt(Math.pow(xdirection)+Math.pow(ydirection)));
    ypos = ypos + (speed * ydirection/Math.sqrt(Math.pow(xdirection)+Math.pow(ydirection)));
    console.log('here',xdirection,ydirection,speed);
    // 도형이 화면 경계를 넘어가는 지 테스트
    // 넘어갈 경우, -1을 곱하여 방향을 반대로 돌린다.
    if (xpos > p5.width - rad || xpos < rad) {
      xdirection *= -1;
    }
    if (ypos > p5.height - rad || ypos < rad) {
      ydirection *= -1;
    }
    // console.log(p5.mouseX,p5.mouseY);
    // writer.print(p5.mouseX ,p5.mouse5);
    // writer.flush();
    // writer.close();
    // let d = dist(mouseX, mouseY, xpos, ypos);
    if (
      p5.mouseX >= xpos - rad &&
      p5.mouseX <= xpos + rad &&
      p5.mouseY >= ypos - rad &&
      p5.mouseY <= ypos + rad
      // d <= rad
    ) {
      p5.overBox = true;
      // stroke(255);
      //fill(244, 122, 158);
    } else {
      p5.fill(255);
      p5.overBox = false;
    }
  
    // 도형 그리기
    p5.ellipse(xpos, ypos, rad, rad);
	};
  const mousePressed=(p5)=>{
    if (p5.overBox) {
      success = true;
      rad = (Math.random()*56.692913386 + 34.015748031)
      xdirection = Math.random()*2-1; // 왼쪽 또는 오른쪽
      ydirection = Math.random()*2-1; // 위 또는 아래
      speed = (Math.random()*192.37795276/60)
      p5.fill(255, 255, 0);
      xpos = p5.random(1+rad, p5.width-rad);
      ypos = p5.random(1+rad, p5.height-rad);
    } else {
      success = false;
      rad = (Math.random()*56.692913386 + 34.015748031)
      xdirection = Math.random()*2-1; // 왼쪽 또는 오른쪽
      ydirection = Math.random()*2-1; // 위 또는 아래
      speed = (Math.random()*192.37795276/60)
      xpos = p5.random(1+rad, p5.width-rad);
      ypos = p5.random(1+rad, p5.height-rad);
    }
  }
		return (
			<div className="App">
				<h1>The Point-and-Click</h1>
				<Sketch setup={setup} draw={draw} mousePressed={mousePressed} />
			</div>
		);
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
