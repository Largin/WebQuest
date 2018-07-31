"use strict"

console.log("scripting...");

let rooms = {
  "cell": {name: "Stone Cell", exits: [1,1,1,1,0,0,1]},
  "hallway": {name: "Stone Hallway", exits: [1,1,1,1,0,0,4]}
}

class EXITS {
  constructor(exitsTable) {
    this._north = !!exitsTable[0];
    this._south = !!exitsTable[1];
    this._west  = !!exitsTable[2];
    this._east  = !!exitsTable[3];
    
    this.up    = !!exitsTable[4];
    this.down  = !!exitsTable[5];
    
    this.special = false;
    this.limit = exitsTable[6] || 4;
  }
  
  closeOthers() {
    if(this._north === true) this._north = false;
    if(this._south === true) this._south = false;
    if(this._west === true) this._west = false;
    if(this._east === true) this._east = false;

    if(this.up === true) this.up = false;
    if(this.down === true) this.down = false;    
  }
  
  get north() {return this._north;}
  set north(item) {
    if(this._north === false) return this._north;
    if(this._north !== true) this.limit++;
    this._north = item;
    if((--this.limit) === 0) this.closeOthers;    
  }
  
  get south() {return this._south;}
  set south(item) {
    if(this._south === false) return this._south;
    if(this._south !== true) this.limit++;
    this._south = item;
    if((--this.limit) === 0) this.closeOthers;    
  }
  
  get west() {return this._west;}
  set west(item) {
    if(this._west === false) return this._west;
    if(this._west !== true) this.limit++;
    this._west = item;
    if((--this.limit) === 0) this.closeOthers;    
  }
  
  get east() {return this._east;}
  set east(item) {
    if(this._east === false) return this._east;
    if(this._east !== true) this.limit++;
    this._east = item;
    if((--this.limit) === 0) this.closeOthers;    
  }  
  
  get neighbours() {
    let n = {};
    if(this._north && this._north !== true) n.north = this._north;
    if(this._south && this._south !== true) n.south = this._south;
    if(this._west && this._west !== true) n.west = this._west;
    if(this._east && this._east !== true) n.east = this._east;
    if(this.up && this.up !== true) n.up = this.up;
    if(this.down && this.down !== true) n.down = this.down;
    
    return n;
  }
}

class ROOM {
  constructor(type){    
    let r = rooms[type];
    this.exits = new EXITS(r.exits);
    this.name = r.name;
  }
  
  addNeighbour(side, room) {
    if(side == "north") {
      this.exits.north = room;
      room.exits.south = this;      
    }    
    if(side == "south") {
      this.exits.south = room;
      room.exits.north = this;      
    }      
    if(side == "west") {
      this.exits.west = room;
      room.exits.east = this;      
    }   
    if(side == "east") {
      this.exits.east = room;
      room.exits.west = this;      
    }       
    if(side == "up") {
      this.exits.up = room;
      room.exits.down = this;      
    }
    if(side == "down") {
      this.exits.down = room;
      room.exits.up = this;      
    }
    return this;
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

let r = new ROOM("cell");
let h = new ROOM("hallway");
r.addNeighbour("north", h);
console.log(h);
