/*
 TODO:
 - recreate the containers on the fly when the page is resized,
 - redistribute all sprites on resizing
 - clean up on page dispose
*/

(function(window) {

  // This represents the number of frames browsers treat every second.
  const FPS = 60;

  var animationCounter = 0,
      frameCounter = 0,
      frameCounterEl,
      addEl,
      stopEl,
      totalAnimations = 0,
      totalFrames = 0,
      animInfo,
      canvasInfo = [],
      running = false,
      requestAnimationFrameId = null;


  // Init function.
  function init() {
    animInfo = {
      'source': document.getElementById('half-framerate'),
      'width': 20,
      'height': 30,
      'numFrames': 27,
      'fps': 7.5
    },

    var containerEls = document.getElementsByClassName('canvas-container');
    for (var i = 0, l = containerEls.length; i < l; i++) {
      var containerEl = containerEls[i],
          canvasEl = createCanvas(containerEl.offsetWidth, containerEl.offsetHeight);
      containerEl.appendChild(canvasEl);
      canvasInfo.push({
        'el': canvasEl,
        'width': containerEl.offsetWidth,
        'height': containerEl.offsetHeight,
        'context': canvasEl.getContext('2d'),
        'sprites': []
      });
    }

    addEl = document.getElementById('drop-one');
    stopEl = document.getElementById('stop');
    frameCounterEl = document.getElementById('frame-counter');

    addEl.addEventListener('click', function() {
      for (var i = 0, l = canvasInfo.length; i < l; i++) {      
        addSprite(canvasInfo[i]);
      } 
      if (!requestAnimationFrameId) {
        requestAnimationFrameId = requestAnimationFrame(animationTick);
      }
    });

    stopEl.addEventListener('click', function() {
      cancelAnimationFrame(requestAnimationFrameId);
      requestAnimationFrameId = null;
    });
  }


  // Run for every paint, this function synchronises all animations.
  function animationTick() {
    totalAnimations += 1;
    animationCounter += 1;
    if (animationCounter >= FPS) {
      animationCounter = 0;
    }

    if (animationCounter % (FPS / animInfo.fps) == 0) {
      frameCounter += 1;
      totalFrames += 1;
    }

    if (frameCounter >= animInfo.numFrames) {
      frameCounter = 0;
    }
    frameCounterEl.innerHTML = frameCounter;
    
    for (var i = 0, l = canvasInfo.length; i < l; i++) {  
      redrawSprites(canvasInfo[i]);
    }

    requestAnimationFrameId = requestAnimationFrame(animationTick);
  }


  // Creates a canvas element.
  function createCanvas(width, height) {
    var canvasEl = document.createElement('canvas');
    canvasEl.width = width;
    canvasEl.height = height;
    return canvasEl;
  }

  
  // Adds a new sprite to the canvas.
  function addSprite(canvasInfo) {
    var position = getRandomPosition(canvasInfo);
    canvasInfo.sprites.push({
      'x': position.x,
      'y': position.y,
      'offset': frameCounter
    });
    
    // Sort sprites vertically so that they don't sit on top of each other. 
    canvasInfo.sprites.sort(function(a, b) {
      if (a.y === b.y) {
        return 0;
      } else if (a.y > b.y) {
        return 1;
      }
      return -1;
    });
  }


  // Clears the canvas and redraws everything.
  function redrawSprites(canvasInfo) {
    canvasInfo.context.clearRect(0, 0, canvasInfo.width, canvasInfo.height);
    for (var i = 0, l = canvasInfo.sprites.length; i < l; i++) {
      var s = canvasInfo.sprites[i];
      var offset = (s.offset + frameCounter) % animInfo.numFrames;
      canvasInfo.context.drawImage(
        animInfo.source,            // source
        offset * animInfo.width,    // source x - use i or offset to sync or unsync sprites
        0,                            // source y
        animInfo.width,             // source width
        animInfo.height,            // source height
        s.x,        // destination x
        s.y, // destination y
        animInfo.width,             // destination width
        animInfo.height);           // destination height
    }  
  }

  // Returns random coordinates that are fully contained within the canvas.
  function getRandomPosition(canvasInfo) {
    var x = Math.random() * canvasInfo.width;
    x = Math.min(x, canvasInfo.width - animInfo.width);

    var y = Math.random() * canvasInfo.height
    y = Math.min(y, canvasInfo.height - animInfo.height);

    return {
      'x': Math.floor(x),
      'y': Math.floor(y)
    };
  }

  window.initGs2b = init;

})(window);
