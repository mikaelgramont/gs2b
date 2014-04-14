(function() {
  var animationCounter = 0,
      frameCounter = 0,
      totalAnimations = 0,
      totalFrames = 0,
      spriteInfo = {
        'source': document.getElementById('spritesheet'),
        'width': 32,
        'height': 32,
        'numFrames': 8,
        'fps': 8,
      },
      canvasInfo = {},
      running = false,
      requestAnimationFrameId = null;
  const FPS = 60;

  var containerEl = document.getElementById('fun-container');
  canvasInfo.width = containerEl.offsetWidth;
  canvasInfo.height = containerEl.offsetHeight;

  var canvasEl = document.createElement('canvas');
  canvasEl.width = canvasInfo.width;
  canvasEl.height = spriteInfo.numFrames * canvasInfo.height;
  canvasEl.id = 'the-canvas';
  containerEl.appendChild(canvasEl);
  var context = canvasEl.getContext('2d');

  var addEl = document.getElementById('drop-one');
  var stopEl = document.getElementById('stop');

  // Run for every paint, this function synchronises all animations.
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
    updateCanvasPosition();

    requestAnimationFrameId = requestAnimationFrame(animationTick);
  };

  // Adds a new sprite in the canvas at a random position. This will add a
  // sprite frame in each canvas frame.
  var addSprite = function () {
    var destinationPosition = getRandomPosition();

    for (var i = 0; i < spriteInfo.numFrames; i++) {
      var offset = (frameCounter + i) % spriteInfo.numFrames;
      context.drawImage(
        spriteInfo.source,            // source
        0,                            // source x
        offset * spriteInfo.height,   // source y - set to 0 to sync all sprites
        spriteInfo.width,             // source width
        spriteInfo.height,            // source height
        destinationPosition.x,        // destination x
        destinationPosition.y + i * canvasInfo.height, // destination y
        spriteInfo.width,             // destination width
        spriteInfo.height);           // destination height
    }
  };

  // Returns random coordinates that are fully contained within the canvas.
  var getRandomPosition = function() {
    var x = Math.floor(Math.random() * (canvasInfo.width - spriteInfo.width)),
        y = Math.floor(Math.random() * (canvasInfo.height - spriteInfo.width));
    return {'x':x, 'y':y};
  };

  // Move the canvas vertically to display the current frame.
  var updateCanvasPosition = function() {
    canvasEl.style.top = (-1 * frameCounter * canvasInfo.height) + 'px';
  };

  addEl.addEventListener('click', function() {
    addSprite();
    if (!requestAnimationFrameId) {
      requestAnimationFrameId = requestAnimationFrame(animationTick);
    }
  });

  stopEl.addEventListener('click', function() {
    cancelAnimationFrame(requestAnimationFrameId);
    requestAnimationFrameId = null;
  });
})();
