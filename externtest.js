/*var chpr = require('child_process');

var args = [''];

var options = {
    stdio: 'inherit' //feed all child process logging into parent process
};

var childProcess = chpr.spawn('./file', args, options);
childProcess.on('close', function(code) {
    process.stdout.write('cmd finished with code ' + code + '\n');
});
*/
const chpr = require('child_process');
const sp = chpr.spawn('./file', []);

sp.stdout.setEncoding('utf8');
sp.stdout.on('data', (data) => {
  console.log(data);
});

sp.stdout.setEncoding('utf8');
sp.stderr.on('data', (data) => {
  console.error(data);
});

sp.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
