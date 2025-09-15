const monster = {
   IMAGE: "monsterTileSheet.png",
   SIZE: 128,
   COLUMNS: 3,
   numberOfFrames: 5,
   currentFrame: 0,
   sourceX: 0,
   sourceY: 0,
   forward: true,

   HIDING: 0,
   JUMPING: 1,
   HIT: 2,
   state: this.HIDING,

   timeToReset: 9,
   resetCounter: 0,

   waitTime: undefined,

   findWaitTime: function () {
      this.waitTime = Math.ceil(Math.random() * 60);
   },

   updateAnimation: function () {
      this.sourceX = Math.floor(this.currentFrame % this.COLUMNS) * this.SIZE;
      this.sourceY = Math.floor(this.currentFrame / this.COLUMNS) * this.SIZE;

      if (this.waitTime > 0 || this.waitTime === undefined) {
         this.state = this.HIDING;
      } else {
         this.state = this.JUMPING;
      }

      switch(this.state) {
         case this.HIDING:
            this.currentFrame = 0;
            this.waitTime--;
            break;
         case this.JUMPING:
            if (this.currentFrame === this.numberOfFrames) {
               this.forward = false;
            }
            if (this.currentFrame === 0 && this.forward === false) {
               this.forward = true;
               this.findWaitTime();
               this.state = this.HIDING;
               break;
            }
            if (this.forward) {
               this.currentFrame++;
            } else {
               this.currentFrame--;
            }
            break;
         case this.HIT:
            this.currentFrame = 6;

            this.resetCounter++;

            if (this.resetCounter === this.timeToReset) {
               this.state = this.HIDING;
               this.forward = true;
               this.currentFrame = 0;
               this.resetCounter = 0;
               this.findWaitTime();
            }
            break;
      }
   }
};

const ROWS = 3;
const COLUMNS = 4;
const SIZE = monster.SIZE;
const SPACE = 10;

const monsterObjects = [];
const monsterCanvases = [];
const monsterDrawingSurfaces = [];

const image = new Image();
image.addEventListener("load", loadHandler);
image.src = "../image/" + monster.IMAGE;

function mousedownHandler(event) {
   const theCanvasThatWasClicked = event.target;

   for (let i = 0; i < monsterCanvases.length; i++) {
      if (monsterCanvases[i] === theCanvasThatWasClicked) {
         const monster = monsterObjects[i];
         if (monster.state === monster.JUMPING) {
            monster.state = monster.HIT;
         }
      }
   }
}

function loadHandler() {
   buildMap();
   updateAnimation();
}

function buildMap() {
   for (let row = 0; row < ROWS; row++) {
      for (let column = 0; column < COLUMNS; column++) {
         const newMonsterObject = Object.create(monster);
         newMonsterObject.findWaitTime();
         monsterObjects.push(newMonsterObject);
         
         const canvas = document.createElement("canvas");
         canvas.setAttribute("width", SIZE);
         canvas.setAttribute("height", SIZE);
         stage.appendChild(canvas);
         canvas.style.top = row * (SIZE + SPACE) + "px";
         canvas.style.left = column * (SIZE + SPACE) + "px";
         canvas.addEventListener("mousedown", mousedownHandler);
         monsterCanvases.push(canvas);
         
         const drawingSurface = canvas.getContext("2d");
         monsterDrawingSurfaces.push(drawingSurface);
      }
   }
}

function updateAnimation() {
   setTimeout(updateAnimation, 120);
   for (let i = 0; i < monsterObjects.length; i++) {
      monsterObjects[i].updateAnimation();
   }
   render();
}

function render() {
   for (i = 0; i < monsterObjects.length; i++) {
      const monster = monsterObjects[i];
      const drawingSurface = monsterDrawingSurfaces[i];

      drawingSurface.clearRect(0, 0, SIZE, SIZE);

      drawingSurface.drawImage(
         image,
         monster.sourceX, monster.sourceY, SIZE, SIZE,
         0, 0, SIZE, SIZE
      );
   }
}