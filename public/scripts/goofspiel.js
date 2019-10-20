$(() => {


  const socket = io.connect('http://localhost:8080');

  // ask username
  const username = $("#username").text();
  socket.emit('username', username);

  socket.on('turn', function(username) {
    $('#confirm').css('visibility', 'visible');
    document.title = "!!";
  });

  socket.on('prize', function(prize) {
    console.log(prize);
  });

  socket.on('split', function() {
    console.log('split');
  });

  socket.on('win', function(msg) {
    console.log(msg);
  });

  $('#confirm').click(() => {
    $('#confirm').css('visibility', 'hidden');
    const card = $('.player > .container').find('.selected').remove().attr('id');
    console.log(card);
    document.title = "Goofspiel";
    socket.emit('turn', username, card);
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
