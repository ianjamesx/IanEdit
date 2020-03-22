var { exec } = require('child_process');
var chpr = require('child_process');
var fs = require('fs');

var proc = {

  run: (code, args, mode, callback) => {

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
    /*exec('./quickrun.sh', (err, stdout, stderr) => {

      var end = Date.now();
      console.log('compiled and ran in ' + (end - start) + 'ms');

      callback({
        stdout: stdout,
        stderr: stderr,
        err: err
      });

    });
    */

/*
    var scriptOutput = "";

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function(data) {
        console.log('1stdout: ' + data);

        data=data.toString();
        scriptOutput+=data;
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function(data) {
        console.log('1stderr: ' + data);

        data=data.toString();
        scriptOutput+=data;
    });

    child.on('close', function(code) {
        callback(scriptOutput,code);
    });
*/
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
