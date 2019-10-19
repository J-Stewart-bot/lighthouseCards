$(() => {


  const socket = io.connect('http://localhost:8080');

  // ask username
  const username = $("#username").text();
  socket.emit('username', username);

  socket.on('turn', function(username) {
    $('#confirm').css('visibility', 'visible');
    document.title = "!!";
  });

  $('#confirm').click(() => {
    $('#confirm').css('visibility', 'hidden');
    $('.player > .container').find('.selected').remove();
    document.title = "Goofspiel";
    socket.emit('turn', username);
  })

  $('.player > .container > .card').click(function() {
    let clicked = $(`#${this.id}`).hasClass("selected");
    $(".card").removeClass("selected");
    if (clicked) {
      $(`#${this.id}`).removeClass("selected");
      clicked = false;
    } else {
      $(`#${this.id}`).addClass("selected");
    }
  })

});
