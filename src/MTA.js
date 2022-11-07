/* eslint-disable no-undef */
import React from 'react'
import Sketch from 'react-p5'
function MTA() {
  class Acq_zone{
    Acq_zone( t_cue,  dist) {
      this.distance = dist;
      this.x_position = t_cue;
      this.c = color(50,0,0);
    }
    show() {
      fill(c);
      rect(x_position + 100, 0, distance, height);  //  100 is margin space
      c = color(50,0,0);
    }
  }
  class Target {
    constructor(_speed) {
      this.speed = _speed / 60;  // 60hz
      this.y_position = height / 2;
      this.x_position = 0;
      this.c = color(255,255,255);
    }
    move() {
      if (x_position > width)
      {
        lastTime = millis();
        x_position = 0;
      }
      x_position = x_position + speed;
    }
    moveP(position) {
      x_position = position;
    }
    
    show() {
      fill(c);
      ellipse(x_position + 100,y_position,100,100);
    }
  }
  
  function keyReleased() {
    timeStamp = millis() - lastTime;
    if (key ==  ' ' &&  key01 ==  1 &&  isLoop &&  timeStamp >=  conditions[cond][2]) {
      println("timeStamp: ",(timeStamp - conditions[cond][0] - conditions[cond][2]));    
      if (timeStamp >=  conditions[cond][0] + conditions[cond][2] &&  timeStamp <=  conditions[cond][0] + conditions[cond][1] + conditions[cond][2]) {
        acq_zone.c = color(0, 255,0);
        successTotal += 1;
        success = 1;
      }
      target.moveP(0);
      lastTime = millis();
      trial += 1;
      
      logger.println((timeStamp - conditions[cond][0] - conditions[cond][2]) + "," + (cond + 1) + "," + trial + ","+
        success + "," + conditions[cond][0] + "," + conditions[cond][1] + "," + conditions[cond][2] + "," + key01);
      logger.flush();
      //logger.close();
      success = 0;
    }
  }
  function keyPressed() {
    timeStamp = millis() - lastTime;
    if (key ==  's') {
      isLoop = true;
      lastTime = millis();
      loop();
    }
    if (key ==  ' ' &&  key01 ==  0 &&  isLoop &&  timeStamp >=  conditions[cond][2]) {
      println("timeStamp: ",(timeStamp - conditions[cond][0] - conditions[cond][2]));    
      if (timeStamp >=  conditions[cond][0] + conditions[cond][2] &&  timeStamp <=  conditions[cond][0] + conditions[cond][1] + conditions[cond][2]) {
        acq_zone.c = color(0, 255,0);
        successTotal += 1;
        success = 1;
      }
      target.moveP(0);
      lastTime = millis();
      trial += 1;
      
      logger.println((timeStamp - conditions[cond][0] - conditions[cond][2]) + "," + (cond + 1) + "," + trial + ","+
        success + "," + (conditions[cond][0]) + "," + conditions[cond][1] + "," + conditions[cond][2] + "," + key01);
      logger.flush();
      //logger.close();
      success = 0;
    }
  }

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(900, 400).parent(canvasParentRef)

    let conditions = [[0,80,1000],[0,150,1000] ,[0,80,1500] ,[0,150,1500] ,[100,80,1000] ,[100,150,1000] ,[100,80,1500] ,[100,150,1500]];
    let cond = 0;       //  index for conditions
    let trial = 0;      //  the number of trial (0 to 34)
    let success = 0;    //  1 if button input succeed, 0 if failed
    let successTotal = 0; //  indicates the total number of success per trial
    let key01 = 1;      //  0 if keyPressed() case, 1 if keyRelaesed() case.
    let timeStamp = 0;
    let isLoop = false;


    let condList = [];
    let condList2 = [];
    for (let i = 0; i < 8; i++){
      condList[i]=i;
      condList2[i]=i;
    }
    p5.shuffle(condList,true);
    p5.shuffle(condList2,true);
    // p5.noLoop();
    // cond = condList.remove(0);
    // let time = (conditions[cond][1]) / 1000.0;  
    // let distance = width / 9; //  900 / 9 = 100
    // let velocity = distance / time; // Target velocity = pixel / ms
    // let target = new Target(velocity);
    // let acq_zone = new Acq_zone(conditions[cond][0],distance);
    // let logger = createWriter("../2018147595.csv");
    // logger.println("timestamp,cond,trial,success,t_cue,t_zone,p,key");

  }
  
  const draw = p5 => {
    p5.background(0);
  // if (trial > 34) {
  //   isLoop = false;
  //   p5.noLoop();
  //   if (condList.size()>0)
  //     cond = condList.remove(0);
  //   else if (condList2.size()>0) {  
  //     cond = condList2.remove(0);
  //     key01 = 0;
  //   }
  //   else{
  //     logger.flush();
  //     logger.close();
  //     exit();
  //   }
  //   successTotal = 0;
  //   trial = 0;
  //   time = (conditions[cond][1]) / 1000.0;
  //   velocity = distance / time;
  //   target = new Target(velocity);
  //   acq_zone = new Acq_zone(conditions[cond][0],distance);
  // }
  // if (!isLoop) {
  //   p5.textSize(20);
  //   p5.fill(255,255,255);
  //   p5.text("Press S to start",3 * width / 5,30,30);
  // }
  // else{
  //   p5.fill(255,255,255);
  //   p5.textSize(15);
  //   p5.text("Condition : " + (cond + 1) + " Success : " + successTotal + " Trials : " + trial + "/35",3 * width / 5,30);
  // }
  // acq_zone.show();
  // timeStamp = millis() - lastTime;
  // if (timeStamp >=  conditions[cond][2]) {
  //   target.show();
  //   target.move();
  // }
  }
  
  return <Sketch setup={setup} draw={draw} />
}

export default MTA