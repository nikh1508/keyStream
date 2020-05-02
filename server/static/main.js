var socket;

console.log("All Set");
////determine keypress | normal keyboard events does not work well on android | ios not tested
var char_counter = 0;
function handle_keypress(e) {
  const text_area = document.getElementById("demo");
  if (e.code != 0 && (e.altkey || e.metakey || e.ctrlkey))
    //special_key+char_key pressed from a browser
    return;
  console.log("handler called");
  const str_now = text_area.value;
  console.log("Length" + str_now.length);
  if (char_counter < str_now.length) {
    console.log("first case");
    while (char_counter < str_now.length) {
      socket.emit("keypress", { char: str_now.charAt(char_counter) });
      char_counter++;
    }
  } else {
    console.log("second case");
    for (var i = 0; i < char_counter - str_now.length; i++)
      socket.emit("keypress", { key: "bs" });
    char_counter = str_now.length;
  }
}
////
function logkey(e) {
  //   console.log(JSON.stringify(e));
  console.log(e);
  //   socket.emit("keypress", JSON.stringify(e));
  socket.emit("keypress", e.key);
}

window.addEventListener("load", () => {
  socket = io("/browser");
  document.getElementById("demo").onkeyup = handle_keypress;
});
