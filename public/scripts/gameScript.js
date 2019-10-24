
const playCard = function(socket, selected, hand, pile) {
  for (const card in hand) {
    if (selected === hand[card].img) {
      socket.emit('turn', hand[card], pile);
    }
  }
};

const flip = function(hand, leftCard, rightCard) {
  $('#confirm').css('visibility', 'hidden');
  // check if can play
  if (!checkPiles(hand, [leftCard, rightCard])) {
    $('#confirm').text('Flip');

    $('#confirm').css('visibility', 'visible');
  }
}

$(() => {
  const socket = io();
  // const socket = io.connect('192.168.1.3:8080');

  let leftCard;
  let rightCard;
  let hand;

  // ask username
  const username = $("#username").text();
  const gamename = $("#gamename").text();
  socket.emit('username', username, gamename);

  socket.on('opponent', function(username, deck) {
    $('#opponentName').text(username);
    $('#toggle').css('visibility', 'visible');
    $("table > tbody > tr").not([document.getElementById(`${username}`)]).remove()

    hand = deck;
    if (deck !== undefined) {
      for (const card in deck) {
        $(`#${Number(card) + 1} > img`).attr('src', `/cards/${deck[card].img}`);

        let game = $('#gamename').text();
        if (game === 'Speed') {
          $(`#${Number(card) + 1}`).attr('id', `${deck[card].img}`);
        }
      }
    }
  });

  socket.on('turn', function(start) {
    if (start) {
      $('#confirm').text('Start');
    }

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
    leftCard = opponentCard;
    rightCard = yourCard;

    $('.rightCard > img').attr('src', `/cards/${rightCard.img}`);
    $('.leftCard > img').attr('src', `/cards/${leftCard.img}`);

    let game = $('#gamename').text();
    if (game === 'Speed') {

      const score = $('#score').text();
      if (score <= 5 || hand.length === 5) {
        flip(hand, leftCard, rightCard);
      }
    }
  });

  socket.on('score', function(p1, p2) {
    let game = $('#gamename').text();

    if (game === 'Speed') {
      $('#score').text($('#score').text() - p1);
      $('#opponentScore').text($('#opponentScore').text() - p2);

      const score = $('#score').text();
      if (score <= 0) {
        $('#confirm').text('SPEED');
        $('#confirm').css('visibility', 'visible');
      }
    } else {
      $('#score').text(p1);
      $('#opponentScore').text(p2);
    }

    if (game === 'Goofspiel') {
      $('.opponent > .container').find('div:first').remove();
    }
  });

  socket.on('draw', function(card) {
    const newCard = $("<div>").addClass("card").attr('id', `${card.img}`);

    const markup = `
      <img src=/cards/${card.img}>
    `;

    $(newCard).append(markup);

    $('.player > .hand').append(newCard)
    hand.push(card);

    const score = $('#score').text();

    if (score >= 5) {
      flip(hand, leftCard, rightCard);
    }
  })

  socket.on('remove', function(removeCard) {
    for (const card in hand) {
      if (hand[card].img === removeCard.img) {
        hand.splice(card, 1);
        $(`#${(removeCard.img).replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" )}`).remove();
      }
    }
  });

  socket.on('win', function(p1, p2) {
    $('#score').prepend(`${p1} `);
    $('#opponentScore').prepend(`${p2} `);

    if (p1 === 'winner') {
      const loser = $('#opponentName').text();
      let game = $('#gamename').text();

      if (game === 'Goofspiel') {
        game = 1;
      } else if (game === 'War') {
        game = 2;
      } else if (game === 'Speed') {
        game = 3;
      }

      $.ajax({
        type: "POST",
        url: "/records",
        data: { winners: [username], losers: [loser], gameId: game },
        success: () => {
        }
      })
        .then(() => {

        })
        .fail((error) => {
          console.log(error.responseJSON.error);
        });
    }
  });

  socket.on('tie', function() {
    const loser = $('#opponentName').text();
    let game = $('#gamename').text();

    if (game === 'Goofspiel') {
      game = 1;
    }

    $.ajax({
      type: "POST",
      url: "/records",
      data: { winners: [], losers: [username, loser], gameId: game },
      success: () => {
      }
    })
      .then(() => {
      })
      .fail((error) => {
        console.log(error.responseJSON.error);
      });
  });

  socket.on('invalid', function() {
    $('#error').text('Invalid Card');
    $('#error').css('visibility', 'visible');
  })

  $('.leftCard').click(() => {
    selected = $('.player > .container').find('.selected').attr('id');
    score = Number($('#score').text());
    let game = $('#gamename').text();

    $('#error').css('visibility', 'hidden');
    if (selected != undefined) {
      if (score <= 5 || hand.length === 5) {
        playCard(socket, selected, hand, leftCard);
      } else if (game === 'Speed') {
        console.log('HERE')
        if (score >= 5 && hand.length < 5) {
          $('#error').text('Draw Card');
          $('#error').css('visibility', 'visible');
        }
      }
    }
  });

  $('.rightCard').click(() => {
    selected = $('.player > .container').find('.selected').attr('id');
    score = Number($('#score').text());
    let game = $('#gamename').text();

    $('#error').css('visibility', 'hidden');
    if (selected != undefined) {
      if (score <= 5 || hand.length === 5) {
        playCard(socket, selected, hand, rightCard);
      } else if (game === 'Speed') {
        console.log('HERE')
        if (score >= 5 && hand.length < 5) {
          $('#error').text('Draw Card');
          $('#error').css('visibility', 'visible');
        }
      }
    }
  });

  $('#draw').click(() => {
    if (hand.length < 5) {
      socket.emit('pickup');
      $('#error').css('visibility', 'hidden');
    }
  })

  $('#confirm').click(() => {
    let game = $('#gamename').text();
    let card;

    let button = $('#confirm').text();

    if (button === 'Start' || button === 'Flip') {
      socket.emit('start');

      $('#confirm').text('Confirm');
      $('#confirm').css('visibility', 'hidden');
    }

    if (button === 'SPEED') {
      socket.emit('inProgress', true)
    }

    if (game === 'Goofspiel') {
      card = $('.player > .container').find('.selected').remove().attr('id');
    } else if (game === 'War') {
      card = $('.player > .container').find('.selected').attr('id');
    }

    if (card) {
      $('#confirm').css('visibility', 'hidden');
      $('#error').css('visibility', 'hidden');
      document.title = "Game";
      socket.emit('turn', Number(card));
    } else if (game !== 'Speed') {
      $('#error').css('visibility', 'visible');
    }
  });

  socket.on('exit', function() {

  });

  $('.player > .hand').click(function() {
    let clicked = $(event.target).parent();
    $('#error').css('visibility', 'hidden');
    if (!clicked.hasClass('selected')) {
      $(".card").removeClass("selected");
      $(clicked).addClass("selected");
    } else {
      $(".card").removeClass("selected");
    }
  });

  $('#exit').click(() => {
    socket.emit('inProgress', undefined, (res) => {
      if (res) {
        const response = confirm("Are you sure you want to leave?");

        if (response) {
          window.location.href = "/";
        }
      } else {
        window.location.href = "/";
      }
    });
  });

  $("#toggle").click(function() {
    $("#smallRecord").toggle()
  });

  window.addEventListener('beforeunload', (event) => {
    socket.emit('left', username);
  });


});
