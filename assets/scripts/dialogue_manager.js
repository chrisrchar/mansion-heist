var inMessage = false;
var text = new Typewriter();
var messages;
var currentMsg = 0;
var tweenSpeed = 500;

function callMsg(messageArray) {
    
    showMsgBox(game.world.width/2, 600, 1, tweenSpeed);
    
    inMessage = true;
    currentMsg = 0;
    messages = ['This is a test to see if the communications work properly. Hopefully this will be enough to check and see.',
               'this is a second message that will get passed along hopefully too.',
               'this is a second message that will get passed along hopefully too.'];
    
    text.init(game, {
        x: game.world.width/2-400,
        y: 600-60,
        fontFamily: "pearsoda",
        fontSize: 32,
        maxWidth: 825,
        text: messages[currentMsg],
      });
    
    var openTimer = game.time.create(true);
    openTimer.add(tweenSpeed, function () {
        text.start();
    }, this);
    openTimer.start();
    
}

function handleNextMessage () {
    console.log(textComplete);
    if (textComplete)
    {
        text.destroy();
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
        x: game.world.width/2-400,
        y: 600-60,
        fontFamily: "pearsoda",
        fontSize: 32,
        maxWidth: 825,
        text: messages[currentMsg],
    });
    text.start();
}

function endDialogue ()
{
    closeMsgBox(tweenSpeed);
    inMessage = false;
}