var inMessage = false;
var text = new Typewriter();
var messages;
var currentMsg = 0;
var tweenSpeed = 500;
var letterSFX, nextMsgSFX;

function callMsg(messageArray) {
    
    inMessage = true;
    
    showMsgBox(game.camera.x + game.camera.width/2, game.camera.y + 600, 1, tweenSpeed);
    
    currentMsg = 0;

    messages = messageArray;
    
    text.init(game, {
        x: textPlacement[messages[currentMsg].placement].x,
        y: textPlacement[messages[currentMsg].placement].y,
        fontFamily: messages[currentMsg].font,
        fontSize: messages[currentMsg].size,
        maxWidth: 825,
        sound: letterSFX,
        text: messages[currentMsg].text,
        anchor: textPlacement[messages[currentMsg].placement].anchor
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
        x: textPlacement[messages[currentMsg].placement].x,
        y: textPlacement[messages[currentMsg].placement].y,
        fontFamily: messages[currentMsg].font,
        fontSize: messages[currentMsg].size,
        maxWidth: 825,
        sound: letterSFX,
        text: messages[currentMsg].text,
        anchor: textPlacement[messages[currentMsg].placement].anchor
    });
    text.start();
}

function endDialogue ()
{
    inMessage = false;
    closeMsgBox(tweenSpeed);
}