(function(window, console) {
  var canvas = document.getElementById('the-canvas'),
      context = canvas.getContext('2d'),
      button = document.getElementById('do-it'),
      animationCounter = 0,
      spriteInfo = {
        'source': document.getElementById('spritesheet'),
        'width': 32,
        'height': 32,
        'numFrames': 8,
        'current': 0,
      },
      canvasInfo = {
        'width': 500,
        'height': 500,
      };

  var animationTick = function() {
    animationCounter += 1;
    if (animationCounter >= spriteInfo.numFrames) {
      animationCounter = 0;
    }
    requestAnimationFrame(animationTick);
  };

  var drawSprite = function () {
    var destinationPosition = getRandomPosition();

    for (var i = 0; i < spriteInfo.numFrames; i++) {
      var offset = (animationCounter + i) % spriteInfo.numFrames;
      context.drawImage(
        spriteInfo.source,            // source
        0,                            // source x
        offset * spriteInfo.height,   // source y
        spriteInfo.width,             // source width
        spriteInfo.height,            // source height
        destinationPosition.x,        // destination x
        destinationPosition.y,        // destination y
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


  button.addEventListener('click', drawSprite);
  requestAnimationFrame(animationTick);
})(window, console);
