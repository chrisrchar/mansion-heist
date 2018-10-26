var inMessage = false;
var text = new Typewriter();
var messages;
var currentMsg = 0;
var tweenSpeed = 500;
var letterSFX, nextMsgSFX;

function callMsg(messageArray) {
    
    showMsgBox(game.camera.width/2, 600, 1, tweenSpeed);
    
    inMessage = true;
    currentMsg = 0;
<<<<<<< HEAD
    //messages = ['This is a test to see if the communications work properly. Hopefully this will be enough to check and see.',
     //          'this is a second message that will get passed along hopefully too.',
      //         'this is a second message that will get passed along hopefully too.'];
    messages = ['You have now entered the mansion of Sir Weaselton, your goal is to steal as much loot and reach the vault without being captured or detected',
                'Throughout the map you will find powerups necessary to reach further stages of the game',
              'Controls: Left and right utilize the arrow keys',
               'The "A" key is the attack button',
               'The spacebar is jump'];
        ////Once you reach double jump: 'you have now collected the double jump power up'
        ////Once you reach invisibility: 'You have just collected the invisibility ability. It will allow you to phase through lasers unharmed. Hold the "S" key to use but beware, you must let it recharge between uses'
        ////Once you reach the bathroom: 'To save please hit the "4" key and if you want to reload from the save point hit the "5" key at any point'
    
=======
    messages = ['This is a test to see if the communications work properly. Hopefully this will be enough to check and see.',
               'This is a second message that will get passed along hopefully too.',
               'This is a second message that will get passed along hopefully too.'];
>>>>>>> ab7ba55675dbf12d8fd29243fc3b5f34fa721dce
    
    text.init(game, {
        x: game.camera.width/2-400,
        y: 600-60,
        fontFamily: "pearsoda",
        fontSize: 40,
        maxWidth: 825,
        sound: letterSFX,
        text: messages[currentMsg],
      });
}

function handleNextMessage () {
    if (textComplete)
    {
        text.hideText();
        text.destroy();
        nextMsgSFX.play();
        if (messages[currentMsg+1])
        {
            showNextMessage();
        }
        else
        {
            endDialogue();
        }
    }
    else
    {
        text.showAll();
    }
}

function showNextMessage ()
{
    currentMsg += 1;
    text.init(game, {
        x: game.camera.width/2-400,
        y: 600-60,
        fontFamily: "pearsoda",
        fontSize: 40,
        maxWidth: 825,
        sound: letterSFX,
        text: messages[currentMsg],
    });
    text.start();
}

function endDialogue ()
{
    inMessage = false;
    closeMsgBox(tweenSpeed);
}