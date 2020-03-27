var { exec } = require('child_process');
var chpr = require('child_process');
var fs = require('fs');

var proc = {

  run: (code, args, mode, callback) => {

    switch(mode){

      case 'c':
      var cmds = `gcc -c userprg.cpp
                  gcc -o userprg userprg.o
                  ./userprg ` + args;

      break;
      case 'c++':
        var cmds = `g++ -c userprg.cpp
                    g++ -o userprg userprg.o
                    ./userprg ` + args;

      break;
      case 'node':
        var cmds = `node userprg`;
      break;
    }

    var start = Date.now();

    var codefile = "./file.c"; //file we'll move users code to (to compile and run)
    var quickrun = "./quickrun.sh"; //the shell script we'll offset our cmds to
    var cmds = "gcc -c file.c\ngcc -o file file.o\n"; //all compile commands for c program

    fs.writeFileSync(codefile, code); //write users code out to code file
    fs.writeFileSync(quickrun, cmds); //write quick run script to sh file

    exec('chmod +x quickrun.sh'); //give exec permissions to bash script we made
    exec('gcc -c file.c', function(e, o, t){
      exec('gcc -o file file.o', function(e, o, t){


            var options = {
            stdio: 'inherit' //feed all child process logging into parent process
        };

        child = chpr.execFile('./file', [], {
            // detachment and ignored stdin are the key here:
            detached: true,
            stdio: [ 'ignore', 1, 2 ]
        });
        // and unref() somehow disentangles the child's event loop from the parent's:
        child.unref();
        child.stdout.on('data', function(data) {
            console.log(data.toString());
        });

      });
    });
  },

  runcmd: (cmd, callback) => { //run linux cmd

    try {
      exec(cmd, (err, stdout, stderr) => {
        callback({
          stdout: stdout,
          stderr: stderr,
          err: err
        });
      });
    } catch(err){
      console.log(err);
    }

  }

}

module.exports = proc;
