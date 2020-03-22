var setsocket = (socket, process) => {

  socket.id = Math.random(); //set random id
  console.log('new conn: ' + socket.id);

  /*
  client runs program
  */
  socket.on('code', (data) => {
    process.run(data.code, data.args, data.mode, (result) => {
      socket.emit('codeoutput', result);
    });
  });

  /*
  client runs command
  */
  socket.on('cmd', (data) => {
    process.runcmd(data, (result) => {
      socket.emit('cmdoutput', result);
    });
  });

}

module.exports = setsocket;
