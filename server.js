var io = require('socket.io')(process.env.PORT || 52300);

// Custom classes
var Player = require('./Classes/Player');
var { Map, PlatformBuilder } = require('./Classes/Map');

console.log('Server has started');

const players = [];
const sockets = [];
// const defaultMap = '3.55k-1.84l-2.76k-.61l2.11k.89l';
const groundY = -0.55;
const defaultPlatforms = new PlatformBuilder([3.55, groundY + 1.5, -2.76, groundY + 3, 2.11, groundY + 4.5, 5, groundY + 6]);
const defaultMap = new Map(defaultPlatforms.GetPlatforms());

io.on('connection', (socket) => {
    console.log('A player has connected to the server');

    var player = new Player();
    var thisPlayerId = player.id;

    players[thisPlayerId] = player;
    sockets[thisPlayerId] = socket;

    // Tell the client that this is our id for our client
    socket.emit('register', { id: thisPlayerId });
    console.log('[playerid]:', thisPlayerId);
    socket.emit('spawn', player); // tell myself i have spawned
    socket.broadcast.emit('spawn', player); // tell others i have spawned

    // tell me about all the other players in the game
    for (let playerId in players) {
        if (playerId != thisPlayerId) {
            socket.emit('spawn', players[playerId]);
        }
    }

    // tell me about the map
    socket.emit('mapLoad', defaultMap.ToString());
    console.log(defaultMap.ToString());

    // Player Position
    socket.on('updateMyPosition', (data) => {
        player.position.x = data.position.x;
        player.position.y = data.position.y;
        socket.broadcast.emit('updateOtherPosition', player);
    })

    socket.on('disconnect', () => {
        console.log(`${thisPlayerId} has disconnected from the server`)
        delete players[thisPlayerId];
        delete sockets[thisPlayerId];
        socket.broadcast.emit('disconnected', player);
    })
});