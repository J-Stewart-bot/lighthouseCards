$(() => {


  const socket = io.connect('192.168.12.74:8080');

  // ask username
  const username = $("#username").text();
  socket.emit('username', username);

  socket.on('turn', function(username) {
    $('#confirm').css('visibility', 'visible');
    document.title = "!!";
  });

  socket.on('prize', function(prize) {
    console.log(prize);
    if (prize === 13) {
      $('.prize > img').attr('src', '/cards/KD.png');
    } else if (prize === 12) {
      $('.prize > img').attr('src', '/cards/QD.png');
    } else if (prize === 11) {
      $('.prize > img').attr('src', '/cards/JD.png');
    } else if (prize > 1) {
      $('.prize > img').attr('src', `/cards/${prize}D.png`);
    } else {
      $('.prize > img').attr('src', '/cards/AD.png');
    }
  });

  socket.on('split', function() {
    console.log('split');
  });

  socket.on('win', function(msg) {
    console.log(msg);
  });

  $('#confirm').click(() => {
    const card = $('.player > .container').find('.selected').remove().attr('id');
    console.log(card);
    if (card) {
      $('#confirm').css('visibility', 'hidden');
      console.log(card);
      document.title = "Goofspiel";
      socket.emit('turn', username, card);
    }
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
