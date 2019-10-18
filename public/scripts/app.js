$(() => {
  $.ajax({
    method: "GET",
    url: "/games"
  }).done((games) => {
    for(game of games.games) {
      $("<div>").addClass(`${game.name.toLowerCase()}`).text(game.name).appendTo($("body"));
    }
    $(`.war`).click(function() {
      window.location.href = '/games/War';
    });

    $(`.goofspiel`).click(function() {
      window.location.href = '/games/Goofspiel';
    });

  });
});
