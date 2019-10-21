$(() => {


  const socket = io.connect('192.168.12.74:8080');

  // ask username
  const username = $("#username").text();
  socket.emit('username', username);

  socket.on('opponent', function(username) {
    $('#opponentName').text(username);
  })

  socket.on('turn', function(username) {
    $('#confirm').css('visibility', 'visible');
    document.title = "!!";
  });

  socket.on('prize', function(prize) {
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

  socket.on('show', function(yourCard, opponentCard) {
    if (yourCard === 13) {
      $('.yourCard > img').attr('src', '/cards/KD.png');
    } else if (yourCard === 12) {
      $('.yourCard > img').attr('src', '/cards/QD.png');
    } else if (yourCard === 11) {
      $('.yourCard > img').attr('src', '/cards/JD.png');
    } else if (yourCard > 1) {
      $('.yourCard > img').attr('src', `/cards/${yourCard}D.png`);
    } else {
      $('.yourCard > img').attr('src', '/cards/AD.png');
    }

    if (opponentCard === 13) {
      $('.opponentCard > img').attr('src', '/cards/KD.png');
    } else if (opponentCard === 12) {
      $('.opponentCard > img').attr('src', '/cards/QD.png');
    } else if (opponentCard === 11) {
      $('.opponentCard > img').attr('src', '/cards/JD.png');
    } else if (opponentCard > 1) {
      $('.opponentCard > img').attr('src', `/cards/${opponentCard}D.png`);
    } else {
      $('.opponentCard > img').attr('src', '/cards/AD.png');
    }
  });

  socket.on('score', function(p1, p2) {
    $('#score').text(p1);
    $('#opponentScore').text(p2);
    $('.opponent > .container').find('div:first').remove();

    if (p1 === 'winner') {
      const loser = $('#opponentName').text();
      let game = $('#gamename').text();

      if (game = 'Goofspiel') {
        game = 1;
      }

      $.ajax({
        type: "POST",
        url: "/records",
        data: { winner: username, loser: loser, gameId: game },
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
      $('#error').css('visibility', 'hidden');
      document.title = "Goofspiel";
      socket.emit('turn', username, Number(card));
    } else {
      $('#error').css('visibility', 'visible');
    }
  })

  socket.on('exit', function() {
    console.log('run');
    window.location.href = "/";
  });

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

  $('#exit').click(() => {
    const response = confirm("Are you sure you want to leave?");

    if (response) {
      socket.emit('left', username);
      console.log('bye');
      //close window or something
    }
  })
});
