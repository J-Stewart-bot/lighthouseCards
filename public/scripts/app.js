$(() => {
  $.ajax({
    method: "GET",
    url: "/games"
  }).done((games) => {
    for(game of games.games) {
      $("<div>").text(game.name).appendTo($("body"));
    }
  });;
});
