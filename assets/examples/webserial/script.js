/*
WebSerial example
Reads from a webSerial serial port, and writes to it.
Works on Chrome and Edge and Opera browsers. 

created 28 Jan 2022
modified 15 May 2022
by Tom Igoe
*/


// the DOM elements that might be changed by various functions:
let portButton;   // the open/close port button
let readingsSpan; // DOM element where the incoming readings go
let timeSpan;     // DOM element for one special reading
let webserial;
let sliderValueArduino;
let randomValueArduino;
let knob;
let compilationDateArduino;

function setup() {
  // get the DOM elements and assign any listeners needed:
  // user text input:
  const textInput = document.getElementById("txt");
  textInput.addEventListener("keyup", readTextInput);
  // user range input:
  const slider = document.getElementById("dim");
  slider.addEventListener("change", readRangeInput);
  // span for incoming serial messages:
  readingsSpan = document.getElementById("readings");

  // span for random value:
  compilationDateArduino = document.getElementById("compilationDateArduino");

  // span for slider value:
  sliderValueArduino = document.getElementById("sliderValueArduino");

  // span for random value:
  randomValueArduino = document.getElementById("randomValueArduino");

  meter = document.getElementById("meter");

  // span for incoming serial messages:
  timeSpan = document.getElementById("seconds");

  
  
  webserial = new WebSerialPort();
  if (webserial) {
    webserial.on("data", serialRead);
     // port open/close button:
     portButton = document.getElementById("portButton");
     portButton.addEventListener("click", openClosePort);


     onButton.addEventListener("click", ledOn);
     offButton.addEventListener("click", ledOff);

     randomValueArduinoButton.addEventListener("click", getRandomValue);
   }
}

async function openClosePort() {
  // label for the button will change depending on what you do:
  let buttonLabel = "Open port";
  // if port is open, close it; if closed, open it:
  if (webserial.port) {
    await webserial.closePort();
  } else {
    await webserial.openPort();
    buttonLabel = "Close port";
  }
  // change button label:
  portButton.innerHTML = buttonLabel;
}

function serialRead(event) {
  readingsSpan.innerHTML = event.detail.data;

  if (event.detail.data.startsWith("slider")){
    compilationDateArduino.innerHTML = event.detail.data.substring(10);
  }  

  if (event.detail.data.startsWith("slider")){
    sliderValueArduino.innerHTML = event.detail.data.substring(6);
  }

  if (event.detail.data.startsWith("random")){
    randomValueArduino.innerHTML = event.detail.data.substring(6);
  }

  if (event.detail.data.startsWith("knob")){
    meter.value = event.detail.data.substring(4);
  }
}

function readTextInput(event) {
  // this function is triggered with every keystroke in the input field.
  // listen for the enter key (keyCode = 13) and skip the rest of
  // the function if you get any other key:
  if (event.keyCode != 13) {
    return;
  }
  // if you do get an enter keyCode, send the value of the field
  // out the serial port:
  webserial.sendSerial("display"+event.target.value);
}

function readRangeInput(event) {
  // send the range input's value out the serial port:
  
  webserial.sendSerial("slider"+event.target.value);
}


function ledOn(event) {
  // this function is triggered with every keystroke in the input field.
  // listen for the enter key (keyCode = 13) and skip the rest of
  // the function if you get any other key:
  webserial.sendSerial("LED ON");
}

function ledOff(event) {
  // this function is triggered with every keystroke in the input field.
  // listen for the enter key (keyCode = 13) and skip the rest of
  // the function if you get any other key:
  webserial.sendSerial("LED OFF");
}

function getRandomValue(event) {
  // this function is triggered with every keystroke in the input field.
  // listen for the enter key (keyCode = 13) and skip the rest of
  // the function if you get any other key:
  webserial.sendSerial("random");
}


// run the setup function when all the page is loaded:
document.addEventListener("DOMContentLoaded", setup);