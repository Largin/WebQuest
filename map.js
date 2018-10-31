"use strict"

console.log("scripting map...");

class XY {
	constructor(x, y) {
		if(typeof x === "number" && typeof y === "number") {
			this.x = x;
			this.y = y;
		}
		if(typeof x === "string") {
			let a = x.split("=");
			this.x = Number(a[0]);
			this.y = Number(a[1]);
		}
		if(typeof x === "object" && typeof x.x === "number" && typeof x.y === "number" ) {
			this.x = x.x;
			this.y = x.y;
		}
	}

	north() {
		return new XY(this.x, this.y-1);
	}
	south() {
		return new XY(this.x, this.y+1);
	}
	east() {
		return new XY(this.x+1, this.y);
	}
	west() {
		return new XY(this.x-1, this.y);
	}

	behind(xy) {
		console.log(this, xy);
		if(xy.x == this.x && xy.y == this.y) return null;
		if(xy.x != this.x && xy.y != this.y) return null;
		if(xy.x == this.x) {
			if(this.y < xy.y) return xy.south();
			if(this.y > xy.y) return xy.north();
		}
		if(xy.y == this.y) {
			if(this.x < xy.x) return xy.east();
			if(this.x > xy.x) return xy.west();
		}
		return null;
	}

	toString(){
		return this.x + '=' + this.y;
	}
}

class MapStructure {
	constructor() {
		this.layout = new Map();
	}

	randomDirection() {
		let directions = ['north', 'south', 'east', 'west'];
		let random = Math.floor(Math.random() * directions.length);
		return directions[random];
	}

	generator() {
		let necessary = ['r','r','r','r','r','r','r'];
		let possibleLocations = [];


		let canvas = document.getElementById("canvas");
		let context = canvas.getContext('2d');
		context.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);


		while (necessary.length) {
			let tempRoom = necessary.shift();
			let tempLoca = null;
			let walls = [];
			let doors = [];
			let holes = [];
			let nulls = [];

			if(possibleLocations.length === 0) {
				console.log('starting');
				tempLoca = new XY(0,0);
			}
			else if(possibleLocations.length === 1 && necessary.length === 0) {
				console.log('ending');
				tempLoca = possibleLocations.shift();
			}
			else if((possibleLocations.length === 1 || Math.random() * 10 > possibleLocations.length) && tempRoom == 'r') {
				console.log('halling');
				necessary.unshift(tempRoom);
				tempRoom = 'h';
				tempLoca = possibleLocations.shift();
			} else if(possibleLocations.length > 1 || tempRoom == 'h') {
				console.log('pushing');
				tempLoca = possibleLocations.splice(Math.floor(Math.random()*possibleLocations.length), 1)[0];
			} else
				break;

			console.log(tempLoca, tempRoom, possibleLocations);

			this.layout.set(tempLoca.toString(), tempRoom);
			let neighboursD = [tempLoca.north(), tempLoca.south(), tempLoca.east(), tempLoca.west()];
			let neighboursR = [this.layout.get(neighboursD[0].toString()), this.layout.get(neighboursD[1].toString()), this.layout.get(neighboursD[2].toString()), this.layout.get(neighboursD[3].toString())];

			console.log(neighboursR);

			for (let i = 0; i < 4; i++) {
				if(typeof neighboursR[i] === 'undefined') nulls.push(neighboursD[i]);
				if(neighboursR[i] == 'w') walls.push(neighboursD[i]);
				if(neighboursR[i] == 'd') doors.push(neighboursD[i]);
				if(neighboursR[i] == '') holes.push(neighboursD[i]);
			}

			if(nulls.length === 4 && tempRoom === 'r') {
				let tempDir = this.randomDirection();
				for (let i = 0; i < nulls.length; i++) {
					this.layout.set(nulls[i].toString(), 'w');
				}
				let tempDirLoc = tempLoca[tempDir]();
				this.layout.set(tempDirLoc.toString(), 'd');
			} else if(tempRoom === 'r') {
				if(doors.length === 0) {
					let tempDoor = holes.splice(Math.floor(Math.random()*holes.length), 1)[0];
					this.layout.set(tempDoor.toString(), 'd');
				}
				for (let i = 0; i < nulls.length; i++) {
					this.layout.set(nulls[i].toString(), 'w');
				}
				for (let i = 0; i < holes.length; i++) {
					this.layout.set(holes[i].toString(), 'w');
				}
			} else if(tempRoom === 'h') {
				for (let i = 0; i < nulls.length; i++) {
					this.layout.set(nulls[i].toString(), '');
				}
				for (let i = 0; i < holes.length; i++) {
					this.layout.set(holes[i].toString(), 'h');
				}
			}

			walls = [];
			doors = [];
			holes = [];
			nulls = [];

			possibleLocations = [];

			for(let le of this.layout) {
				if(le[1] === 'w' || le[1] === 'r') continue;
				let location = new XY(le[0]);
				console.log(location, location.west(), location.east(), location.south(), location.north());
				if(this.layout.has(location.west().toString()) && !this.layout.has(location.east().toString())) possibleLocations.push(location.east());
				if(this.layout.has(location.east().toString()) && !this.layout.has(location.west().toString())) possibleLocations.push(location.west());
				if(this.layout.has(location.south().toString()) && !this.layout.has(location.north().toString())) possibleLocations.push(location.north());
				if(this.layout.has(location.north().toString()) && !this.layout.has(location.south().toString())) possibleLocations.push(location.south());
			}

			console.log(necessary.length, possibleLocations);

			for(let le of this.layout) {
				let location = new XY(le[0]);

				context.strokeStyle = "black";
				context.beginPath();
				context.arc(location.x*10, location.y*10, 5, 0, 2*Math.PI);
				switch(le[1]) {
					case 'w': context.fillStyle = 'black'; break;
					case 'r': context.fillStyle = 'white'; break;
					case 'd': context.fillStyle = 'brown'; break;
					case 'h': context.fillStyle = 'green'; break;
					case '': context.fillStyle = 'red'; break;
				}
				context.fill();
				context.stroke();
				context.strokeStyle = "black";
			}

			for(let pe of possibleLocations) {
				context.strokeStyle = "black";
				context.beginPath();
				context.arc(pe.x*10, pe.y*10, 2, 0, 2*Math.PI);
				context.fillStyle = 'black';
				context.fill();
				context.stroke();
				context.strokeStyle = "black";
			}
		}
	}

	draw() {
		let canvas = document.getElementById("canvas");
		let context = canvas.getContext('2d');

		context.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);

		for(let le of this.layout) {
			let location = new XY(le[0]);

			context.strokeStyle = "black";
			context.beginPath();
			context.arc(location.x*10, location.y*10, 5, 0, 2*Math.PI);
			switch(le[1]) {
				case 'w': context.fillStyle = 'black'; break;
				case 'r': context.fillStyle = 'white'; break;
				case 'd': context.fillStyle = 'brown'; break;
				case 'h': context.fillStyle = 'green'; break;
				case '': context.fillStyle = 'red'; break;
			}
			context.fill();
			context.stroke();
			context.strokeStyle = "black";
		}
	}
}

var n = new MapStructure();
n.generator();