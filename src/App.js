import React, { useState } from "react";
import ReactDOM from "react-dom";
import Sketch from "react-p5";
import { db, storage, storageRef } from "./Firebase.js";
import { collection, addDoc } from "firebase/firestore";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { uploadBytes, ref } from "firebase/storage";
import "./style.css";
import { Button, Slider } from "@mui/material";
const FINISH = 10;

export default function App() {
  const [pause, setPause] = useState(true); // 인치,이름 세팅 화면
  const [name, setName] = useState("");
  const [inch, setInch] = useState(24);
  const handle = useFullScreenHandle();
  const pxmm = // from pixel to mm
    Math.sqrt(
      Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)
    ) /
    (inch * 25.4);

  const onChangePause = (e) => {
    // console.log(document.querySelectorAll("div.fs")[0].style);
    setPause(false);
  };
  const onChangeName = (e) => {
    setName(e.target.value);
  };

  let rad = pxmm * (Math.random() * 15 + 9); // 도형의 너비
  let xpos, ypos; // 도형의 시작점
  let speed = (pxmm * (Math.random() * 150)) / 60; // 도형의 속도
  let xdirection = Math.random() * 2 - 1; // 왼쪽 또는 오른쪽
  let ydirection = Math.random() * 2 - 1; // 위 또는 아래
  let lastMouseX;
  let lastMouseY;
  let success = false; // 성공 여부
  let click = false; // 클릭 여부
  let tmp = false; // 1 block 마다 휴식
  let writer;
  let lastTime;
  let count = 0;

  const upload = async (e) => {
    // firebse 연동 부분
    const result = writer.content // ** \r 버그 확인 필요 .replace(/\n/g, "\r\n");
    const storageRef = ref(storage, name + Date() + ".csv");
    const fileData = JSON.stringify(result);
    const blob = new Blob([fileData], { type: "text/csv;charset=utf-8;" });
    uploadBytes(storageRef, blob).then((snapshot) => {
      // console.log("Uploaded a blob or file!");
    });
  };

  const setup = (p5, parentRef) => {
    // p5 setup
    if (inch > 20)
      // 20인치 이상부터는 고정 크기
      p5.createCanvas(pxmm * 442.8, pxmm * 249.1).parent(parentRef);
    // fullscreen
    else
      p5.createCanvas(window.innerWidth, window.innerHeight).parent(parentRef);

    p5.frameRate(60); // 60 frame
    p5.ellipseMode(p5.RADIUS); // 원

    xpos = p5.random(1 + rad, p5.width - rad);
    ypos = p5.random(1 + rad, p5.height - rad);

    writer = p5.createWriter("log.csv");
    writer.write(
      `timestamp,velocity_target,radius_target,x_pointer,y_pointer,button_state,click,x_target,y_target,lastMouseX,lastMouseY,xdirection,ydirection,count,name`
    );
    // writer.write('\n')

    p5.background(0);
    lastTime = p5.millis();
    p5.fill(255, 255, 255);
  };

  const draw = (p5) => {
    // p5 draw
    if (count >= FINISH) {
      // 끝난 경우
      p5.background(0);
      p5.textSize(p5.height / 10);
      p5.fill(255);
      p5.textAlign("center");
      p5.text("Finish", p5.width / 2, p5.height / 2);
      upload();
      p5.exit();
    } else if (tmp == true) {
      // block 마다 휴식
      p5.background(0);
      p5.textSize(window.innerHeight / 20);
      p5.textAlign("center");
      p5.text(count + "/400 has completed.", p5.width / 2, p5.height / 2);
      p5.text("press any key to continue.", p5.width / 2, (3 * p5.height) / 4);
    } else {
      // draw (tmp == false)
      p5.background(0);
      p5.textSize(window.innerHeight / 80);
      p5.text(count + " / 400", (9 * p5.width) / 10, p5.height / 10);
      success = false;
      // 도형의 위치 업데이트
      xpos +=
        (speed * xdirection) /
        Math.sqrt(Math.pow(xdirection, 2) + Math.pow(ydirection, 2));
      ypos +=
        (speed * ydirection) /
        Math.sqrt(Math.pow(xdirection, 2) + Math.pow(ydirection, 2));

      // 도형이 화면 경계를 넘어가는 지 테스트
      // 넘어갈 경우, -1을 곱하여 방향을 반대로 돌린다.
      if (xpos > p5.width - rad || xpos < rad) {
        xdirection *= -1;
      }
      if (ypos > p5.height - rad || ypos < rad) {
        ydirection *= -1;
      }
      // 마우스가 도형 경계를 넘어가는 지 확인
      if (
        p5.mouseX >= xpos - rad &&
        p5.mouseX <= xpos + rad &&
        p5.mouseY >= ypos - rad &&
        p5.mouseY <= ypos + rad
      ) {
        p5.overBox = true;
      } else {
        p5.fill(255);
        p5.overBox = false;
      }

      // 도형 그리기
      p5.ellipse(xpos, ypos, rad, rad);
      writer.write(
        `${p5.millis() - lastTime},${speed},${rad},${p5.mouseX},${
          p5.mouseY
        },${success},${click},${xpos},${ypos},${lastMouseX},${lastMouseY},${xdirection},${ydirection},${count},${name}`
      );
      lastMouseX = p5.mouseX;
      lastMouseY = p5.mouseY;
    }
  };
  const mousePressed = (p5) => {
    // 마우스를 누르고 있을 때
    if (tmp == false) {
      click = true;
      if (p5.overBox) {
        p5.fill(255, 255, 0);
        success = true;
      } else {
        success = false;
      }
      writer.write(
        `${p5.millis() - lastTime},${speed},${rad},${p5.mouseX},${
          p5.mouseY
        },${success},${click},${xpos},${ypos},${lastMouseX},${lastMouseY},${xdirection},${ydirection},${count},${name}`
      );
    }
    click = false;
  };
  const mouseReleased = (p5) => {
    // 마우스를 땔 때
    if (tmp == false) {
      lastTime = p5.millis();
      if (p5.overBox) {
        p5.fill(255, 255, 0);
        success = true;
        rad = pxmm * (Math.random() * 15 + 9);
        xdirection = Math.random() * 2 - 1; // 왼쪽 또는 오른쪽
        ydirection = Math.random() * 2 - 1; // 위 또는 아래
        speed = (pxmm * (Math.random() * 150)) / 60;
        xpos = p5.random(1 + rad, p5.width - rad);
        ypos = p5.random(1 + rad, p5.height - rad);
      } else {
        success = false;
        rad = pxmm * (Math.random() * 15 + 9);
        xdirection = Math.random() * 2 - 1; // 왼쪽 또는 오른쪽
        ydirection = Math.random() * 2 - 1; // 위 또는 아래
        speed = (pxmm * (Math.random() * 150)) / 60;
        xpos = p5.random(1 + rad, p5.width - rad);
        ypos = p5.random(1 + rad, p5.height - rad);
      }
      if (pause == false) { // 100마다 휴식
        count = count + 1;
        if (count % 100 == 0) tmp = true;
      }
    }
  };

  const keyPressed = (p5) => {
    if (p5.key) {
      tmp = false;
      p5.redraw();
    }
  };
  return (
    <div className="App">
      <FullScreen handle={handle} className="fs">
        <div className={pause ? "container" : "containerPause"}>
          {pause ? (
            <>
              <h1>The Point-and-Click Simulation</h1>
              <h2>Instructions</h2>
              <p>
                <span>
                  1. Press the FULLSCREEN button.
                  <span className="button">
                    <Button variant="contained" onClick={handle.enter}>
                      FullScreen
                    </Button>
                  </span>
                </span>
              </p>
              <p className="margin">
                2. Determine your monitor screen inch by adjusting the slider
                against any credit card you have.
              </p>
              <p className="header1">
                (17-32-inch users only can do this test.)
              </p>
              <img
                src={
                  "https://ck-content.imgix.net/pcm/content/34d7318f7ab26b293f33-chasesapphirepreferred_big.png"
                }
                width={pxmm * 85.6}
                height={pxmm * 53.98}
                alt="card"
              />
              <p>Your moniter is {inch} inches</p>
              <p className="slider">
                <Slider
                  value={typeof inch === "number" ? inch : 0}
                  onChange={(e) => setInch(e.target.value)}
                  defaultValue={24}
                  aria-label="Default"
                  valueLabelDisplay="auto"
                  min={17}
                  max={32}
                />
              </p>
              <p>
                3. Enter a unique name (survey code) to receive mTurk reward and
                press the start button.
              </p>
              <span>Unique Name: </span>
              <input type="text" value={name} onChange={onChangeName} />
              <span className="button">
                <Button
                  variant="contained"
                  onClick={() => {
                    if (inch !== 0 && handle.active) onChangePause(false);
                    else alert("Check inch or fullscreen");
                  }}
                >
                  Start
                </Button>
              </span>
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
      </FullScreen>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
