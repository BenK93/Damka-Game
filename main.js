function createTable() {
  var $game = $("#game");
  var tableBoard = "<table id='board' class='table'>";
  var count = 0;
  // creating table
  for (var i = 0; i < 8; i++) {
    tableBoard += "<tr>";
    for (var j = 0; j < 8; j++) {
      count++;
      var color = "white";
      if (count % 2 == 0) {
        color = "black";
      }
      tableBoard +=
        "<td data-tdid='td" +
        count +
        "' data-number='" +
        count +
        "' id='td-" +
        count +
        "' class='" +
        color +
        "'></td>";
    }
    count++;
    tableBoard += "</tr>";
  }
  tableBoard += "</table>";
  $game.html(tableBoard);
}

function checkers() {
  // var $board = $("#board");
  var count = 0;
  // adding checkers to table
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      count++;
      if (count % 2 == 0) {
        if (count < 28) {
          $("#td-" + count).html(
            "<div data-color='white' class='checker checker-white'></div>"
          );
        } else if (count > 44) {
          $("#td-" + count).html(
            "<div data-color='black' class='checker checker-black'></div>"
          );
        } else {
          $("#td-" + count).addClass("td-clickable");
        }
      }
    }
    count++;
  }
}
// adding and removing yellow border
$(document).on("click", ".checker-clickable", function() {
  if ($(this).hasClass("border")) {
    removeBorder();
  } else {
    removeBorder();
    $(this).addClass("border");
  }
});
function removeBorder() {
  $(".checker-clickable").each(function(index) {
    $(this).removeClass("border");
  });
}
//First Create The Table Game
createTable();
//Put all the checkers on the table
checkers();
$(".checker-white").addClass("checker-clickable");

//Button click to restart the Game
$(document).on("click", ".btn", function() {
  let decs = confirm("Are you sure you want to Restart?");
  if (decs) {
    createTable();
    checkers();
    switCheckers(true);
  }
});
// // 0 - black / 1 - white
// var turn = false;
function switCheckers(turn) {
  if (turn) {
    turn = false;
    $(".checker-white").removeClass("checker-clickable");
    $(".checker-black").addClass("checker-clickable");
  } else {
    turn = true;
    $(".checker-black").removeClass("checker-clickable");
    $(".checker-white").addClass("checker-clickable");
  }
}
function addClickable() {
  $(".black").each(function(index) {
    if ($(this).html().length == 0) {
      if (!$(this).hasClass("td-clickable")) {
        $(this).addClass("td-clickable");
      }
    }
    if ($(this).html().length > 0) {
      if ($(this).hasClass("td-clickable")) {
        $(this).removeClass("td-clickable");
      }
    }
  });
}
function removingEaten(steps, moveTo, moveFrom, boolean) {
  // removing the eaten element
  // boolean true = white , black = false
  if (steps == 16) {
    if (boolean) {
      moveTo -= 8;
    } else {
      moveTo += 8;
    }
    $("#td-" + moveTo)
      .children()
      .remove();
    $("#td-" + moveTo).addClass("td-clickable");
    $("#td-" + moveFrom).addClass("td-clickable");
  } else if (steps == 20) {
    if (boolean) {
      moveTo -= 10;
    } else {
      moveTo += 10;
    }
    $("#td-" + moveTo)
      .children()
      .remove();
    $("#td-" + moveTo).addClass("td-clickable");
    $("#td-" + moveFrom).addClass("td-clickable");
  }
}
function blackMove(steps, moveTo, moveFrom, color) {
  $(".border").hide();
  $("#td-" + moveTo).html(
    "<div data-color='" +
      color +
      "' class='checker checker-" +
      color +
      "'></div>"
  );
  $(".border").remove();
  if (steps > 10) removingEaten(steps, moveTo, moveFrom, false);
  switCheckers(false);
}
function whiteMove(steps, moveTo, moveFrom, color) {
  $(".border").hide();
  $("#td-" + moveTo).html(
    "<div data-color='" +
      color +
      "' class='checker checker-" +
      color +
      "'></div>"
  );
  $(".border").remove();
  if (steps > 10) removingEaten(steps, moveTo, moveFrom, true);
  switCheckers(true);
}
function extraMove(moveTo, moveFrom, color, extraNum) {
  $("#td-" + moveTo).html(
    "<div data-color='" +
      color +
      "' class='checker checker-" +
      color +
      "'></div>"
  );
  $("#td-" + moveTo)
    .children()
    .fadeOut(800, function() {
      $(this).remove();
    });
  $("#td-" + moveTo).addClass("td-clickable");
  $("#td-" + moveFrom).addClass("td-clickable");
  $("#td-" + (moveTo + extraNum)).html(
    "<div data-color='" +
      color +
      "' class='checker checker-" +
      color +
      "'></div>"
  );
  $("#td-" + (moveTo + extraNum)).removeClass("td-clickable");
  $("#td-" + (moveTo + extraNum / 2))
    .children()
    .remove();
  $("#td-" + (moveTo + extraNum / 2)).addClass("td-clickable");
  $("#td-" + moveFrom).addClass("td-clickable");
}

$(document).on("click", ".td-clickable", function() {
  if ($(".checker").hasClass("border")) {
    if ($(this).html().length == 0) {
      // the .html().length == 0 means to check if there is anything with length in that html item (which mean to check if there is anything in there)
      let moveFrom = $(".border")
        .parent()
        .data("number");
      let moveTo = $(this).data("number");
      let stepsBlack = moveFrom - moveTo;
      let stepsWhite = moveTo - moveFrom;
      let color = $(".border").data("color");

      // simple moving forward checkers
      if (
        (stepsBlack == 8 && color == "black") ||
        (stepsBlack == 10 && color == "black")
      ) {
        blackMove(stepsBlack, moveTo, moveFrom, color);
        addClickable();
      } else if (
        (stepsBlack == -8 && color == "white") ||
        (stepsBlack == -10 && color == "white")
      ) {
        whiteMove(stepsWhite, moveTo, moveFrom, color);
        addClickable();
      }

      if (
        stepsBlack == 16 &&
        $("#td-" + (moveTo + 8)).html().length > 0 &&
        $(".border").hasClass("checker-black")
      ) {
        blackMove(stepsBlack, moveTo, moveFrom, color);
        if (
          $("#td-" + (moveTo + 20)).html().length == 0 &&
          $("#td-" + (moveTo + 10)).find("div.checker-white").length != 0
        ) {
          extraMove(moveTo, moveFrom, color, 20);
        } else if (
          $("#td-" + (moveTo - 16)).html().length == 0 &&
          $("#td-" + (moveTo - 8)).find("div.checker-white").length != 0
        ) {
          extraMove(moveTo, moveFrom, color, -16);
        } else if (
          $("#td-" + (moveTo - 20)).html().length == 0 &&
          $("#td-" + (moveTo - 10)).find("div.checker-white").length != 0
        ) {
          extraMove(moveTo, moveFrom, color, -20);
          // 9 18 27 36 45 54 63
        }
        if (
          $("#td-2") === moveTo ||
          $("#td-4") === moveTo ||
          $("#td-6") === moveTo ||
          $("#td-8") === moveTo
        ) {
          $("#td-" + moveTo)
            .children()
            .addClass("queen");
        }

        // eating to the left -- black
      } else if (
        stepsBlack == 20 &&
        $("#td-" + (moveTo + 10)).html().length > 0 &&
        $(".border").hasClass("checker-black")
      ) {
        blackMove(stepsBlack, moveTo, moveFrom, color);
        if (
          $("#td-" + (moveTo + 16)).html().length == 0 &&
          $("#td-" + (moveTo + 8)).find("div.checker-white").length != 0
        ) {
          extraMove(moveTo, moveFrom, color, 16);
        } else if (
          $("#td-" + (moveTo - 16)).html().length == 0 &&
          $("#td-" + (moveTo - 8)).find("div.checker-white").length != 0
        ) {
          extraMove(moveTo, moveFrom, color, -16);
        } else if (
          $("#td-" + (moveTo - 20)).html().length == 0 &&
          $("#td-" + (moveTo - 10)).find("div.checker-white").length != 0
        ) {
          extraMove(moveTo, moveFrom, color, -20);
        }
        // white eating black
      } else if (
        stepsWhite == 20 &&
        $("#td-" + (moveTo - 10)).html().length > 0 &&
        $(".border").hasClass("checker-white")
      ) {
        whiteMove(stepsWhite, moveTo, moveFrom, color);
        if (
          $("#td-" + (moveTo + 20)).html().length == 0 &&
          $("#td-" + (moveTo + 10)).find("div.checker-black").length != 0
        ) {
          extraMove(moveTo, moveFrom, color, 20);
        } else if (
          $("#td-" + (moveTo + 16)).html().length == 0 &&
          $("#td-" + (moveTo + 8)).find("div.checker-black").length != 0
        ) {
          extraMove(moveTo, moveFrom, color, 16);
        } else if (
          $("#td-" + (moveTo - 16)).html().length == 0 &&
          $("#td-" + (moveTo - 8)).find("div.checker-black").length != 0
        ) {
          extraMove(moveTo, moveFrom, color, -16);
        }
      } else if (
        stepsWhite == 16 &&
        $("#td-" + (moveTo - 8)).html().length > 0 &&
        $(".border").hasClass("checker-white")
      ) {
        whiteMove(stepsWhite, moveTo, moveFrom, color);
        if (
          $("#td-" + (moveTo + 20)).html().length == 0 &&
          $("#td-" + (moveTo + 10)).find("div.checker-black").length != 0
        ) {
          extraMove(moveTo, moveFrom, color, 20);
        } else if (
          $("#td-" + (moveTo - 20)).html().length == 0 &&
          $("#td-" + (moveTo - 10)).find("div.checker-black").length != 0
        ) {
          extraMove(moveTo, moveFrom, color, -20);
        } else if (
          $("#td-" + (moveTo + 16)).html().length == 0 &&
          $("#td-" + (moveTo + 8)).find("div.checker-black").length != 0
        ) {
          extraMove(moveTo, moveFrom, color, 16);
        }
      }
    }
  }
});
