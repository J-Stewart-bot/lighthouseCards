$(() => {
  $.ajax({
    method: "GET",
    url: "/games"
  }).done((games) => {
    for(game of games.games) {
      $("<div>").addClass(`${game.name.toLowerCase()}`).text(game.name).appendTo($("body"));
    }
    $(`.war`).click(function() {
      console.log('weee');

    });

    $(`.goofspiel`).click(function() {
      console.log('working');

    });

  });
});
