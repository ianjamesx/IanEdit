var editor, socket, term; //globals

/*
onload function
*/
$(document).ready(() => {

  /*
  init code editor
  */
  editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    mode: "text/x-csrc",
    lineNumbers: true,
    styleActiveLine: true,
    smartIndent: true,
    search: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    viewportMargin: Infinity,
    theme: 'duotone-dark'
  });
  editor.setSize("100%", (window.innerHeight)*.7); //set editor height to be 70% of users window

  /*
  init code terminal
  */
  term = new Terminal();
  term.open(document.getElementById('terminal'));
  terminalctl.init(term); //init terminal

  /*
  init socket to server
  */
  socket = io();
  //socket recieve events
  socket.on('codeoutput', terminalctl.stdout);
  socket.on('cmdoutput', terminalctl.stdout);

});


/*
handlers for buttons/ui
*/

$("#theme").change(() => {
  editorctl.changeTheme();
});

$("#run").click(() => {
  editorctl.sendCode();
});

/*
utils for the code editor window
*/

var editorctl = {

  sendCode: () => {
    var code = editor.getValue();
    console.log(code);

    //send server code, args, and mode
    socket.emit('code', {
      code: code,
      args: $('#args').val()
    });
  },

  setCodePreset: (language) => {

  },

  changeTheme: (theme) => {
    var theme = $("#theme option:selected").text();
    editor.setOption("theme", theme);
  }
};


/*
utils for the terminal window
*/

var terminalctl = {

  init: () => {

    term.write('\x1b[1;34m'); //set term color
    terminalctl.prompt(); //set initial prompt

    var currbuffer = ''; //buffer to hold commands
    var prevcmds = []; //buffer to hold previous commands (basically a stack of all commands entered previously)
    var currcmd = 0; //index to keep track of which cmd we're on

    term.onKey(e => { //event listener to keypresses
      const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;

      if(e.domEvent.keyCode === 13) { //enter key, send buffer to client, reset buffer
        terminalctl.linebreak();
        prevcmds.push(currbuffer); //put command into stack of previous commands
        terminalctl.sendcmd(currbuffer); //send cmd to serv
        currbuffer = ''; //reset buffer
        currcmd = 0; //reset current command index

      } else if(e.domEvent.keyCode === 8) { //backspace
        if (term._core.buffer.x > 2){ // Do not delete the prompt
          term.write('\b \b');
        }
        if(currbuffer.length > 0){
          currbuffer = currbuffer.substring(0, currbuffer.length - 1); //only pop from string IF there is something in string already
        }

      } else if(e.domEvent.keyCode === 38 || e.domEvent.keyCode === 40){ //up or down array key, use a previous cmd
        var cmdobj = terminalctl.writePrevCmd(e.domEvent.keyCode, prevcmds, currcmd, currbuffer); //write one of the users previous commands
        currcmd = cmdobj.cmd;
        currbuffer = cmdobj.buffer;

      } else if(printable){ //any other character
        term.write(e.key);
        currbuffer += e.key;
      }
    });
  },

  writePrevCmd: (key, prevcmds, currcmd, currbuffer) => {

    if(key === 38){ //up arrow
      if(currcmd > prevcmds.length-1){ //at beginning (oldest command) of stack, keep everything the same (take no action)
        return {
          cmd: currcmd,
          buffer: currbuffer
        };
      }
      currcmd++;
    } else if(key === 40){ //down arrow
      if(currcmd < 1){ //at front (most previous/newest command) of stack, clear buffer
        terminalctl.clearcurrentcmd(); //clear prompt for this case too (as we reset buffer)
        return {
          cmd: currcmd,
          buffer: ''
        };
      }
      currcmd--;
    }

    terminalctl.clearcurrentcmd(); //clear prompt
    var currindex = prevcmds.length - currcmd; //index of previous command user wants
    if(currindex < prevcmds.length){
      term.write(prevcmds[currindex]); //write command to term
    }

    return {
      cmd: currcmd,
      buffer: prevcmds[currindex]
    };

  },

  clearcurrentcmd: () => {
    term.write('\33[2K'); //clear whole line
    term.write('\r$ '); //return carriage to front of line with prompt
  },

  setTermFontColor: () => {


  },

  prompt: () => {
    term.write('\r\n$ ');
  },

  linebreak: () => {
    term.write('\r\n');
  },

  stdout: (output) => {
    console.log(output);

    if(output.stderr.length > 0){ //standard error (for users code, not for server)
      terminalctl.writeStringToTerm(output.stderr);
    } else if(output.err){
      terminalctl.writeStringToTerm('error when compiling on server'); //error for compiling code on serv
    } else { //no errs, write stdout
      terminalctl.writeStringToTerm(output.stdout);
    }

    terminalctl.prompt(); //reset prompt
  },

  writeStringToTerm: (string) => {
    var i;
    for(i = 0; i < string.length; i++){
      if(string[i] === '\n'){
        term.write('\r\n'); //break buffer line
      } else {
        term.write(string[i]); //write char to buffer
      }
    }
  },

  sendcmd: (cmd) => {
    if(cmd === ''){ //if just an enter press, do nothing
      terminalctl.prompt();
      return;
    }
    socket.emit('cmd', cmd);
  }

};
