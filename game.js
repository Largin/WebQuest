"use strict"

console.log("scripting...");

function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

let rooms = {
  "cell": {name: "Stone Cell", exits: {p: {door: 1}}},
  "hallway": {name: "Stone Hallway", exits: {p: {door: 4, open: 4}}}
}

class ROOM {
  constructor(type){    
    let r = rooms[type];
    this.name = r.name;
    
    this.possibleExits = r.exits.p;
    this.exits = {n:false, s:false, e:false, w:false};
  }
  
  addExit(side, type) {
    if(this.exits[side]) throw "Already here.";
    if(this.possibleExits[type] > 0) {
      this.possibleExits[type]--;
      this.exits[side] = type;
    } else throw "Too many of these already.";
  }
}

class LAYOUT {
  constructor() {
    this.objects = {};
  }
  
  add(where, what) {
    if(this.objects[where]) throw "Can't do here.";
    this.objects[where] = what;
  }
  
  get(where) {
    return this.objects[where];
  }
  
  static xy(x, y) {
    if(typeof x === "number" && typeof y === "number") return x+'-'+y;
    if(typeof x === "string") {
      let a = a.split("-");
      return {x: a[0], y: a[1]};
    }
    
    throw "Can't understand.";
  }
}

class FLOOR {
  constructor() {
    this.layout = new LAYOUT();
    
    
  }
}
