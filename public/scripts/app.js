$(() => {
  const socket = io();


  $.ajax({
    method: "GET",
    url: "/games"
  }).done((games) => {
    for (const game of games.games) {
      let button = $("<button>").addClass(`${game.name.toLowerCase()} btn btn-dark game`).text(game.name);
      let waiting = $("<span>").addClass('wait badge badge-light').text('0');

      button.append(waiting);

      socket.emit('waiting', game.name)

      $(".gameList").append(button);
    }

    socket.on('wait', function(numberWaiting, gameName) {
      $(`.${gameName.toLowerCase()} > span`).text(numberWaiting);
    });

    const username = $("#username").text();
    $(`.war`).click(function() {
      if (username) {
        window.open('/games/war');
      } else {
        $('#logginError').css('visibility', 'visible');
      }
    });

    $(`.goofspiel`).click(function() {
      if (username) {
        window.open('/games/goofspiel');
      } else {
        $('#logginError').css('visibility', 'visible');
      }
    });

    $(`.speed`).click(function() {
      if (username) {
        window.open('/games/speed');
      } else {
        $('#logginError').css('visibility', 'visible');
      }
    });

    $('#login').click(function() {
      $('#logginError').css('visibility', 'hidden');
    });
  });
});
