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

    messages = messageArray;
        ////Once you reach double jump: 'you have now collected the double jump power up'
        ////Once you reach invisibility: 'You have just collected the invisibility ability. It will allow you to phase through lasers unharmed. Hold the "S" key to use but beware, you must let it recharge between uses'
        ////Once you reach the bathroom: 'To save please hit the "4" key and if you want to reload from the save point hit the "5" key at any point'
    
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