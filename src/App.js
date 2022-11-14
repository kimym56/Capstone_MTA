/*
 * For Tips and Advanced Usage read this Blog Post
 * https://levelup.gitconnected.com/integrating-p5-sketches-into-your-react-app-de44a8c74e91
 */
import React, { useState } from "react";
import ReactDOM from "react-dom";
import Sketch from "react-p5";
import {db} from "./Firebase.js"
import { collection, addDoc } from "firebase/firestore";
import "./style.css";
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

export default function App() {
  const [pause, setPause] = useState(true);
  const [name, setName] = useState("");
  
  const onChangeName = (e) => {
    setName(e.target.value);
  };
  let rad = Math.random() * 56.692913386 + 34.015748031; // 도형의 너비
  let xpos, ypos; // 도형의 시작점
  let speed = (Math.random() * 566.92913386) / 60; // 도형의 속도

  let xdirection = Math.random() * 2 - 1; // 왼쪽 또는 오른쪽
  let ydirection = Math.random() * 2 - 1; // 위 또는 아래
  let lastMouseX;
  let lastMouseY;
  let success = false;
  let pressed = 0;
  let writer;
  let lastTime;
  let quickly = Math.random();
  let count = 0;

  const upload = async(e) =>{
    const result = writer.content.split(/\r?\n/);
   
      const docRef = await addDoc(collection(db, "data"), {
        data: result,    
      });
      console.log("Document written with ID: ", docRef.id);
    
  }

  const setup = (p5, parentRef) => {
    p5.createCanvas((p5.windowWidth * 4) / 5, (p5.windowHeight * 4) / 5).parent(
      parentRef
    );
    p5.frameRate(60);
    p5.ellipseMode(p5.RADIUS);
    xpos = p5.random(1 + rad, p5.width - rad);
    ypos = p5.random(1 + rad, p5.height - rad);
    writer = p5.createWriter("log.csv");
    writer.print(
      "timestamp,velocity_target,radius_target,x_pointer,y_pointer,button_state,x_target,y_target,lastMouseX,lastMouseY,xdirection,ydirection,count,name"
    );

    p5.background(0);
    lastTime=p5.millis()
    p5.fill(255, 255, 255);
    // p5.textSize(p5.height / 10);
    // p5.textAlign("center");
    // p5.text("Click on the moving target", p5.width / 2, (2 * p5.height) / 10);
    // if (quickly > 0.5)
    //   p5.text("as quickly as possible", p5.width / 2, (3 * p5.height) / 10);
    // else
    //   p5.text("as accurately as possible", p5.width / 2, (3 * p5.height) / 10);
    // if (pause == true) {
    //   let inp = p5.createInput(name);
    //   inp.position(p5.width / 2, (5 * p5.height) / 10);
    //   inp.center("horizontal");

    //   let button = p5.createButton("start");
    //   // console.log(button)
    //   // console.log(inp)

    //   button.center();
    //   button.mousePressed(() => {
    //     lastTime = p5.millis();

    //     pause = !pause;
    //   });
    // }
    // p5.text(
    //   "Input Unique Name and Press Button to start",
    //   p5.width / 2,
    //   (7 * p5.height) / 10
    // );
  };

  const draw = (p5) => {
    if (count > 3) {
      p5.background(0);
      p5.textSize(p5.height / 10);
      p5.fill(255)
      p5.textAlign("center");
      p5.text("Finish",p5.width/2,p5.height/2)
      // p5.textSize(15)
      // p5.text(writer.content, p5.width / 2, p5.height / 2);
      upload();
      p5.exit();

    } else {
      if (pause) {
      } else {
        p5.background(0);
        p5.textSize(10);
        p5.text(
          Math.floor(p5.millis() - lastTime),
          (3 * p5.width) / 4,
          p5.height / 5
        );
        success = false;
        // 도형의 위치 업데이트
        xpos =
          xpos +
          (speed * xdirection) /
            Math.sqrt(Math.pow(xdirection, 2) + Math.pow(ydirection, 2));
        ypos =
          ypos +
          (speed * ydirection) /
            Math.sqrt(Math.pow(xdirection, 2) + Math.pow(ydirection, 2));
        // console.log("here", Math.pow(xdirection, 2) + Math.pow(ydirection, 2));
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
        } else {
          p5.fill(255);
          p5.overBox = false;
        }

        // 도형 그리기
        p5.ellipse(xpos, ypos, rad, rad);
      }
    }
    lastMouseX = p5.mouseX;
    lastMouseY = p5.mouseY;
  };
  const mousePressed = (p5) => {
    if (p5.overBox) {
      p5.fill(255, 255, 0);
      success = true;
      // rad = (Math.random()*56.692913386 + 34.015748031)
      // xdirection = Math.random()*2-1; // 왼쪽 또는 오른쪽
      // ydirection = Math.random()*2-1; // 위 또는 아래
      // speed = (Math.random()*566.92913386/60)
      // xpos = p5.random(1+rad, p5.width-rad);
      // ypos = p5.random(1+rad, p5.height-rad);
    } else {
      success = false;
      // rad = (Math.random()*56.692913386 + 34.015748031)
      // xdirection = Math.random()*2-1; // 왼쪽 또는 오른쪽
      // ydirection = Math.random()*2-1; // 위 또는 아래
      // speed = (Math.random()*566.92913386/60)
      // xpos = p5.random(1+rad, p5.width-rad);
      // ypos = p5.random(1+rad, p5.height-rad);
    }
    writer.print(
      p5.millis() -
        lastTime +
        "," +
        speed +
        "," +
        rad +
        "," +
        p5.mouseX +
        "," +
        p5.mouseY +
        "," +
        success +
        "," +
        xpos +
        "," +
        ypos +
        "," +
        lastMouseX+
        ","+
        lastMouseY+
        ","+
        xdirection+
        ","+
        ydirection+
        ","+
        count+
        ","+
        name
    );
  };
  const mouseReleased = (p5) => {
    lastTime = p5.millis();
    if (p5.overBox) {
      p5.fill(255, 255, 0);
      success = true;
      rad = Math.random() * 56.692913386 + 34.015748031;
      xdirection = Math.random() * 2 - 1; // 왼쪽 또는 오른쪽
      ydirection = Math.random() * 2 - 1; // 위 또는 아래
      speed = (Math.random() * 566.92913386) / 60;
      xpos = p5.random(1 + rad, p5.width - rad);
      ypos = p5.random(1 + rad, p5.height - rad);
    } else {
      success = false;
      rad = Math.random() * 56.692913386 + 34.015748031;
      xdirection = Math.random() * 2 - 1; // 왼쪽 또는 오른쪽
      ydirection = Math.random() * 2 - 1; // 위 또는 아래
      speed = (Math.random() * 566.92913386) / 60;
      xpos = p5.random(1 + rad, p5.width - rad);
      ypos = p5.random(1 + rad, p5.height - rad);
    }
    if (pause == false) count = count + 1;
  };

  const keyPressed = (p5) => {};
  return (
    <div className="App">
      <h1>The Point-and-Click</h1>
      {pause ? (
        <>
          <h2>
            <span className="header1">Just Click</span>{" "}
            <span>on the moving target</span>
            <span>
              {quickly > 0.5
                ? " as quickly as possible"
                : " as accurately as possible"}
            </span>
          </h2>
          <h2>Input Unique Name and Press Button to start</h2>
          <input type="text" value={name} onChange={onChangeName} />
          <button onClick={() => setPause(false)}>Start</button>
        </>
      ) : (
        <Sketch
          setup={setup}
          draw={draw}
          mousePressed={mousePressed}
          mouseReleased={mouseReleased}
          keyPressed={keyPressed}
        />
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
