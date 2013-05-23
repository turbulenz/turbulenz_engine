// Copyright (c) 2013 Turbulenz Limited

class TicTacToeGame
{
    nought = 'O';
    cross = 'X';

    currentUsername: string;
    otherUser: string;
    host: string;

    moves: { [username: string]: any; };
    boardState: string[];
    otherPlayer: string;
    currentPlayerTurn: bool;
    firstMove: string;
    roundEnd: {
        forfeit?: string;
        winner?: string;
        draw?: bool;
    };

    update(serializedGameState?: string)
    {
        if (serializedGameState)
        {
            var gameStateUpdate = JSON.parse(serializedGameState);
            this.moves = gameStateUpdate.moves;
            this.firstMove = gameStateUpdate.firstMove;
        }

        this.boardState = [];

        var that = this;
        function addPlayerMoves(playerMoves, piece)
        {
            var playerMovesLength = playerMoves.length;
            var playerMovesIndex;
            for (playerMovesIndex = 0; playerMovesIndex < playerMovesLength; playerMovesIndex += 1)
            {
                var playerMove = playerMoves[playerMovesIndex];
                if (playerMove === 'forfeit')
                {
                    that.roundEnd = {
                        forfeit: username
                    };
                }
                that.boardState[playerMove[0] + playerMove[1] * 3] = piece;
            }
        }

        var currentUsername = this.currentUsername;
        var moves = this.moves;

        var otherMovesLength = 0;
        var myMovesLength = 0;
        var username;
        for (username in moves)
        {
            if (moves.hasOwnProperty(username))
            {
                var playerMoves = moves[username];
                var playerPiece = this.getPlayerPiece(username);
                addPlayerMoves(playerMoves, playerPiece);
                if (this.checkPieceWin(playerPiece))
                {
                    this.roundEnd = {
                        winner: username
                    };
                }
                if (username === currentUsername)
                {
                    myMovesLength += playerMoves.length;
                }
                else
                {
                    otherMovesLength += playerMoves.length;
                }
            }
        }

        if (currentUsername === this.firstMove)
        {
            this.currentPlayerTurn = (myMovesLength === otherMovesLength);
        }
        else
        {
            this.currentPlayerTurn = (myMovesLength < otherMovesLength);
        }

        if (!this.roundEnd && myMovesLength + otherMovesLength === 9)
        {
            this.roundEnd = {
                draw: true
            };
        }
    };

    serialize(): string
    {
        return JSON.stringify({
                moves: this.moves,
                firstMove: this.firstMove
            });
    };

    getPlayerPiece(username: string): string
    {
        if (username === this.host)
        {
            return this.nought;
        }
        else
        {
            return this.cross;
        }
    };

    forfeit()
    {
        var moves = this.moves;
        var currentUser = this.currentUsername;
        if (!moves[currentUser])
        {
            moves[currentUser] = [];
        }
        moves[currentUser].push('forfeit');
    };

    checkPieceWin(piece: string): bool
    {
        var boardState = this.boardState;
        var x, y;
        for (x = 0; x < 3; x += 1)
        {
            if (boardState[x + 0] === piece &&
                boardState[x + 3] === piece &&
                boardState[x + 6] === piece)
            {
                return true;
            }
        }
        for (y = 0; y < 3; y += 1)
        {
            if (boardState[0 + y * 3] === piece &&
                boardState[1 + y * 3] === piece &&
                boardState[2 + y * 3] === piece)
            {
                return true;
            }
        }
        if (boardState[0] === piece &&
            boardState[4] === piece &&
            boardState[8] === piece)
        {
            return true;
        }
        if (boardState[2] === piece &&
            boardState[4] === piece &&
            boardState[6] === piece)
        {
            return true;
        }
        return false;
    };

    canMove(x: number, y: number): bool
    {
        return (!this.roundEnd &&
                this.boardState[x + y * 3] === undefined)
    };

    doMove(x: number, y: number): void
    {
        var moves = this.moves;
        var currentUsername = this.currentUsername;
        if (!moves[currentUsername])
        {
            moves[currentUsername] = [];
        }
        moves[currentUsername].push([x, y]);
        if (this.firstMove === null)
        {
            this.firstMove = currentUsername;
        }
    };

    playerJoined(username: string): void
    {
        var moves = this.moves;
        if (!moves[username])
        {
            moves[username] = [];
            this.otherUser = username;
        }
    };

    getUsers(): string[]
    {
        var users = [this.currentUsername];
        var otherUser = this.otherUser;
        if (otherUser)
        {
            users.push(otherUser);
        }
        return users;
    };

    static create(username: string, host: string): TicTacToeGame
    {
        var ticTacToeGame;
        ticTacToeGame = new TicTacToeGame();

        ticTacToeGame.currentUsername = username;
        ticTacToeGame.host = host;

        ticTacToeGame.moves = {};
        ticTacToeGame.moves[username] = [];
        if (host !== username)
        {
            ticTacToeGame.moves[host] = [];
            ticTacToeGame.otherUser = host;
        }
        else
        {
            ticTacToeGame.otherUser = null;
        }
        ticTacToeGame.boardState = [];
        ticTacToeGame.otherPlayer = null;
        ticTacToeGame.currentPlayerTurn = true;
        ticTacToeGame.firstMove = null;
        ticTacToeGame.roundEnd = null;

        return ticTacToeGame;
    };
}
