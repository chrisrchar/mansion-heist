// CREATE LASERS
function createLasers (lasers)
{

    lasers.forEach(function (laserBase)
    {
        laserBase.anchor.x = 0.5;
        laserBase.x += 16;

        laserBase.ray = new Phaser.Line(laserBase.x, laserBase.y, laserBase.x, 2000);
        var intersection = getWallIntersection(laserBase.ray);
        var endSet = false;

        laserBase.update = function ()
        {
            if (intersection && !endSet)
            {
                console.log(intersection.x)
                endSet = true;
                laserBase.ray = laserBase.ray.setTo(laserBase.ray.start.x, laserBase.ray.start.y, laserBase.ray.end.x, intersection.y);

                var laserWidth = 8;

                laserBase.laserRect = game.add.graphics(laserBase.x, laserBase.y);
                laserBase.laserRect.beginFill(0xff0000, .6);
                laserBase.laserRect.drawRect(0 - laserWidth/2, 10, laserWidth, laserBase.ray.height - 10);
                laserBase.laserRect.endFill();

                game.physics.enable(laserBase, Phaser.Physics.ARCADE);
                laserBase.body.setSize(laserWidth, laserBase.ray.height, -1*laserWidth/2 + 16, 0);
                if (laserBase.timer)
                {
                    var laserTimer = game.time.create(false);
                    laserTimer.loop(laserBase.timer, function () {
                        laserBase.body.enable = !laserBase.body.enable;
                        laserBase.laserRect.visible = !laserBase.laserRect.visible;
                    }, this);
                    laserTimer.start(laserBase.delay);
                }
            }
        }
    });
}

// LASER COLLISION WITH WALL
function getWallIntersection (ray) {
    var distanceToWall = Number.POSITIVE_INFINITY;
    var closestIntersection = null;

    // For each of the walls...
    var tiles = platforms.getTiles(ray.x, ray.y, 32, ray.height);
    console.log(tiles);
    
    tiles.forEach(function(tile) {
        if (tile.index != -1)
        {
        // Create an array of lines that represent the four edges of each wall
        var tileTop = new Phaser.Line(tile.x*32, tile.y*32, tile.x*32+32, tile.y*32);

        // Test each of the edges in this wall against the ray.
        // If the ray intersects any of the edges then the wall must be in the way.
        var intersect = ray.intersects(tileTop);
        //console.log(tileTop.y);
        if (intersect) {
            // Find the closest intersection
            distance = this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
            if (distance < distanceToWall) {
                distanceToWall = distance;
                closestIntersection = intersect;
            }
        }
        }
    }, this);

    return closestIntersection;
};