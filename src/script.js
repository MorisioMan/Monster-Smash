const monster = {
   IMAGE: "../image/monsterTileSheet.png",
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
      }

      this.sourceX = Math.floor(this.currentFrame % this.COLUMNS) * this.SIZE;
      this.sourceY = Math.floor(this.currentFrame / this.COLUMNS) * this.SIZE;
   }
};

const canvas = document.querySelector("canvas");
const drawingSurface = canvas.getContext("2d");

const image = new Image();
image.addEventListener("load", loadHandler);
image.src = monster.IMAGE;

canvas.addEventListener("mousedown", mousedownHandler);

function mousedownHandler(event) {
   if (monster.state === monster.JUMPING) {
      monster.state = monster.HIT;
   }
}

function loadHandler() {
   monster.findWaitTime();
   updateAnimation();
}

function updateAnimation() {
   setTimeout(updateAnimation, 120);
   monster.updateAnimation();
   render();
}

function render() {
   drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
   drawingSurface.drawImage(
      image,
      monster.sourceX, monster.sourceY, monster.SIZE, monster.SIZE,
      0, 0, monster.SIZE, monster.SIZE
   );
}