/*setInterval(function(){
  console.log('hello from js script');
}, 1000);
*/


var chpr = require('child_process');

var args = [''];

var options = {
    stdio: 'inherit' //feed all child process logging into parent process
};

var childProcess = chpr.spawn('./file', args, options);
childProcess.on('close', function(code) {
    process.stdout.write('cmd finished with code ' + code + '\n');
});
