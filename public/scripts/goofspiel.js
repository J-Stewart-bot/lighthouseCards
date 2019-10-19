$(() => {


  const socket = io.connect('http://localhost:8080');

  // ask username
  const username = $("#username").text();
  console.log(username);
  socket.emit('username', username);

  socket.on('turn', function(username) {
    console.log(username, 'says your turn');
    $('#turn').text('Your turn');
    $('#confirm').css('visibility', 'visible');
    document.title = "!!";
  });

  $('#confirm').click(() => {
    $('#confirm').css('visibility', 'hidden');
    document.title = "Goofspiel";
    socket.emit('turn', username);
  })

});
