(function(window, console) {
  var buttonEl = document.getElementById('do-it'),
      animationCounter = 0,
      frameCounter = 0,
      totalAnimations = 0,
      totalFrames = 0,
      spriteInfo = {
        'source': document.getElementById('spritesheet'),
        'width': 32,
        'height': 32,
        'numFrames': 8,
        'fps': 2,
        'current': 0,
      },
      canvasInfo = {
        'width': 500,
        'height': 500,
      };
  const FPS = 60;

  var canvasEl = document.createElement('canvas');
  canvasEl.width = canvasInfo.width;
  canvasEl.height = spriteInfo.numFrames * canvasInfo.height;
  canvasEl.id = 'the-canvas';
  document.getElementById('fun-container').appendChild(canvasEl);
  var context = canvasEl.getContext('2d');

  var animationTick = function() {
    totalAnimations += 1;
    animationCounter += 1;
    if (animationCounter >= FPS) {
      animationCounter = 0;
    }

    if (animationCounter % (FPS / spriteInfo.fps) == 0) {
      frameCounter += 1;
      totalFrames += 1;
    }

    if (frameCounter >= spriteInfo.numFrames) {
      frameCounter = 0;
    }
    moveCanvas();
    requestAnimationFrame(animationTick);
  };

  var drawSprite = function () {
    var destinationPosition = getRandomPosition();

    for (var i = 0; i < spriteInfo.numFrames; i++) {
      var offset = (frameCounter + i) % spriteInfo.numFrames;
      context.drawImage(
        spriteInfo.source,            // source
        0,                            // source x
        offset * spriteInfo.height,   // source y
        spriteInfo.width,             // source width
        spriteInfo.height,            // source height
        destinationPosition.x,        // destination x
        destinationPosition.y + i * canvasInfo.height,        // destination y
        spriteInfo.width,             // destination width
        spriteInfo.height);           // destination height
    }
  };

  // Returns random coordinates that are fully contained within the canvas
  var getRandomPosition = function() {
    var x = Math.floor(Math.random() * (canvasInfo.width - spriteInfo.width)),
        y = Math.floor(Math.random() * (canvasInfo.height - spriteInfo.width));
    return {'x':x, 'y':y};
  };

  var moveCanvas = function() {
    canvasEl.style.top = (-1 * frameCounter * canvasInfo.height) + 'px';
  };

  buttonEl.addEventListener('click', drawSprite);
  requestAnimationFrame(animationTick);
})(window, console);
