$(() => {
  $.ajax({
    method: "GET",
    url: "/games"
  }).done((games) => {
    for (const game of games.games) {
      $("<button>").addClass(`${game.name.toLowerCase()} btn btn-outline-info game`).text(game.name).appendTo($("body"));
    }
    $(`.war`).click(function() {
      window.open('/games/war');
    });

    $(`.goofspiel`).click(function() {
      window.open('/games/goofspiel');
    });

    $(`.speed`).click(function() {
      window.open('/games/speed');
    });

  });
});
