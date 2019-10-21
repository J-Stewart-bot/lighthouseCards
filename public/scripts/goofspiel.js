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

  socket.on('score', function(p1, p2) {
    $('#score').text(p1);
    $('#opponentScore').text(p2);

    if (p1 === 'winner') {
      console.log('in winner');
      $.ajax({
        type: "POST",
        url: "/records",
        data: { winner: 'winnner', loser: 'loser', gameId: '1' },
        success: () => {
          console.log('did a thing')
        }
      })
        .then(() => {

        })
        .fail((error) => {
          renderError(error.responseJSON.error);
        });
    }
  });

  socket.on('win', function(points) {
    let currentScore = $('#score').text();
    console.log(currentScore);
    $('#score').text(Number(currentScore) + points);
  });

  $('#confirm').click(() => {
    const card = $('.player > .container').find('.selected').remove().attr('id');
    if (card) {
      $('#confirm').css('visibility', 'hidden');
      document.title = "Goofspiel";
      socket.emit('turn', username, Number(card));
    } else {
      $('#error').css('visibility', 'visible');
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
