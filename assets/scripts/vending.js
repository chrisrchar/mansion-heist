// Global Shop Variables
var shopOpen = false;
var shopGfx;

// Shop Grid Variables
var productsArray = [];
const shopGridWidth = 4;
const shopGridHeight = 5;

// Shop Grid Sizing (Pixels)
const shopGridSize = 64;
const shopGridSpacing = 16;
var shopGridTotalHeight;

// Indexing and Selection
var activeProd;
var currentProd;
var updatingProduct;

// SHOP INITIALIZATION (RUN AT GAME START)
function initShop ()
{
    productsArray = [
        {
            name: 'Chips',
            price: 50,
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

// OPEN SHOP MENU
function openShop () 
{
    // Fade text hovering above the shop
    game.add.tween(shopText).to({alpha: 0},500, Phaser.Easing.Linear.None, true);
    
    // Make sure player can't switch products while the shop is being drawn
    updatingProduct = true;
    drawShop();
}

// CLOSE SHOP MENU
function closeShop ()
{
    // Destroy children of Shop Graphics in reverse order
    shopGfx.children[2].destroy();
    shopGfx.children[1].destroy();
    
    // Destroy Children of the Shop Grid Child
    shopGfx.children[0].children.forEach(function (square, squareIndex) {
        
        // Shrink each square and drawn sprite in the squares
        game.add.tween(square.children[0].scale).to({x: 0, y:0}, 400, Phaser.Easing.Bounce.InOut, true);
        var squareCloseTween = game.add.tween(square.scale).to({x: 0, y: 0},500, Phaser.Easing.Bounce.InOut);
        
        // After the tween is complete, destroy the square
        squareCloseTween.onComplete.add(function () {
            square.destroy();
            
            // Check to see if there are no squares left, then destroy the shop graphics object
            if (!shopGfx.children[0].children)
            {
                shopGfx.destroy();
            }
        });
        squareCloseTween.start();
    });
}

// DRAWING THE SHOP
function drawShop ()
{   
    // Create container for the shop graphics
    shopGfx = game.add.group();
    
    // Create container for the shop grid, position based on grid size, centered on screen
    var shopGrid = game.add.graphics(game.camera.width/2 - (shopGridWidth-1)*(shopGridSize+shopGridSpacing)/2, game.camera.height/2 - shopGridHeight*(shopGridSize+shopGridSpacing)/2);
    
    // Calculate total height of the grid cells for later use with text
    shopGridTotalHeight = Math.ceil(productsArray.length/shopGridWidth) * (shopGridSize+shopGridSpacing);
    
    // Add the grid container as a child to the shop graphics container
    shopGfx.add(shopGrid);
    
    // Loop through each initialized product
    productsArray.forEach(function (product, prodIndex) {
        
        // Find the X and Y of the product in the grid
        var prodX = prodIndex % shopGridWidth;
        var prodY = Math.floor(prodIndex / shopGridWidth);
        
        // Create the drawn object for the cell
        var productSquare = game.add.graphics(0,0);
        
        // Draw the rectangle for the cell
        productSquare.beginFill(0x000000, 1);
        productSquare.drawRect(0,0, shopGridSize, shopGridSize);
        productSquare.endFill();
        
        // Make sprite from graphics object then destroy the original
        var prodSqSprite = game.add.sprite(0, 0, productSquare.generateTexture());
        
        // Destroy the drawing object
        productSquare.destroy();
        
        // Add the square sprite to the grid container
        shopGrid.addChild(prodSqSprite);
        
        // Reposition the square based on the product's index in the product array
        prodSqSprite.x = prodX*(shopGridSize+shopGridSpacing);
        prodSqSprite.y = prodY*(shopGridSize+shopGridSpacing);
        
        // Center the square, shrink to nothing, make translucent for tweening
        prodSqSprite.anchor.x = .5;
        prodSqSprite.anchor.y = .5;
        prodSqSprite.scale.x = 0;
        prodSqSprite.scale.y = 0;
        prodSqSprite.alpha = .6
        
        // Create the product sprite based on the product's key and add it as a child to the square
        var prodSprite = game.add.sprite(0,0,product.key);
        prodSqSprite.addChild(prodSprite);
        
        // Center the product sprite and shrink to nothing for tweening
        prodSprite.anchor.x = 0.5;
        prodSprite.anchor.y = 0.5;
        prodSprite.scale.x = 0;
        prodSprite.scale.y = 0;
        
        // Delay tweens based on index
        var prodSquarePopInTimer = game.time.create(true);
        prodSquarePopInTimer.add(100*prodIndex, function () {
            
            // Tween the product squares
            game.add.tween(prodSqSprite.scale).to({x: 1, y: 1},500, Phaser.Easing.Bounce.InOut, true);
            var lastTween = game.add.tween(prodSqSprite).to({angle: 375}, 800, Phaser.Easing.Bounce.Out);
            
            // Check to see if it's the last tween, then update the active product to the first index
            if (prodIndex == productsArray.length-1)
            {
                lastTween.onComplete.add(function () {
                    
                    // Resetting the active shop object for the shop is opened/reopened
                    activeProd = 0;
                    updatingProduct = false;
                    updateActiveProduct();
                    
                });
                lastTween.start()
            }
            else
            {
                lastTween.start()
            }
            
        }, this);
        prodSquarePopInTimer.start();
        
        // Delay and tween the product sprites
        var prodSpritePopInTimer = game.time.create(true);
        prodSpritePopInTimer.add(100*prodIndex + 50, function () {
            game.add.tween(prodSprite.scale).to({x: 1, y: 1},500, Phaser.Easing.Bounce.InOut, true);
        }, this);
        prodSpritePopInTimer.start();
    });
}

// BUYING PRODUCTS
function buyProduct () 
{
    // Check to see if the player can buy the product
    if (!currentProd.soldout && playerGlobals.money >= currentProd.price)
    {
        // Tween the product to make it responsive and grow
        game.add.tween(shopGfx.children[0].children[activeProd].scale).to({x: 1.8, y: 1.8},150, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
        
        // Subtract money from the player and update the HUD
        playerGlobals.money -= currentProd.price;
        moneyHUD.text = '$: '+playerGlobals.money;
        
        // Call the product's function
        currentProd.action();
        
    }
}

// CHANGE WHICH PRODUCT IS ACTIVE
function updateActiveProduct () 
{

    // Set variable so player cannot have two products active
    updatingProduct = true;
    
    // Change the product object that is currently active
    currentProd = productsArray[activeProd];

    // Draw/set text for the product name and description
    setProductName();
    setProductDescription();

    // Loop through each square for tweening
    shopGfx.children[0].children.forEach(function (square, squareInd) {
        
        // If the square is the active product...
        if (activeProd == squareInd)
        {
            // Tween active product to be larger than the others, angled correctly, and have alpha 1
            game.add.tween(square.scale).to({x: 1.2, y: 1.2},100, Phaser.Easing.Linear.None, true);
            var updatingTween = game.add.tween(square).to({angle: 0}, 100, Phaser.Easing.Linear.None);
            updatingTween.onComplete.add(function () {
                updatingProduct = false;
            });
            updatingTween.start();
            square.alpha = 1;
        }
        
        // If the square is not the active product...
        else if (square.angle != 15)
        {
            // Tween square back to inactive if not active
            game.add.tween(square.scale).to({x: 1, y: 1},100, Phaser.Easing.Linear.None, true);
            game.add.tween(square).to({angle: 15}, 100, Phaser.Easing.Linear.None, true);
            square.alpha = .6;
        }
    });
}

// SETTING PRODUCT NAME TEXT
function setProductName()
{
    // Check to see if there is a text object already
    if (!shopGfx.children[1])
    {
        // If not, create a text object below the grid and center it, then add it to the shop container
        var itemName = game.add.text(game.camera.width/2, shopGfx.children[0].y + shopGridTotalHeight, currentProd.name + " $" + currentProd.price, { font: '32px Cartwheel', fill: '#fff', stroke: 'black', strokeThickness: 8 });
        itemName.anchor.x = .5;
        itemName.anchor.y = .5;
        shopGfx.addChild(itemName);
    }
    else
    {
        // If there is a text object, then update the text inside
        shopGfx.children[1].text = currentProd.name + " $" + currentProd.price;
    }
}

// SETTING PRODUCT DESCRIPTION
function setProductDescription () 
{
    // Check to see if there is a text object already
    if (!shopGfx.children[2])
    {
        // If not, create a text object below the grid and center it, then add it to the shop container
        var itemDesc = game.add.text(game.camera.width/2, shopGfx.children[0].y + shopGridTotalHeight + 64, currentProd.description, { font: '24px Cartwheel', fill: '#fff', stroke: 'black', strokeThickness: 8 });
        itemDesc.anchor.x = .5;
        itemDesc.anchor.y = .5;
        shopGfx.addChild(itemDesc);
    }
    else
    {
        // If there is a text object, then update the text inside
        shopGfx.children[2].text = currentProd.description;
    }
}

// ==========================SHOP MOVE FUNCTIONS==========================

function shopMoveLeft ()
{
    if (!updatingProduct)
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
}

function shopMoveRight ()
{
    if (!updatingProduct)
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
}

function shopMoveUp ()
{
    if (!updatingProduct)
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
}

function shopMoveDown ()
{
    if (!updatingProduct)
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
}