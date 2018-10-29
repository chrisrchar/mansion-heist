var textComplete = false;

function Typewriter() {
    this.typedText;
    this.timer;
    this.pickedQuote;
    var _that = this;
    var game;

    function init(gameInstance, options) {
        game = gameInstance;
        _that.time = options.time || Phaser.Timer.SECOND / 40;
        _that.sound = options.sound || null;
        _that.soundMarker = options.soundMarker || null;
        _that.writerFn = options.writerFn || null;
        _that.endFn = options.endFn || null;
        _that.times = options.times || 10;
        _that.text = options.text || "";
        _that.x = options.x || 100;
        _that.y = options.y || 100;
        _that.maxWidth = options.maxWidth || 200;
        _that.fontFamily = options.fontFamily || "Arial";
        _that.fontSize = options.fontSize || 28;
        _that.writerObj = options.writerObj || null;
        _that.anchor = options.anchor || 0;
    }

    function start() {
        textComplete = false;
        enableTypingSpecificMessage(_that.text, _that.x, _that.y);
    }

    function stop() {
        if (_that.timer !== undefined) {
            _that.timer.stop();
            game.time.events.remove(_that.timer);
        }
        if (_that.sound !== null) {
            _that.sound.stop();
        }
        //if(_that.typedText !== undefined){ // This can cause problems if you repeatedly type to a text object. ~Tilde
        //    _that.typedText.destroy();
        //}
    }

    function enableTypingSpecificMessage(text, x, y) {

        if (_that.writerObj === null) {
            _that.typedText = game.add.bitmapText(x, y, _that.fontFamily, text, _that.fontSize);
            _that.typedText.fixedToCamera = true;
            _that.typedText.anchor.set(_that.anchor);
        } else {
            _that.typedText = _that.writerObj;
            _that.typedText.fixedToCamera = true;
        }
        _that.typedText.maxWidth = _that.maxWidth;
        _that.currentLetter = 0;
        var length = _that.typedText.children.length;

        for (var i = 0; i < length; i++) {
            var letter = _that.typedText.getChildAt(i);
            letter.alpha = 0;
        }

        /*if (_that.sound !== null) { // Made some alterations for sound markers here. ~Tilde
            if (_that.soundMarker !== null)
                _that.sound.play(_that.soundMarker, null, .7, false, true);
            else
                _that.sound.play('', null, .7, false, true);
        }*/

        _that.typedText.x = x;
        _that.typedText.y = y;
        if (_that.endFn !== null) {
            countdown(typeWriter, length, _that.endFn);
        } else {
            countdown(typeWriter, length);
        }
    }

    /**
     * [countDown description]
     * @param  {Function} fn    [description]
     * @param  {[type]}   endFn [description]
     * @return {[type]}         [description]
     */
    var _timer;
    
    function countdown(fn, times, endFn) {
        _timer = game.time.create(false);
        _timer.start();
        endFn = endFn || function() {
            game.time.events.remove(_timer);
            textComplete = true;
            if (_that.sound !== null) {
                _that.sound.stop();
            }
        };
        _timer.onComplete.add(endFn);
        _timer.repeat(_that.time, times, fn, this);
        _that.timer = _timer;
    }

    function typeWriter(text) {
        /*if (_that.sound !== null) {
            if (_that.sound.isPlaying === false) {
                _that.sound.play();
            }
        }*/
        var letter = _that.typedText.getChildAt(_that.currentLetter);
        letter.alpha = 1;
        _that.sound.play('char');
        _that.currentLetter++;
    }

    return {
        init: function(gameInstance, options) {
            init(gameInstance, options);
        },
        start: function() {
            stop();
            start();
        },
        destroy: function() {
            _that.typedText.destroy();
        },
        hideText: function() {
            _that.typedText.visible = false;
        },
        showText: function() {
            _that.typedText.visible = true;
        },
        showAll: function () {
            _that.typedText.children.forEach(function (letter) {
                letter.alpha = 1;
            });
            _timer.destroy();
            textComplete = true;
        },
        moveToTop: function() {
            game.bringToTop(_that.typedText);
        },
        currentLetter: _that.currentLetter
    }
}