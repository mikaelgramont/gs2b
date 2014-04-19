(function() {
  var animationCounter = 0,
      frameCounter = 0,
      totalAnimations = 0,
      totalFrames = 0,
      spriteInfo = {
        'source': document.getElementById('half-framerate'),
        'width': 20,
        'height': 30,
        'numFrames': 27,
        'fps': 7.5 //
      },
      canvasInfo = {},
      running = false,
      requestAnimationFrameId = null;
  const FPS = 60;
  // Set to true to use the calculated-once, positioned many times canvas.
  // Set to false to use the calculated-on-the-fly canvas.
  const USE_POSITIONING = false;

  var containerEls = document.getElementsByClassName('canvas-container');
  canvasInfo.width = containerEls[0].offsetWidth;
  canvasInfo.height = containerEls[0].offsetHeight;

  var frameCounterEl = document.getElementById('frame-counter');
  var positionedCanvasEl, context;
  var calculatedCanvasEls = [], calculatedContexts = [], sprites = [];
  if (USE_POSITIONING) {
    positionedCanvasEl = createPositionedCanvas();
    containerEls[0].appendChild(positionedCanvasEl);
    var context = canvasEl.getContext('2d');
  } else {
    calculatedCanvasEls = [createCalculatedCanvas(), createCalculatedCanvas()];
    calculatedContexts = [calculatedCanvasEls[0].getContext('2d'),
                          calculatedCanvasEls[1].getContext('2d')];
    containerEls[0].appendChild(calculatedCanvasEls[0]);
    containerEls[1].appendChild(calculatedCanvasEls[1]);
    sprites = [[], []];
  }

  var addEl = document.getElementById('drop-one');
  var stopEl = document.getElementById('stop');

  // Run for every paint, this function synchronises all animations.
  function animationTick() {
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

    frameCounterEl.innerHTML = frameCounter;
    if (USE_POSITIONING) {
      updateCanvasPosition();
    } else {
      redrawSprites(spriteInfo, sprites[0], calculatedContexts[0]);
      redrawSprites(spriteInfo, sprites[1], calculatedContexts[1]);
    }

    requestAnimationFrameId = requestAnimationFrame(animationTick);
  }


  function createPositionedCanvas() {
    var canvasEl = document.createElement('canvas');
    canvasEl.width = canvasInfo.width;
    canvasEl.height = spriteInfo.numFrames * canvasInfo.height;
    canvasEl.classList.add('positioned');
    return canvasEl;  
  }

  function createCalculatedCanvas() {
    var canvasEl = document.createElement('canvas');
    canvasEl.width = canvasInfo.width;
    canvasEl.height = canvasInfo.height;
    return canvasEl;
  }

  // Adds a new sprite in the canvas at a random position. This will add a
  // sprite frame in each canvas frame.
  function addSpriteToPositionedCanvas(context) {
    var destinationPosition = getRandomPosition();

    for (var i = 0; i < spriteInfo.numFrames; i++) {
      var offset = (frameCounter + i) % spriteInfo.numFrames;
      context.drawImage(
        spriteInfo.source,            // source
        offset * spriteInfo.width,    // source x - use i or offset to sync or unsync sprites
        0,                            // source y
        spriteInfo.width,             // source width
        spriteInfo.height,            // source height
        destinationPosition.x,        // destination x
        destinationPosition.y + i * canvasInfo.height, // destination y
        spriteInfo.width,             // destination width
        spriteInfo.height);           // destination height
    }
  };
  
  function addSpritesForCalculatedCanvases() {
    for (var i = 0; i < 2; i++) {
      var position = getRandomPosition();
      sprites[i].push({
        'x': position.x,
        'y': position.y,
        'offset': frameCounter
      });
      // Sort sprites vertically so that they don't sit on top of each other. 
      sprites[i].sort(function(a, b) {
        if (a.y === b.y) {
          return 0;
        } else if (a.y > b.y) {
          return 1;
        }
        return -1;
      });
    }
  }

  function redrawSprites(spriteInfo, sprites, context) {
    context.clearRect(0, 0, canvasInfo.width, canvasInfo.height);
    for (var i = 0, l = sprites.length; i < l; i++) {
      var s = sprites[i];
      var offset = (s.offset + frameCounter) % spriteInfo.numFrames;
      context.drawImage(
        spriteInfo.source,            // source
        offset * spriteInfo.width,    // source x - use i or offset to sync or unsync sprites
        0,                            // source y
        spriteInfo.width,             // source width
        spriteInfo.height,            // source height
        s.x,        // destination x
        s.y, // destination y
        spriteInfo.width,             // destination width
        spriteInfo.height);           // destination height
    }  
  }

  // Returns random coordinates that are fully contained within the canvas.
  function getRandomPosition() {
    var x = Math.random() * canvasInfo.width;
    x = Math.min(x, canvasInfo.width - spriteInfo.width);

    var y = Math.random() * canvasInfo.height
    y = Math.min(y, canvasInfo.height - spriteInfo.height);

    return {
      'x': Math.floor(x),
      'y': Math.floor(y)
    };
  }

  // Move the canvas vertically to display the current frame.
  function updateCanvasPosition() {
    canvasEl.style.top = (-1 * frameCounter * canvasInfo.height) + 'px';
  }

  addEl.addEventListener('click', function() {
    if (USE_POSITIONING) {
      addSpriteToPositionedCanvas(context);
    } else {
      addSpritesForCalculatedCanvases();
    }
    if (!requestAnimationFrameId) {
      requestAnimationFrameId = requestAnimationFrame(animationTick);
    }
  });

  stopEl.addEventListener('click', function() {
    cancelAnimationFrame(requestAnimationFrameId);
    requestAnimationFrameId = null;
  });

  function fixAnim() {
    var animInfo = {
      'original': document.getElementById('original'),
      'destination': document.getElementById('edited-animation'),
      'totalWidth': 5830,
      'cellWidth': 110,
      'animOffset': 73,
      'animWidth': 20,
      'height': 30
    };
    var destinationCanvas = document.createElement('canvas');
    destinationCanvas.id = 'destination-canvas';
    destinationCanvas.width = animInfo.animWidth * animInfo.totalWidth / animInfo.cellWidth;
    destinationCanvas.height = animInfo.height;
    document.body.appendChild(destinationCanvas);
    var destinationContext = destinationCanvas.getContext('2d');
    for (var i = 0, x = 0, destinationPointer = 0;
         x < animInfo.totalWidth;
         x += animInfo.cellWidth, i++) {
      // Skip some iterations here to drop frames.
      if (i % 2) {
        continue;
      }

      destinationContext.drawImage(
        animInfo.original,                             // source
        x + animInfo.animOffset,                       // source x
        0,                                             // source y
        animInfo.animWidth,                            // source width
        animInfo.height,                               // source height
        destinationPointer * animInfo.animWidth,       // destination x
        0,                                             // destination y
        animInfo.animWidth,                            // destination width
        animInfo.height);                              // destination height

      destinationPointer++;
    }
    var dataURL = destinationCanvas.toDataURL();
    console.log('dataURL', dataURL);
    animInfo.destination.src = dataURL;
  }
  window.fixAnim = fixAnim;

})();
