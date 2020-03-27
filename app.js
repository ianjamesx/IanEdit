
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv);

var render = require('./render');
var socketutils = require('./socketutils');
var proc = require('./proc');

/*
rendering options for prerender
*/
var options = {
  lib: { //all lib assets
    ALL: true
  },
  addon: { //addons used in the codemirror window
    edit: true,
    comment: true,
    scroll: true,
    hint: true,
    wrap: true,
    search: true,
    display: true
  },
  mode: { //different modes (languages) used
    clike: true
  },
  theme: { //themes (colors)
    ALL: true
  }
};

/*
prerenders
*/

render.prerender(); //prerender to rendering file
render.renderAssets(options); //render css and js assets
render.renderThemeOptions(options.theme); //render themes user can select
render.renderModeOptions(options.mode); //render themes user can select

/*
express routings
*/

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/indexrender.html');
});

app.use('/client', express.static(__dirname + '/client'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

/*
socket handling
*/

io.sockets.on('connection', (socket) => {
  socketutils(socket, proc);
});

/*
server port routing
*/

serv.listen(9000);
console.log('editor online on port 9000');
