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
    messages = ['This is a test to see if the communications work properly. Hopefully this will be enough to check and see.',
               'This is a second message that will get passed along hopefully too.',
               'This is a second message that will get passed along hopefully too.'];
    
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