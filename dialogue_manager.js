/* global
    testButton, messageBox
*/

var inMessage = false;
var toWrite = "";
var currentLn;
var letterCount = 0;
var messages = [];
var writeInt;
var writeSpd = 100;
var nextListener;

function callScene (dialogueObj)
{
    inMessage = true;
    currentLn = -1;
    messages = dialogueObj.messages;
    nextListener = testButton.onDown.add(showNext);
    showNext();
}

function showNext ()
{   
    if (messages[currentLn] != toWrite && letterCount > 1)
    {
        toWrite = messages[currentLn];
        messageBox.text = toWrite;
    }
    else
    {
        currentLn += 1;
        if (messages[currentLn] != null)
        {
            letterCount = 0;
            writeInt = setInterval(writeMessage, writeSpd);
        }
        else
        {
            endScene();
        }
    }
}

function writeMessage()
{
    if (inMessage)
    {
        if (messages[currentLn] == toWrite)
        {
            clearInterval(writeInt);
        }
        else
        {
            letterCount += 1;
            toWrite = messages[currentLn].substring(0, letterCount);
            messageBox.text = toWrite;
        }
    }
}

function endScene ()
{
    inMessage = false;
    messageBox.text = "";
    testButton.onDown.remove(nextListener);
}