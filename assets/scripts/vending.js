var shopOpen = false;
var shopGfx;

var productsArray = [];
var shopGridWidth = 4;
var shopGridHeight = 5;

var shopGridSize = 64;
var shopGridSpacing = 16;

var activeProd = 0;
var currentProd;

var shopGridTotalHeight;

function initShop ()
{
    productsArray = [
        {
            name: 'hpRestore',
            price: 100,
            description: '',
            key: '',
            sellsout: false,
            bought: false
        },
        {
            name: 'hpUpgrade',
            price: 500,
            description: '',
            key: '',
            sellsout: true,
            bought: false
        },
        {
            name: 'atkBoost',
            price: 1000,
            description: '',
            key: '',
            sellsout: true,
            bought: false
        }
    ];
}

function openShop () 
{
    game.add.tween(shopText).to({alpha: 0},500, Phaser.Easing.Linear.None, true);
    drawShop();
    
    var shopOpenDelay = game.time.create(true);
    shopOpenDelay.add(1000, function () {
        updateActiveProduct();
    }, this);
    shopOpenDelay.start();
}

function drawShop ()
{   
    shopGfx = game.add.group();
    
    var shopGrid = game.add.graphics(game.camera.width/2 - shopGridWidth*(shopGridSize+shopGridSpacing)/2, game.camera.height/2 - shopGridHeight*(shopGridSize+shopGridSpacing)/2);
    
    shopGridTotalHeight = Math.ceil(productsArray.length/shopGridHeight) * (shopGridSize+shopGridSpacing);
    
    shopGfx.add(shopGrid);
    
    productsArray.forEach(function (product, prodIndex) {
        
        var prodX = prodIndex % shopGridWidth;
        var prodY = Math.floor(prodIndex / shopGridWidth);
        
        var productSquare = game.add.graphics(0,0);
        
        productSquare.beginFill(0x000000, 1);
        productSquare.drawRect(0,0, shopGridSize, shopGridSize);
        productSquare.endFill();
        
        // Make sprite from graphics object then destroy the original
        
        var prodSqSprite = game.add.sprite(0, 0, productSquare.generateTexture());
        
        productSquare.destroy();
        
        shopGrid.addChild(prodSqSprite);
        
        prodSqSprite.x = prodX*(shopGridSize+shopGridSpacing);
        prodSqSprite.y = prodY*(shopGridSize+shopGridSpacing);
        
        // Center the square and shrink to nothing
        prodSqSprite.anchor.x = .5;
        prodSqSprite.anchor.y = .5;
        prodSqSprite.scale.x = 0;
        prodSqSprite.scale.y = 0;
        prodSqSprite.alpha = .6
        
        // Delay tweens based on index
        var prodSquarePopInTimer = game.time.create(true);
        prodSquarePopInTimer.add(200*prodIndex, function () {
            game.add.tween(prodSqSprite.scale).to({x: 1, y: 1},500, Phaser.Easing.Bounce.InOut, true);
            game.add.tween(prodSqSprite).to({angle: 375}, 800, Phaser.Easing.Bounce.Out, true);
        }, this);
        prodSquarePopInTimer.start();
    });
}

function updateActiveProduct () 
{
    currentProd = productsArray[activeProd];
    
    if (!shopGfx.children[1])
    {
        var itemName = game.add.text(game.camera.width/2, shopGfx.children[0].y + shopGridTotalHeight, currentProd.name, { font: '32px Cartwheel', fill: '#fff', stroke: 'black', strokeThickness: 4 });
        itemName.anchor.x = .5;
        itemName.anchor.y = .5;
        shopGfx.addChild(itemName);
    }
    else
    {
        shopGfx.children[1].text = currentProd.name;
    }
    
    shopGfx.children[0].children.forEach(function (square, squareInd) {
        if (activeProd == squareInd)
        {
            console.log(activeProd);
            game.add.tween(square.scale).to({x: 1.2, y: 1.2},200, Phaser.Easing.Linear.None, true);
            game.add.tween(square).to({angle: 0}, 200, Phaser.Easing.Linear.None, true);
            square.alpha = 1;
        }
        else if (square.angle != 15)
        {
            game.add.tween(square.scale).to({x: 1, y: 1},200, Phaser.Easing.Linear.None, true);
            game.add.tween(square).to({angle: 15}, 200, Phaser.Easing.Linear.None, true);
            square.alpha = .6;
        }
    });
}

function shopMoveLeft ()
{
    console.log('moving left');
    if (activeProd % shopGridWidth == 0)
    {
        activeProd = Math.min(activeProd+shopGridWidth-1, productsArray.length-1);
    }
    else 
    {
        activeProd -= 1;
    }
    
    updateActiveProduct();
}

function shopMoveRight ()
{
    console.log('moving right');
    if (activeProd % shopGridWidth == shopGridWidth-1 || activeProd == productsArray.length - 1)
    {
        activeProd = Math.floor(activeProd/shopGridWidth)*shopGridWidth;
    }
    else 
    {
        activeProd += 1;
    }
    
    updateActiveProduct();
}