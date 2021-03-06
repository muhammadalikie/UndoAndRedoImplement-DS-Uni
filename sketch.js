// You only need to modify first 60 lines, no more
let animationDuration = 0.1;

class Node {
  // You can modify this class as you wish
  constructor(value) {
    this.value = value;
    this.prev = null;
  }
}

class Stack {
  // Complete the methods with 'Must be implemented'
  constructor() {
    // Must be implemented
    this.top = null;
    this.size = 0;
    this.data = null;
  }

  push(value) {

    this.data = new Node(value);

    if (this.size){
      this.data.prev = this.top;
    }

    this.top = this.data;
    this.size++;

    // console.log("push-top",this.top);
  }

  pop() {
    
    let value = null;
    
    if (this.size){
      value = this.top;
      this.top = this.top.prev;
      this.size--;
    }
    
    // console.log("pop-top",this.top);
    return value;
  }

  empty() {
    return this.size === 0;
  }
}



let undoActionHistory = new Stack();
let redoActionHistory = new Stack();



function onMoveListener(dir) {
  undoActionHistory.push(dir);
}


// undo implement:

function onUndoAction() {

  let value = undoActionHistory.pop().value;

  // set redo:
  redoActionHistory.push(value);

  // undo move implement:
  switch (value){
    case 'right':
    moveAgent('left');break;

    case 'left':
    moveAgent('right');break;

    case 'up':
    moveAgent('down');break;

    case 'down':
    moveAgent('up');break;
  }

}


// redo implement:

function onRedoAction(){

  let value = redoActionHistory.pop().value;

  // set undo:
  undoActionHistory.push(value);

  // undo move implement:
  moveAgent(value);

}

// /========================\
// |Don't modify codes below|
// \========================/

let W = 400;
let H = 400;

let localKeyEvent = true;

class Agent {
  constructor(options) {
    this.x = options.x;
    this.y = options.y;
    this.w = options.w;
    this.h = options.h;

    this.c = options.color;
  }

  draw() {
    push();

    fill(this.c);
    ellipse(this.x, this.y, this.w, this.h);

    pop();
  }
}

class Cell {
  constructor(options) {
    this.i = options.i;
    this.j = options.j;
    this.x = options.x;
    this.y = options.y;
    this.w = options.w;
    this.h = options.h;
  }

  draw() {
    push();

    rect(this.x, this.y, this.w, this.h);

    pop();
  }
}

class Grid {
  constructor(options) {
    this.n = options.n;
    this.m = options.m;
    this.w = options.w;
    this.h = options.h;

    this.init();
  }

  cell(i, j) {
    return this.grid[i][j];
  }

  init() {
    let grid = [];

    let w = this.w / this.m;
    let h = this.h / this.n;

    for (let i = 0; i < this.n; i++) {
      let row = [];
      let y = i * w;

      for (let j = 0; j < this.m; j++) {
        let x = j * h;
        row.push(new Cell({ i, j, x, y, w, h }));
      }

      grid.push(row);
    }

    this.grid = grid;
  }

  draw() {
    push();

    this.grid.forEach(row => {
      row.forEach(cell => cell.draw());
    })

    pop();
  }
}

let gridOptions = {
  n: 10,
  m: 10,
  w: W,
  h: H
}

let grid = new Grid(gridOptions)


let agentOptions = {
  x: 20 + Math.floor(Math.abs(Math.random() * 10 - 0.01)) * 40,
  y: 20 + Math.floor(Math.abs(Math.random() * 10 - 0.01)) * 40,
  w: 20,
  h: 20,
  color: 'red'
}

let agent = new Agent(agentOptions)

function disableKeyEvent() {
  localKeyEvent = false;
}

function enableKeyEvent() {
  localKeyEvent = true;
}

function moveAgent(dir) {
  if (dir === 'up') {
    if (agent.y - 40 > 0) {
      disableKeyEvent()
      gsap.to(agent, {
        y: agent.y - 40,
        duration: animationDuration,
        onComplete: enableKeyEvent
      })
    }
  }

  if (dir === 'down') {
    if (agent.y + 40 < 400) {
      disableKeyEvent()
      gsap.to(agent, {
        y: agent.y + 40,
        duration: animationDuration,
        onComplete: enableKeyEvent
      })
    }
  }

  if (dir === 'right') {
    if (agent.x + 40 < 400) {
      disableKeyEvent()
      gsap.to(agent, {
        x: agent.x + 40,
        duration: animationDuration,
        onComplete: enableKeyEvent
      })
    }
  }

  if (dir === 'left') {
    if (agent.x - 40 > 0) {
      disableKeyEvent()
      gsap.to(agent, {
        x: agent.x - 40,
        duration: animationDuration,
        onComplete: enableKeyEvent
      })
    }
  }
}

function keyPressed() {
  if (!localKeyEvent) return;

  if (keyCode == 87) {
    // up
    moveAgent('up')
    onMoveListener('up')

  }

  if (keyCode == 83) {
    // down
    moveAgent('down')
    onMoveListener('down')
  }

  if (keyCode == 68) {
    // right
    moveAgent('right')
    onMoveListener('right')
  }

  if (keyCode == 65) {
    // left
    moveAgent('left')
    onMoveListener('left')
  }

  if (keyCode == 90) {
    // undo
    onUndoAction();
  }

  if (keyCode == 89) {
    // redo
    onRedoAction();
  }
}


function setup() {
  createCanvas(W, H);
}

function draw() {
  background(220);
  grid.draw();
  agent.draw();
}

