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
            name: 'Chips',
            price: 100,
            description: 'A bag of crisps. Not that good for you.\nHeals 40HP',
            key: 'chips',
            sellsout: false,
            soldout: false,
            action: function () 
            {
                playerGlobals.hp = Math.min(playerGlobals.maxhp, playerGlobals.hp + 40);
                updateHPHUD();
            }
        },
        {
            name: 'hpUpgrade',
            price: 500,
            description: '',
            key: 'chips',
            sellsout: true,
            soldout: false,
            action: function () 
            {
                
            }
        },
        {
            name: 'atkBoost',
            price: 1000,
            description: '',
            key: 'chips',
            sellsout: true,
            soldout: false,
            action: function () 
            {
                
            }
        }
    ];
}

function openShop () 
{
    game.add.tween(shopText).to({alpha: 0},500, Phaser.Easing.Linear.None, true);
    drawShop();
}

function closeShop ()
{
    shopGfx.children[2].destroy();
    shopGfx.children[1 ].destroy();
    shopGfx.children[0].children.forEach(function (square, squareIndex) {
        game.add.tween(square.children[0].scale).to({x: 0, y:0}, 400, Phaser.Easing.Bounce.InOut, true);
        var squareCloseTween = game.add.tween(square.scale).to({x: 0, y: 0},500, Phaser.Easing.Bounce.InOut);
        squareCloseTween.onComplete.add(function () {
            square.destroy();
            if (!shopGfx.children[0].children)
            {
                shopGfx.destroy();
            }
        });
        squareCloseTween.start();
    });
    
    activeProd = 0;
}

function drawShop ()
{   
    shopGfx = game.add.group();
    
    var shopGrid = game.add.graphics(game.camera.width/2 - (shopGridWidth-1)*(shopGridSize+shopGridSpacing)/2, game.camera.height/2 - shopGridHeight*(shopGridSize+shopGridSpacing)/2);
    
    shopGridTotalHeight = Math.ceil(productsArray.length/shopGridWidth) * (shopGridSize+shopGridSpacing);
    
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
        
        var prodSprite = game.add.sprite(0,0,product.key);
        prodSqSprite.addChild(prodSprite);
        
        prodSprite.anchor.x = 0.5;
        prodSprite.anchor.y = 0.5;
        prodSprite.scale.x = 0;
        prodSprite.scale.y = 0;
        
        // Delay tweens based on index
        var prodSquarePopInTimer = game.time.create(true);
        prodSquarePopInTimer.add(100*prodIndex, function () {
            game.add.tween(prodSqSprite.scale).to({x: 1, y: 1},500, Phaser.Easing.Bounce.InOut, true);
            game.add.tween(prodSqSprite).to({angle: 375}, 800, Phaser.Easing.Bounce.Out, true);
            
            if (prodIndex == productsArray.length-1)
            {
                updateActiveProduct();
            }
            
        }, this);
        prodSquarePopInTimer.start();
        
        var prodSpritePopInTimer = game.time.create(true);
        prodSpritePopInTimer.add(100*prodIndex + 50, function () {
            game.add.tween(prodSprite.scale).to({x: 1, y: 1},500, Phaser.Easing.Bounce.InOut, true);
        }, this);
        prodSpritePopInTimer.start();
    });
}

function buyProduct () 
{
    if (!currentProd.soldout && playerGlobals.money >= currentProd.price)
    {
        game.add.tween(shopGfx.children[0].children[activeProd].scale).to({x: 1.4, y: 1.4},200, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
        playerGlobals.money -= currentProd.price;
        moneyHUD.text = '$: '+playerGlobals.money;
        currentProd.action();
    }
}

function updateActiveProduct () 
{
    currentProd = productsArray[activeProd];
    
    if (!shopGfx.children[1])
    {
        var itemName = game.add.text(game.camera.width/2, shopGfx.children[0].y + shopGridTotalHeight, currentProd.name + " $" + currentProd.price, { font: '32px Cartwheel', fill: '#fff', stroke: 'black', strokeThickness: 8 });
        itemName.anchor.x = .5;
        itemName.anchor.y = .5;
        shopGfx.addChild(itemName);
    }
    else
    {
        shopGfx.children[1].text = currentProd.name + " $" + currentProd.price;
    }
    
    if (!shopGfx.children[2])
    {
        var itemDesc = game.add.text(game.camera.width/2, shopGfx.children[0].y + shopGridTotalHeight + 64, currentProd.description, { font: '24px Cartwheel', fill: '#fff', stroke: 'black', strokeThickness: 8 });
        itemDesc.anchor.x = .5;
        itemDesc.anchor.y = .5;
        shopGfx.addChild(itemDesc);
    }
    else
    {
        shopGfx.children[2].text = currentProd.description;
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

function shopMoveUp ()
{
    if (Math.floor(activeProd/shopGridWidth) == 0)
    {
        activeProd = Math.min(activeProd+Math.floor(productsArray.length/shopGridWidth)*shopGridWidth, productsArray.length-1);
    }
    else 
    {
        activeProd -= shopGridWidth;
    }
    
    updateActiveProduct();
}

function shopMoveDown ()
{
    if (Math.floor(activeProd/shopGridWidth) == Math.floor(productsArray.length/shopGridWidth) || !productsArray[activeProd+shopGridWidth])
    {
        activeProd = activeProd % shopGridWidth;
    }
    else 
    {
        activeProd += shopGridWidth;
    }
    
    updateActiveProduct();
}