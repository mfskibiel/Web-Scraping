$(document).ready(function() {
  console.log("good to go");
  $.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      //display articles on page
      $("#results").append(
        '<li data-id="' +
          data[i]._id +
          '"><a class = "links" href= "' +
          data[i].link +
          '</a><div class="caption"><h3>' +
          data[i].title +
          "</h3></div></li>"
      );
    }
  });
});

$(document).on("click", ".btn", function() {
  var buttonid = $(this).attr("id");
  console.log(buttonid);
  if (buttonid === "add-note") {
    var thisId = $(this).attr("value");

    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    }).done(function(data) {
      console.log(data);
      $("#modalTitle").text(data.title);
      $("#save-note").attr("data-id", thisId);
      $("#note-text").attr("data-id", thisId);

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
        $("#note-text")
          .attr("data-id", thisId)
          .text("note added");
      }
    });
  } else if (buttonid === "save-note") {
    var saveId = $(this).attr("data-id");
    console.log(saveId);

    $.ajax({
      method: "POST",
      url: "/articles/" + saveId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val(),
        timestamp: Date.now()
      }
    }).done(function(data) {
      $("#note-text")
        .attr("data-id", this.Id)
        .text("note saved");
    });
  }
});
