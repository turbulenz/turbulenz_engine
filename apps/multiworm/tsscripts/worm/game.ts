// Copyright (c) 2011-2012 Turbulenz Limited

/*global TurbulenzEngine: false*/
/*global Worm: false*/

interface GameSettings
{
    width        : number;
    height       : number;
    boardSpacing : number;
    maxPlayers   : number;
};

interface Food
{
    x: number;
    y: number;
    updated: boolean;
    eatenBy: number;
};

interface GameState
{
    PLAY  : number;
    DEAD  : number;
    ERROR : number;
};

//
// Game: Contains game logic for worm game
//
class Game
{
    // Enums for states
    state            : GameState;

    currentState     : number;
    gameSession      : GameSession;

    hasChangedScore  : boolean;
    score            : number;
    kills            : number;

    myWormIndex      : number;

    gameStates       : { (isHost : boolean, moveWorms: boolean): void; }[];

    graphicsDevice   : GraphicsDevice;
    scoreIncrement   : number;

    gameSettings     : GameSettings;
    leaderboards     : GameLeaderboards;
    badges           : GameBadges;

    keyCodes         : any;
    mouseCodes       : any;

    foods            : Food[];
    worms            : Worm[];

    newWormDirection : number;
    startTime        : number;

    join_error       : string;
    join_error_cb    : { (): void; };

    // Update game
    update(isHost, moveWorms)
    {
        (this.gameStates[this.currentState]).call(this, isHost, moveWorms);
    }

    // Check collisions between worms and foods
    checkCollisions()
    {
        var maxPlayers = this.gameSettings.maxPlayers;
        var myWormIndex = this.myWormIndex;
        var worms = this.worms;
        var i, j, worm;

        // Reset dead worms
        for (i = 0; i < maxPlayers; i += 1)
        {
            worm = worms[i];

            if (worm.killedBy !== null)
            {
                worm.killedBy = null;

                this.placeWorm(i);
            }
        }

        // Check worm collisions
        for (i = 0; i < maxPlayers; i += 1)
        {
            worm = worms[i];

            if (worm.isIntersectingSelf())
            {
                worm.die(i);

                if (i === myWormIndex)
                {
                    this.died(i);
                }
            }
            else
            {
                for (j = 0; j < maxPlayers; j += 1)
                {
                    if (i !== j)
                    {
                        if (worm.isIntersecting(worms[j]))
                        {
                            worm.die(j);

                            if (i === myWormIndex)
                            {
                                this.died(j);
                            }
                            else if (j === myWormIndex)
                            {
                                this.kill();
                            }

                            break;
                        }
                    }
                }
            }
        }

        // Check foods
        var foods = this.foods;
        for (i = 0; i < maxPlayers; i += 1)
        {
            var food = foods[i];
            var foodX = food.x;
            var foodY = food.y;

            food.eatenBy = null;

            for (j = 0; j < maxPlayers; j += 1)
            {
                worm = worms[j];
                if (worm.containsPosition(foodX, foodY))
                {
                    food.eatenBy = j;

                    if (j === myWormIndex)
                    {
                        worm.addToTail();
                        this.scored();
                    }

                    this.placeFood(i);

                    break;
                }
            }
        }
    }

    // Update loop whilst playing
    play(isHost, moveWorms)
    {
        var myWormIndex = this.myWormIndex;
        if (myWormIndex < 0)
        {
            return;
        }

        this.badges.addBadge("played");

        if (moveWorms)
        {
            var worm = this.worms[myWormIndex];

            var newWormDirection = this.newWormDirection
            if (newWormDirection !== null)
            {
                worm.changeDirection(newWormDirection);
                this.newWormDirection = null;
            }

            worm.update();
            if (worm.hasLooped)
            {
                this.badges.addBadge("driven_over_the_edge");
            }
        }

        if (isHost)
        {
            this.checkCollisions();
        }
    }

    // Update loop whilst dead
    dead(isHost /*, moveWorms */)
    {
        if (isHost)
        {
            this.checkCollisions();
        }
    }

    // My worm eat food
    scored()
    {
        this.score += this.scoreIncrement;
        this.gameSession.setStatus('Playing score ' + this.score);
        this.hasChangedScore = true;
        this.badges.addBadge("abstract_cube_devourer");
        this.worms[this.myWormIndex].playerInfo.score = this.score;
    }

    // Someone collided against me
    kill()
    {
        this.kills += 1;
        this.hasChangedScore = true;
        this.badges.addBadge("abstract_killer");
    }

    // My worm died
    died(killedBy)
    {
        this.currentState = this.state.DEAD;
        this.gameSession.setStatus('Died with score ' + this.score);
        var badges = this.badges;
        var leaderboards = this.leaderboards;

        badges.addBadge("addicted");

        if (this.myWormIndex === killedBy)
        {
            badges.addBadge("suicidal_worm");
        }

        leaderboards.setScore("best-score", this.score);
        leaderboards.setScore("most-kills", this.kills);
    }

    // Randomly places food into a free space
    placeFood(foodIndex)
    {
        var gameSettings = this.gameSettings;
        var xScaler = gameSettings.width;
        var yScaler = gameSettings.height;
        var maxPlayers = gameSettings.maxPlayers;

        var worms = this.worms;
        var foods = this.foods;

        var floor = Math.floor;
        var random = Math.random;
        var randomX;
        var randomY;
        var n, food;
        do
        {
            randomX = floor(random() * xScaler);
            randomY = floor(random() * yScaler);

            for (n = 0; n < maxPlayers; n += 1)
            {
                // Check worms
                if (worms[n].containsPosition(randomX, randomY))
                {
                    break;
                }

                // Check other foods
                if (n !== foodIndex)
                {
                    food = foods[n];
                    if (food.x === randomX && food.y === randomY)
                    {
                        break;
                    }
                }
            }
        }
        while (n < maxPlayers);

        food = foods[foodIndex];
        food.x = randomX;
        food.y = randomY;
        food.updated = true;
    }

    // Randomly places worm into a free space
    placeWorm(wormIndex)
    {
        var gameSettings = this.gameSettings;
        var xScaler = gameSettings.width;
        var yScaler = gameSettings.height;
        var maxPlayers = gameSettings.maxPlayers;

        var worms = this.worms;
        var foods = this.foods;

        var floor = Math.floor;
        var random = Math.random;
        var randomX;
        var randomY;
        var n, food;
        do
        {
            randomX = floor(random() * xScaler);
            randomY = floor(random() * yScaler);

            for (n = 0; n < maxPlayers; n += 1)
            {
                // Check other worms
                if (n !== wormIndex)
                {
                    if (worms[n].containsPosition(randomX, randomY))
                    {
                        break;
                    }
                }

                // Check foods
                food = foods[n];
                if (food.x === randomX && food.y === randomY)
                {
                    break;
                }
            }
        }
        while (n < maxPlayers);

        worms[wormIndex].reset(randomX, randomY);
    }

    // serialize the whole game
    serialize(data)
    {
        var gameSettings = this.gameSettings;
        var maxPlayers = gameSettings.maxPlayers;

        var worms = this.worms;
        var foods = this.foods;

        var wormsState = [];
        var foodsState = [];

        var n;
        for (n = 0; n < maxPlayers; n += 1)
        {
            wormsState[n] = worms[n].serialize();

            var food = foods[n];

            foodsState[n] = {
                x: food.x,
                y: food.y
            };

            var eatenBy = food.eatenBy;
            if (eatenBy !== null)
            {
                foodsState[n].eatenBy = eatenBy;
            }
        }

        data.worms = wormsState;
        data.foods = foodsState;
    }

    // serialize delta information
    serializeDelta(isHost, delta)
    {
        var gameSettings = this.gameSettings;
        var maxPlayers = gameSettings.maxPlayers;

        var updated = false;

        var myWormIndex = this.myWormIndex;
        var worms = this.worms;
        var wormsState = [];
        var worm;

        if (isHost)
        {
            var foods = this.foods;
            var foodsState = [];

            var n;
            for (n = 0; n < maxPlayers; n += 1)
            {
                worm = worms[n];
                if (worm.updated)
                {
                    worm.updated = false;
                    wormsState[n] = worm.serialize();
                }

                var food = foods[n];
                if (food.updated)
                {
                    food.updated = false;

                    foodsState[n] = {
                        x: food.x,
                        y: food.y
                    };

                    var eatenBy = food.eatenBy;
                    if (eatenBy !== null)
                    {
                        foodsState[n].eatenBy = eatenBy;
                    }
                }
            }

            if (0 < foodsState.length)
            {
                delta.foods = foodsState;
                updated = true;
            }
        }
        else
        {
            worm = worms[myWormIndex];
            if (worm && worm.updated)
            {
                worm.updated = false;
                wormsState[myWormIndex] = worm.serialize();
            }
        }

        if (0 < wormsState.length)
        {
            delta.worms = wormsState;
            updated = true;
        }

        return updated;
    }

    // Deserialize game
    deserialize(isHost, data)
    {
        var myWormIndex = this.myWormIndex;
        var worms = this.worms;
        var foods = this.foods;

        var updated = false;
        var numStates, n;

        var wormsState = data.worms;
        if (wormsState !== undefined)
        {
            numStates = wormsState.length;
            for (n = 0; n < numStates; n += 1)
            {
                var wormState = wormsState[n];
                if (wormState)
                {
                    updated = true;

                    var worm = worms[n];

                    worm.deserialize(isHost, wormState);

                    if (!isHost)
                    {
                        var killedBy = worm.killedBy;
                        if (killedBy !== null)
                        {
                            worm.killedBy = null;

                            if (n === myWormIndex)
                            {
                                this.died(killedBy);
                            }
                            else if (killedBy === myWormIndex)
                            {
                                this.kill();
                            }
                        }
                    }
                }
            }
        }

        if (!isHost)
        {
            var foodsState = data.foods;
            if (foodsState !== undefined)
            {
                numStates = foodsState.length;
                for (n = 0; n < numStates; n += 1)
                {
                    var foodState = foodsState[n];
                    if (foodState)
                    {
                        updated = true;

                        var x = foodState.x;
                        var y = foodState.y;

                        var food = foods[n];

                        food.x = x;
                        food.y = y;

                        if (foodState.eatenBy === myWormIndex)
                        {
                            worms[myWormIndex].addToTail();
                            this.scored();
                        }
                    }
                }
            }
        }

        return updated;
    }

    // Returns the requested food
    getFood(foodIndex)
    {
        return this.foods[foodIndex];
    }

    // Returns the requested worm
    getWorm(wormIndex)
    {
        return this.worms[wormIndex];
    }

    // Resets the worm, and food
    reset()
    {
        this.currentState = this.state.PLAY;
        this.gameSession.setStatus('Playing');
        this.score = 0;
        this.kills = 0;
        this.hasChangedScore = true;
        this.startTime = TurbulenzEngine.time;
    }

    // Start the game
    start()
    {
        var maxPlayers = this.gameSettings.maxPlayers;
        var n;

        this.myWormIndex = 0;

        for (n = 0; n < maxPlayers; n += 1)
        {
            this.placeWorm(n);
        }

        for (n = 0; n < maxPlayers; n += 1)
        {
            this.placeFood(n);
        }
    }

    // Handles input
    onKeyDown(keynum)
    {
        var myWormIndex = this.myWormIndex;

        // Handle hitting space while displaying a join error
        if (this.currentState === this.state.ERROR && keynum === this.keyCodes.SPACE)
        {
            delete this.join_error;
            this.join_error_cb();
            return;
        }

        if (myWormIndex < 0)
        {
            return;
        }

        var worm = this.worms[myWormIndex];
        var direction = worm.direction;

        var keyCodes = this.keyCodes;

        switch (keynum)
        {
        case keyCodes.A:
        case keyCodes.LEFT:
        case keyCodes.NUMPAD_4:
            this.newWormDirection = direction.LEFT;
            break;

        case keyCodes.D:
        case keyCodes.RIGHT:
        case keyCodes.NUMPAD_6:
            this.newWormDirection = direction.RIGHT;
            break;

        case keyCodes.W:
        case keyCodes.UP:
        case keyCodes.NUMPAD_8:
            this.newWormDirection = direction.UP;
            break;

        case keyCodes.S:
        case keyCodes.DOWN:
        case keyCodes.NUMPAD_2:
            this.newWormDirection = direction.DOWN;
            break;
        case keyCodes.T:
            worm.playerInfo.team = "Snakes";
            break;
        case keyCodes.Y:
            worm.playerInfo.team = "Worms";
            break;
        case keyCodes.G:
            worm.playerInfo.color = "green";
            break;
        case keyCodes.H:
            worm.playerInfo.color = "yellow";
            break;

        case keyCodes.SPACE:
            if (this.currentState === this.state.DEAD)
            {
                this.reset();
            }
            break;

        case keyCodes.RETURN:
            this.graphicsDevice.fullscreen = !this.graphicsDevice.fullscreen;
            break;
        }
    }

    // Handles mouse input
    onMouseDown(button)
    {
        var myWormIndex = this.myWormIndex;
        if (myWormIndex < 0)
        {
            return;
        }

        var worm = this.worms[myWormIndex];
        var directionVector = worm.directionVector;
        var direction = worm.direction;

        var mouseCodes = this.mouseCodes;

        // If left mouse button
        if (mouseCodes.BUTTON_0 === button)
        {
            switch (directionVector)
            {
            case worm.upVector:
                this.newWormDirection = direction.LEFT;
                break;
            case worm.downVector:
                this.newWormDirection = direction.RIGHT;
                break;
            case worm.leftVector:
                this.newWormDirection = direction.DOWN;
                break;
            case worm.rightVector:
                this.newWormDirection = direction.UP;
                break;
            case worm.zeroVector:
                this.newWormDirection = direction.LEFT;
                break;
            }
        }
        // If right mouse button
        else if (mouseCodes.BUTTON_1 === button)
        {
            switch (directionVector)
            {
            case worm.upVector:
                this.newWormDirection = direction.RIGHT;
                break;
            case worm.downVector:
                this.newWormDirection = direction.LEFT;
                break;
            case worm.leftVector:
                this.newWormDirection = direction.UP;
                break;
            case worm.rightVector:
                this.newWormDirection = direction.DOWN;
                break;
            case worm.zeroVector:
                this.newWormDirection = direction.RIGHT;
                break;
            }
        }
    }

    static create(gameSettings, graphicsDevice,
                  gameSession, leaderboards, badges,
                  keyCodes, mouseCodes): Game
    {
        var game = new Game();

        var state = game.state;

        game.currentState = state.PLAY;
        game.gameSession = gameSession;
        game.gameSession.setStatus('Playing');

        game.hasChangedScore = true;
        game.score = 0;
        game.kills = 0;

        game.myWormIndex = -1;

        game.gameStates = [];
        game.gameStates[state.PLAY] = game.play;
        game.gameStates[state.DEAD] = game.dead;
        game.gameStates[state.ERROR] = game.dead;

        game.graphicsDevice = graphicsDevice;
        game.scoreIncrement = 17;

        game.gameSettings = gameSettings;

        // Set default game settings if no value provided
        if (!gameSettings.width)
        {
            gameSettings.width = 10;
        }
        if (!gameSettings.height)
        {
            gameSettings.height = 10;
        }
        if (!gameSettings.boardSpacing)
        {
            gameSettings.boardSpacing = 1.2;
        }
        if (!gameSettings.maxPlayers)
        {
            gameSettings.maxPlayers = 1;
        }

        game.leaderboards = leaderboards;
        game.badges = badges;

        game.keyCodes = keyCodes;
        game.mouseCodes = mouseCodes;

        var maxPlayers = gameSettings.maxPlayers;
        var foods = [];
        var worms = [];

        var n;
        for (n = 0; n < maxPlayers; n += 1)
        {
            foods[n] = {
                x : -1,
                y : -1,
                updated : false,
                eatenBy : null
            };

            worms[n] = Worm.create(gameSettings);
        }

        game.foods = foods;
        game.worms = worms;

        game.newWormDirection = null;

        game.startTime = TurbulenzEngine.time;

        return game;
    }
}

Game.prototype.state = {
    PLAY : 0,
    DEAD : 1,
    ERROR: 2
};
