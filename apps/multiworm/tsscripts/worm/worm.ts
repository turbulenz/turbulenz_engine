// Copyright (c) 2011-2012 Turbulenz Limited

interface PlayerInfo
{
    score: number;
    team: string;
    status: string;
    color: string;
};

interface WormDirection
{
    NONE  : number;
    UP    : number;
    DOWN  : number;
    RIGHT : number;
    LEFT  : number;
};

//
// Worm: Worm class
//
class Worm
{
    // Enums for worm direction
    direction       : WormDirection;
    upVector        : number[];
    downVector      : number[];
    rightVector     : number[];
    leftVector      : number[];
    zeroVector      : number[];

    boardSpacing    : number;
    boardWidth      : number;
    boardHeight     : number;
    maxPlayers      : number;

    directionVector : number[];

    partsPositionX  : any; // number[];
    partsPositionY  : any; // number[];
    previousTailX   : number;
    previousTailY   : number;

    killedBy        : number;
    updated         : boolean;

    playerInfo      : PlayerInfo;

    hasLooped       : boolean;

    // Changes the worm's direction
    changeDirection(newDirection)
    {
        var direction = this.direction;
        var directionVector = this.directionVector;
        var newDirectionVector;

        switch (newDirection)
        {
        case direction.UP:
            if (directionVector !== this.downVector)
            {
                newDirectionVector = this.upVector;
            }
            break;
        case direction.DOWN:
            if (directionVector !== this.upVector)
            {
                newDirectionVector = this.downVector;
            }
            break;
        case direction.RIGHT:
            if (directionVector !== this.leftVector)
            {
                newDirectionVector = this.rightVector;
            }
            break;
        case direction.LEFT:
            if (directionVector !== this.rightVector)
            {
                newDirectionVector = this.leftVector;
            }
            break;
        default:
            newDirectionVector = this.zeroVector;
            break;
        }

        if (newDirectionVector !== undefined)
        {
            if (directionVector !== newDirectionVector)
            {
                this.directionVector = newDirectionVector;
                this.updated = true;
            }
        }
    }

    // Update called every frame
    update()
    {
        if (this.directionVector !== this.zeroVector)
        {
            if (this.partsPositionX.length === 1)
            {
                this.playerInfo.status = "is looking for food.";
            }
            this.moveBody();
            this.moveHead();
            this.updated = true;
        }
        else
        {
            this.playerInfo.status = "is thinking about getting some lunch.";
        }

        this.killedBy = null;
    }

    // Collided with something
    die(killedBy)
    {
        this.directionVector = this.zeroVector;
        this.killedBy = killedBy;
        this.updated = true;
        this.playerInfo.status = "is bird-food.";
    }

    // Serialize worm information
    serialize()
    {
        var directionVector = this.directionVector;
        var direction = this.direction;

        var dir;
        if (directionVector === this.downVector)
        {
            dir = direction.DOWN;
        }
        else if (directionVector === this.upVector)
        {
            dir = direction.UP;
        }
        else if (directionVector === this.leftVector)
        {
            dir = direction.LEFT;
        }
        else if (directionVector === this.rightVector)
        {
            dir = direction.RIGHT;
        }
        else //if (directionVector === this.zeroVector)
        {
            dir = direction.NONE;
        }

        var data = {
            dir: dir,
            x: this.partsPositionX.slice(),
            y: this.partsPositionY.slice(),
            score: this.playerInfo.score,
            color: this.playerInfo.color,
            team: this.playerInfo.team,
            status: this.playerInfo.status,
            killedBy: <number>undefined
        };

        var killedBy = this.killedBy;
        if (killedBy !== null)
        {
            data.killedBy = killedBy;
        }

        return data;
    }

    // Deserialize from external data
    deserialize(isHost, data)
    {
        var partsPositionX = this.partsPositionX;
        var partsPositionY = this.partsPositionY;
        var numParts = partsPositionX.length;

        if (!isHost)
        {
            var killedBy = data.killedBy;
            if (killedBy !== undefined)
            {
                this.killedBy = killedBy;
            }
            else
            {
                this.killedBy = null;
            }
        }

        var direction = this.direction;
        switch (data.dir)
        {
        case direction.UP:
            this.directionVector = this.upVector;
            break;
        case direction.DOWN:
            this.directionVector = this.downVector;
            break;
        case direction.RIGHT:
            this.directionVector = this.rightVector;
            break;
        case direction.LEFT:
            this.directionVector = this.leftVector;
            break;
        default:
            this.directionVector = this.zeroVector;
            break;
        }

        var newPartsPositionX = data.x;
        var newPartsPositionY = data.y;
        var newNumParts = newPartsPositionX.length;

        if (numParts !== newNumParts)
        {
            partsPositionX.length = newNumParts;
            partsPositionY.length = newNumParts;
        }

        for (var n = 0; n < newNumParts; n += 1)
        {
            partsPositionX[n] = newPartsPositionX[n];
            partsPositionY[n] = newPartsPositionY[n];
        }

        this.playerInfo.score = data.score;
        this.playerInfo.team = data.team;
        this.playerInfo.status = data.status;
        this.playerInfo.color = data.color;
    }

    // Moves all of worm parts as required
    moveBody()
    {
        var partsPositionX = this.partsPositionX;
        var partsPositionY = this.partsPositionY;
        var length = partsPositionX.length;
        var tailIndex = (length - 1);

        var i;

        // Update the previous tail position
        this.previousTailX = partsPositionX[tailIndex];
        this.previousTailY = partsPositionY[tailIndex];

        // Copy positions from back to front
        for (i = tailIndex; i > 0; i -= 1)
        {
            partsPositionX[i] = partsPositionX[i - 1];
            partsPositionY[i] = partsPositionY[i - 1];
        }
    }

    // Moves head and loops over board edge if necessary
    moveHead()
    {
        var boardWidth = this.boardWidth;
        var boardHeight = this.boardHeight;
        var partsPositionX = this.partsPositionX;
        var partsPositionY = this.partsPositionY;
        var directionVector = this.directionVector;
        var headPositionX = partsPositionX[0];
        var headPositionY = partsPositionY[0];

        // Update head of snake
        headPositionX += directionVector[0];
        headPositionY += directionVector[1];

        this.hasLooped = true;

        // Adjust if it has gone off edge
        if (headPositionX === boardWidth)
        {
            headPositionX = 0;
        }
        else if (headPositionX === -1)
        {
            headPositionX = boardWidth - 1;
        }
        else if (headPositionY === boardHeight)
        {
            headPositionY = 0;
        }
        else if (headPositionY === -1)
        {
            headPositionY = boardHeight - 1;
        }
        else
        {
            this.hasLooped = false;
        }

        partsPositionX[0] = headPositionX;
        partsPositionY[0] = headPositionY;
    }

    // Increases worm length by 1
    addToTail()
    {
        var partsPositionX = this.partsPositionX;
        var partsPositionY = this.partsPositionY;
        var length = partsPositionX.length;

        partsPositionX[length] = this.previousTailX;
        partsPositionY[length] = this.previousTailY;

        this.updated = true;

        if (length > 2) {
            this.playerInfo.status = "is still hungry.";
        }

        if (length > 4) {
            this.playerInfo.status = "is getting full.";
        }

        if (length > 8) {
            this.playerInfo.status = "is eating too much.";
        }

        if (length > 10) {
            this.playerInfo.status = "is putting on a bit of weight.";
        }

        if (length > 12) {
            this.playerInfo.status = "is feeling bloated.";
        }
    }

    // Tests for self intersection
    isIntersectingSelf()
    {
        var partsPositionX = this.partsPositionX;
        var partsPositionY = this.partsPositionY;
        var length = partsPositionX.length;
        var headX = partsPositionX[0];
        var headY = partsPositionY[0];

        var i;

        for (i = 1; i < length; i += 1)
        {
            if (partsPositionX[i] === headX &&
                partsPositionY[i] === headY)
            {
                return true;
            }
        }

        return false;
    }

    // Tests for intersection with other worms
    isIntersecting(otherWorm)
    {
        var otherPartsPositionX = otherWorm.partsPositionX;
        var otherPartsPositionY = otherWorm.partsPositionY;
        var otherLength = otherPartsPositionX.length;

        var headX = this.partsPositionX[0];
        var headY = this.partsPositionY[0];

        var i;

        for (i = 0; i < otherLength; i += 1)
        {
            if (otherPartsPositionX[i] === headX &&
                otherPartsPositionY[i] === headY)
            {
                return true;
            }
        }

        return false;
    }

    // Tests if position x,y is covered by worm
    containsPosition(x, y)
    {
        var partsPositionX = this.partsPositionX;
        var partsPositionY = this.partsPositionY;
        var length = partsPositionX.length;

        var i;

        for (i = 0; i < length; i += 1)
        {
            if (partsPositionX[i] === x &&
                partsPositionY[i] === y)
            {
                return true;
            }
        }

        return false;
    }

    // Test if position x,y is covered by worm head
    isOnHead(x, y)
    {
        if (this.partsPositionX[0] === x &&
            this.partsPositionY[0] === y)
        {
            return true;
        }

        return false;
    }

    // Resets worm to original state
    reset(x, y)
    {
        this.hasLooped = false;

        var partsPositionX = this.partsPositionX;
        var partsPositionY = this.partsPositionY;

        this.directionVector = this.zeroVector;

        partsPositionX.length = 1;
        partsPositionY.length = 1;

        partsPositionX[0] = x;
        partsPositionY[0] = y;

        this.previousTailX = x;
        this.previousTailY = y;

        this.playerInfo.color = Math.random() > 0.5 ? "green" : "yellow";
        this.playerInfo.score = 0;

        this.updated = true;
    }

    static create(gameSettings): Worm
    {
        var worm = new Worm();

        worm.boardSpacing = gameSettings.boardSpacing;
        worm.boardWidth = gameSettings.width;
        worm.boardHeight = gameSettings.height;
        worm.maxPlayers = gameSettings.maxPlayers;

        worm.directionVector = worm.zeroVector;

        worm.partsPositionX = [];
        worm.partsPositionY = [];
        worm.previousTailX = 0;
        worm.previousTailY = 0;

        worm.killedBy = null;
        worm.updated = false;

        worm.playerInfo = {
            score: 0,
            team: "Worms",
            status: "is thinking about getting some lunch.",
            color: Math.random() > 0.5 ? "green" : "yellow"
        };

        return worm;
    }
}

Worm.prototype.direction = {
    NONE : -1,
    UP : 0,
    DOWN : 1,
    RIGHT : 2,
    LEFT : 3
};
Worm.prototype.upVector = [ 0,  1];
Worm.prototype.downVector = [ 0, -1];
Worm.prototype.rightVector = [ 1,  0];
Worm.prototype.leftVector = [-1,  0];
Worm.prototype.zeroVector = [ 0,  0];
