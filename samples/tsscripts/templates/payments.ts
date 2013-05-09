var x = 1;
/*{# Copyright (c) 2012 Turbulenz Limited #}*/

/*
* @title: Payments
* @description:
* An example of how to manage the store basket and purchase or consume in-game items.
*/

/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/storemanager.js") }}*/
/*{{ javascript("jslib/services/sessiontoken.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/draw2d.js") }}*/
/*{{ javascript("jslib/fontmanager.js") }}*/

/*{{ javascript("scripts/htmlcontrols.js") }}*/
/*{{ javascript("scripts/simplebuttons.js") }}*/

/*global TurbulenzEngine: true */
/*global TurbulenzServices: false */
/*global RequestHandler: false */
/*global Draw2D: false */
/*global FontManager: false */
/*global ShaderManager: false */
/*global Utilities: true */
/*global HTMLControls: false */
/*global ButtonManager: true */
/*global debug: false */

/// <reference path="../simplebuttons.ts" />

TurbulenzEngine.onload = function onloadFn()
{
    //==========================================================================
    // Turbulenz Initialization
    //==========================================================================
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
    var mathDevice = TurbulenzEngine.createMathDevice({});
    var inputDevice = TurbulenzEngine.createInputDevice({});

    var requestHandler = RequestHandler.create({});

    var fontManager = FontManager.create(graphicsDevice, requestHandler);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler);

    var font, shader;
    var storeManager;
    var gameSession;

    function mappingTableReceived(mappingTable)
    {
        var urlMapping = mappingTable.urlMapping;
        var assetPrefix = mappingTable.assetPrefix;

        fontManager.setPathRemapping(urlMapping, assetPrefix);
        fontManager.load('fonts/hero.fnt', function (fontObject)
            {
                font = fontObject;
            });

        shaderManager.setPathRemapping(urlMapping, assetPrefix);
        shaderManager.load('shaders/font.cgfx', function (shaderObject)
            {
                shader = shaderObject;
            });
    }

    function sessionCreated()
    {
        debug.log("payments: session created");
        TurbulenzServices.createMappingTable(
            requestHandler,
            gameSession,
            mappingTableReceived
        );

        storeManager = TurbulenzServices.createStoreManager(
            requestHandler,
            gameSession
        );
    }

    gameSession = TurbulenzServices.createGameSession(requestHandler, sessionCreated);

    var draw2D = Draw2D.create({
        graphicsDevice : graphicsDevice
    });

    draw2D.configure({
        viewportRectangle : [0, 0, 20, 10],
        scaleMode : 'scale'
    });

    var status = [];
    function setStatus(msg)
    {
        status.push(msg);
    }

    function clearStatus()
    {
        TurbulenzEngine.setTimeout(function () {
                status.shift();
            }, 500);
    }

    var clearColor = [0.3, 0.3, 0.3, 1.0];

    var fontTechnique, fontTechniqueParameters;
    var titleScale = 1.2;
    var normalScale = 0.75;

    var gameTriggeredPurchase = false;
    var invalidateButtons = false;

    var purchase = function purchaseFn()
    {
        if (storeManager.showConfirmPurchase())
        {
            gameTriggeredPurchase = true;
            setStatus('Waiting for purchase confirmation');
            var purchaseButton = document.getElementById('button-purchase');
            if (purchaseButton)
            {
                purchaseButton.disabled = true;
            }
        }
        else
        {
            debug.log("call to showConfirmPurchase failed");
        }
    };

    var consume = function consume()
    {
        setStatus('Consuming');
        invalidateButtons = true;
        storeManager.consume('grenade', 1, clearStatus);
    };

    var reset = function resetFn()
    {
        setStatus('Resetting user items');
        // for testing only (this is not available on the Gamesite)
        Utilities.ajax({
            url: '/api/v1/store/user/items/remove-all/' + gameSession.gameSlug,
            method: 'POST',
            async: true,
            callback: function ()
            {
                storeManager.requestUserItems(clearStatus);
            },
            requestHandler: requestHandler
        });

        storeManager.emptyBasket();
    };

    var userProfile = TurbulenzServices.createUserProfile(requestHandler);
    var upgrade = function upgradeFn()
    {
        debug.log("Upgrade button pressed ...");

        var onUpgrade = function onUpgradeFn()
        {
            debug.log("User returned from upgrade screen, regetting profile");
            userProfile = TurbulenzServices.createUserProfile(requestHandler);
        }
        TurbulenzServices.upgradeAnonymousUser(onUpgrade);
    };

    var setButtons = false;
    var oldWidth = 0;
    var oldHeight = 0;
    SimpleButtonManager.init(inputDevice);

    function mainLoop()
    {
        if (!graphicsDevice.beginFrame())
        {
            return;
        }

        setButtons = invalidateButtons || (oldWidth !== graphicsDevice.width ||
                      oldHeight !== graphicsDevice.height);
        invalidateButtons = false;
        oldWidth = graphicsDevice.width;
        oldHeight = graphicsDevice.height;

        graphicsDevice.clear(clearColor);

        // Draw fonts.
        graphicsDevice.setTechnique(fontTechnique);
        fontTechniqueParameters.clipSpace = mathDevice.v4Build(2 / graphicsDevice.width, -2 / graphicsDevice.height, -1, 1,
                                                               fontTechniqueParameters.clipSpace);
        graphicsDevice.setTechniqueParameters(fontTechniqueParameters);

        var xPaddingLeft = 1;
        var xOffset = xPaddingLeft;
        var yPaddingTop = 0;
        var yOffset = yPaddingTop;

        function newColumn()
        {
            xOffset += 10;
            yOffset = yPaddingTop;
        }

        function writeFont(text, scale, clickCallback?, buttonName?)
        {
            if (text)
            {
                var topLeft = draw2D.viewportUnmap(xOffset, yOffset);
                font.drawTextRect(text, {
                    rect : [topLeft[0], topLeft[1], 0, 0], // for left-align width and height are ignored
                    scale : scale,
                    spacing : 0,
                    alignment : 0
                });

                if (setButtons && clickCallback)
                {
                    var textBlockSize = font.calculateTextDimensions(text, scale, 0);
                    debug.log("NEW BUTTON: " + buttonName);
                    SimpleButtonManager.addButton(
                        topLeft[0], topLeft[1],
                        topLeft[0] + textBlockSize.width, topLeft[1] + textBlockSize.height,
                        function () {
                            debug.log("BUTTON: " + buttonName);
                            clickCallback();
                        });
                }
            }

            yOffset += scale;
        }

        if (setButtons)
        {
            SimpleButtonManager.clearButtons();
        }

        if (status.length > 0)
        {
            writeFont('Status: ' + status[0], normalScale);
        }
        else
        {
            writeFont('Status:', normalScale);
        }

        yPaddingTop = 1;
        yOffset = yPaddingTop;

        var makeRemoveFromBasket = function makeAddToBasketFn(key)
        {
            return function () {
                if (storeManager.removeFromBasket(key, 1))
                {
                    setStatus('Updating basket');
                    storeManager.updateBasket(function basketUpdatedFn()
                        {
                            clearStatus();
                        });
                }
            };
        };

        var makeAddToBasket = function makeAddToBasketFn(key)
        {
            return function () {
                if (storeManager.addToBasket(key, 1))
                {
                    setStatus('Updating basket');
                    storeManager.updateBasket(function basketUpdatedFn()
                        {
                            clearStatus();
                            invalidateButtons = true;
                        });
                }
            };
        };

        var makeConsume = function makeAddToBasketFn(key)
        {
            return function () {
                setStatus('Consuming');
                storeManager.consume(key, 1, function consumedFn()
                        {
                            clearStatus();
                            invalidateButtons = true;
                        });
            };
        };

        var offering;
        var offerings = storeManager.getOfferings();
        var key;

        writeFont("Offerings", titleScale);
        for (key in offerings)
        {
            if (offerings.hasOwnProperty(key) && offerings[key].available)
            {
                offering = offerings[key];
                writeFont(offering.title, normalScale, makeAddToBasket(key), 'add ' + key);
            }
        }

        newColumn();
        var basketItems = storeManager.basket.items;
        writeFont("Basket amount", titleScale);
        for (key in offerings)
        {
            if (offerings.hasOwnProperty(key) && offerings[key].available)
            {
                if (basketItems.hasOwnProperty(key))
                {
                    writeFont(basketItems[key].amount.toString(10), normalScale, makeRemoveFromBasket(key), 'remove ' + key);
                }
                else
                {
                    writeFont('0', normalScale);
                }
            }
        }

        writeFont('Purchase', normalScale, purchase, 'purchase');
        writeFont('Reset', normalScale, reset, 'reset');

        if (userProfile && userProfile.anonymous)
        {
            writeFont('Upgrade User', normalScale, upgrade, 'upgrade');
        }

        yPaddingTop = 7;
        yOffset = yPaddingTop;
        xOffset = xPaddingLeft;

        var userItems = storeManager.getUserItems();
        var resources = storeManager.getResources();

        writeFont("User items", titleScale);
        for (key in userItems)
        {
            if (userItems.hasOwnProperty(key))
            {
                writeFont(resources[key].title, normalScale, makeConsume(key), 'consume ' + key);
            }
        }

        newColumn();
        writeFont("Amount", titleScale);
        for (key in userItems)
        {
            if (userItems.hasOwnProperty(key))
            {
                writeFont(userItems[key].amount.toString(10), normalScale, makeConsume(key), 'consume ' + key);
            }
        }

        graphicsDevice.endFrame();

    }

    var intervalID = 0;
    function loadingLoop()
    {
        if (font && shader && storeManager && storeManager.ready)
        {
            fontTechnique = shader.getTechnique('font');
            fontTechniqueParameters = graphicsDevice.createTechniqueParameters({
                clipSpace : mathDevice.v4BuildZero(),
                alphaRef : 0.01,
                color : mathDevice.v4BuildOne()
            });

            var onSitePurchaseDialogCompleted = function onSitePurchaseDialogCompletedFn()
            {
                // we need to check that the game triggered this purchase (rather than the site)
                if (gameTriggeredPurchase)
                {
                    clearStatus();

                    var purchaseButton =
                        document.getElementById('button-purchase');
                    if (purchaseButton)
                    {
                        purchaseButton.disabled = false;
                    }
                    gameTriggeredPurchase = false;
                    invalidateButtons = true;
                }
            };

            storeManager.onSitePurchaseConfirmed = onSitePurchaseDialogCompleted;
            storeManager.onSitePurchaseRejected = onSitePurchaseDialogCompleted;

            TurbulenzEngine.clearInterval(intervalID);
            TurbulenzEngine.setInterval(mainLoop, 1000 / 60);
        }
    }
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 100);

    // Controls
    var htmlControls = HTMLControls.create();

    function addStoreItemBasketControls(itemKey)
    {
        htmlControls.addButtonControl({
            id: "button-decrease-" + itemKey,
            value: "-",
            fn: function ()
            {
                if (storeManager.removeFromBasket(itemKey, 1))
                {
                    setStatus('Updating basket');
                    storeManager.updateBasket(clearStatus);
                }
            }
        });

        htmlControls.addButtonControl({
            id: "button-increase-" + itemKey,
            value: "+",
            fn: function ()
            {
                if (storeManager.addToBasket(itemKey, 1))
                {
                    setStatus('Updating basket');
                    storeManager.updateBasket(clearStatus);
                }
            }
        });
    }

    htmlControls.addButtonControl({
        id: "button-consume-grenade",
        value: "Use grenade",
        fn: consume
    });

    addStoreItemBasketControls('rocket-launcher');
    addStoreItemBasketControls('grenade');
    addStoreItemBasketControls('grenade-pack');
    addStoreItemBasketControls('explosives-pack');

    htmlControls.addButtonControl({
        id: "button-purchase",
        value: "Purchase",
        fn: purchase
    });

    htmlControls.addButtonControl({
        id: "button-reset",
        value: "Reset",
        fn: reset
    });

    htmlControls.register();

    // Create a scene destroy callback to run when the window is closed
    TurbulenzEngine.onunload = function destroyScene()
    {
        if (intervalID)
        {
            TurbulenzEngine.clearInterval(intervalID);
        }

        if (gameSession)
        {
            gameSession.destroy();
            gameSession = null;
        }
    };
};
