
var express = require('express');
var app = express();
var serv = require('http').Server(app);

var render = require('./render');
var preset = require('./presets');

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

render.prerender(); //prerender to rendering file
render.renderAssets(options); //render css and js assets
render.renderThemeOptions(options.theme); //render themes user can select
render.renderModeOptions(options.mode); //render themes user can select

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/indexrender.html');
});

app.use('/client', express.static(__dirname + '/client'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

serv.listen(9000);

console.log('editor online on port 9000');
