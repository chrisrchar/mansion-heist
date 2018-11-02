// Checks all exits of a given map to see if the player is leaving one
function checkExits (exit)
{
    switch(exit.side) {
        case "right":
            if (player.body.x > exit.bound1.x && player.body.y > exit.bound1.y && player.body.y < exit.bound2.y)
            {
                goToMap(exit.toMap);
            }
            break;
        case "left":
            if (player.body.x < exit.bound1.x && player.body.y > exit.bound1.y && player.body.y < exit.bound2.y)
            {
                goToMap(exit.toMap);
            }
            break;
        case "up":
            if (player.body.y < exit.bound1.y && player.body.x > exit.bound1.x && player.body.x < exit.bound2.x)
            {
                player.body.velocity.y -= 100;
                goToMap(exit.toMap);
            }
            break;
        case "down":
            if (player.body.y > exit.bound1.y && player.body.x > exit.bound1.x && player.body.x < exit.bound2.x)
            {
                goToMap(exit.toMap);
            }
            break;
    }
}

// Transition to a given map with given parameters
function goToMap (mapName)
{
    playerGlobals.yVel = player.body.velocity.y;
    playerGlobals.lastMap = game.state.current;
    playerGlobals.xVel = player.body.velocity.x;
    playerGlobals.xDir = rightButton.isDown - leftButton.isDown;
    transitionFade.onComplete.add(function () {
            game.state.start(mapName);
    });
    transitionFade.start();
}