// Copyright (c) 2012 Turbulenz Limited

/*jshint nomen: false*/
/*global Turbulenz: false*/
/*global $*/

// requires jQuery
function createBridgeServicesSimulator()
{
    var turbulenz = window.top.Turbulenz;
    var bridge = turbulenz && turbulenz.Services && turbulenz.Services.bridge;
    var numPlayersShown = 0;

    function createGroup(title, id, parent, collapsed)
    {
        bridge.emit('dynamicui.group-create', JSON.stringify({
            id: id,
            title: title,
            groupId: parent,
            expanded: !collapsed
        }));
    }

    function createWatch(title, id, parent)
    {
        bridge.emit('dynamicui.add-item', JSON.stringify({
            id: id,
            type: 'watch',
            title: title,
            groupId: parent
        }));
    }

    function createText(title, id, parent)
    {
        bridge.emit('dynamicui.add-item', JSON.stringify({
            id: id,
            type: 'text',
            title: title,
            groupId: parent
        }));
    }

    function pushValue(id, value)
    {
        bridge.emit('dynamicui.pushvalue', JSON.stringify({
            id: id,
            value: value
        }));
    }

    function destroy(id)
    {
        bridge.emit('dynamicui.destroy', JSON.stringify({
            id: id
        }));
    }

    function onUserbadgeUpdate(badge)
    {
        var str = 'Userbadge Updated: ' + badge.badge_key + '(' + badge.current + '/' + badge.total + ')';
        pushValue('bs-userbadge-status', str);
    }

    function onLeaderboardUpdate(leaderboard)
    {
        pushValue('bs-userbadge-status', 'Leaderboard Updated: ' + leaderboard.title + ' - ' + leaderboard.score);
    }

    function onGameSessionCreated(gameSessionId)
    {
        pushValue('bs-game-session-info-status', 'Game session ' + gameSessionId + 'created');
    }

    function onGameSessionStatus(gameSessionId, status)
    {
        pushValue('bs-game-session-info-status', gameSessionId + ": " + status);
    }

    function onGameSessionDestroyed(gameSessionId)
    {
        pushValue('bs-game-session-info-status', 'Game session ' + gameSessionId + ' destroyed');
    }

    function createPlayerBlock(index)
    {
        var groupId = 'bs-game-session-players-' + index;
        createGroup('Player', groupId, 'bs-game-session-players');
        createWatch('Name', groupId + '-name', groupId);
        createWatch('Team', groupId + '-team', groupId);
        createWatch('Color', groupId + '-color', groupId);
        createWatch('Score', groupId + '-score', groupId);
        createWatch('Status', groupId + '-status', groupId);
        createWatch('Rank', groupId + '-rank', groupId);
        createWatch('Sort Key', groupId + '-sortkey', groupId);
    }

    function onGameSessionInfo(info)
    {
        var data = JSON.parse(info);
        var playerList = [];
        var teamList = data.sessionData.teamList || [];
        var i, player, name, playerData, groupId;

        pushValue('bs-game-session-info-teamlist', '[' + teamList.join(',') + ']');
        pushValue('bs-game-session-info-sessionid', data.sessionData.gameSessionId);

        for (player in data.playerSessionData)
        {
            if (data.playerSessionData.hasOwnProperty(player))
            {
                playerList.push(player);
            }
        }

        playerList.sort(function (playerA, playerB)
        {
            var teamA = -1;
            var teamB = -1;
            var playerDataA = data.playerSessionData[playerA];
            var playerDataB = data.playerSessionData[playerB];
            var teamList = data.sessionData.teamList;
            if (teamList)
            {
                teamA = teamList.indexOf(playerDataA.team);
                teamB = teamList.indexOf(playerDataB.team);
            }
            if (teamA === teamB)
            {
                return playerDataA.sortkey - playerDataB.sortkey;
            }
            else
            {
                return teamA - teamB;
            }
        });

        while (numPlayersShown < playerList.length)
        {
            createPlayerBlock(numPlayersShown);
            numPlayersShown += 1;
        }
        while (numPlayersShown > playerList.length)
        {
            destroy('bs-game-session-players-' + (numPlayersShown - 1));
            numPlayersShown -= 1;
        }

        for (i = 0; i < playerList.length; i += 1)
        {
            name = playerList[i];
            playerData = data.playerSessionData[name];
            groupId = 'bs-game-session-players-' + i;
            pushValue(groupId + '-name', name);
            pushValue(groupId + '-team', playerData.team);
            pushValue(groupId + '-color', playerData.color);
            pushValue(groupId + '-score', playerData.score);
            pushValue(groupId + '-status', playerData.status);
            pushValue(groupId + '-rank', playerData.rank);
            pushValue(groupId + '-sortkey', playerData.sortkey);
        }
    }

    function onMultiplayerSessionJoined(session)
    {
        pushValue('bs-mp-session-status', "Joined");
        pushValue('bs-mp-session-id', session.sessionId);
        pushValue('bs-mp-session-numplayers', session.numplayers);
        pushValue('bs-mp-session-playerId', session.playerId);
    }

    function onMultiplayerSessionLeave(sessionId)
    {
        pushValue('bs-mp-session-status', 'Left Session ' + sessionId);
        pushValue('bs-mp-session-id', "");
    }

    function onMultiplayerSessionMakepublic(sessionId)
    {
        pushValue('bs-mp-session-status', 'Session ' + sessionId + ' is public');
    }

    function onStatusLoadingStart(force)
    {
        pushValue('bs-loading-status', 'Loading Started (force=' + force + ')');
    }

    function onStatusLoadingStop(force)
    {
        pushValue('bs-loading-status', 'Loading Stopped (force=' + force + ')');
    }

    function onStatusSavingStart(force)
    {
        pushValue('bs-saving-status', 'Saving Started (force=' + force + ')');
    }

    function onStatusSavingStop(force)
    {
        pushValue('bs-saving-status', 'Saving Stopped (force=' + force + ')');
    }

    function register()
    {
        // Create UI
        createGroup('Turbulenz Services Display', 'bs-root', '#bsui', true);

        createGroup('Loading Status', 'bs-loading', 'bs-root');
        createWatch('Status', 'bs-loading-status', 'bs-loading');

        createGroup('Saving Status', 'bs-saving', 'bs-root');
        createWatch('Status', 'bs-saving-status', 'bs-saving');

        createGroup('Userbadge Events', 'bs-userbadge', 'bs-root');
        createWatch('Status', 'bs-userbadge-status', 'bs-userbadge');

        createGroup('Leaderboard Events', 'bs-leaderboard', 'bs-root');
        createWatch('Status', 'bs-leaderboard-status', 'bs-leaderboard');

        createGroup('Game Session Status', 'bs-game-session', 'bs-root');
        createGroup('Session Info', 'bs-game-session-info', 'bs-game-session');
        createWatch('Status', 'bs-game-session-info-status', 'bs-game-session-info');
        createWatch('Team List', 'bs-game-session-info-teamlist', 'bs-game-session-info');
        createWatch('Session Id', 'bs-game-session-info-sessionid', 'bs-game-session-info');
        createGroup('Player Info', 'bs-game-session-players', 'bs-game-session');

        createGroup('Multiplayer Session Status', 'bs-mp-session', 'bs-root');
        createText('To Join (Enter to send)', 'bs-mp-session-joinid', 'bs-mp-session');
        createWatch('Status', 'bs-mp-session-status', 'bs-mp-session');
        createWatch('Id', 'bs-mp-session-id', 'bs-mp-session');
        createWatch('Num Players', 'bs-mp-session-numplayers', 'bs-mp-session');
        createWatch('PlayerId', 'bs-mp-session-playerId', 'bs-mp-session');

        // UI management functions
        bridge.gameListenerOn('userbadge.update', onUserbadgeUpdate);
        bridge.gameListenerOn('leaderboards.update', onLeaderboardUpdate);

        bridge.gameListenerOn('game.session.created', onGameSessionCreated);
        bridge.gameListenerOn('game.session.status', onGameSessionStatus);
        bridge.gameListenerOn('game.session.destroyed', onGameSessionDestroyed);
        bridge.gameListenerOn('game.session.info', onGameSessionInfo);

        bridge.gameListenerOn('multiplayer.session.joined', onMultiplayerSessionJoined);
        bridge.gameListenerOn('multiplayer.session.leave', onMultiplayerSessionLeave);
        bridge.gameListenerOn('multiplayer.session.makepublic', onMultiplayerSessionMakepublic);

        bridge.gameListenerOn('status.loading.start', onStatusLoadingStart);
        bridge.gameListenerOn('status.loading.stop', onStatusLoadingStop);

        bridge.gameListenerOn('status.saving.start', onStatusSavingStart);
        bridge.gameListenerOn('status.saving.stop', onStatusSavingStop);

        bridge.gameListenerOn('dynamicui.changevalue', function (jsonstring)
        {
            var options = JSON.parse(jsonstring);
            if (options.id === 'bs-mp-session-joinid')
            {
                bridge.emit('multiplayer.session.join', options.value);
            }
        });

    }

    if (bridge)
    {
        $(register);
    }
}

createBridgeServicesSimulator();