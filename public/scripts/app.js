$(() => {
  $.ajax({
    method: "GET",
    url: "/games"
  }).done((games) => {
    for (const game of games.games) {
      let button = $("<button>").addClass(`${game.name.toLowerCase()} btn btn-dark game`).text(game.name).appendTo($("body"));
      $(".gameList").append(button);
    }

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
