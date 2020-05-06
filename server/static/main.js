var socket;

console.log("All Set");
////determine keypress | normal keyboard events does not work well on android | ios not tested
var char_counter = 0;
function handle_keypress(e) {
  const text_area = document.getElementById("demo");
  if (e.code != 0 && (e.altkey || e.metakey || e.ctrlkey))
    //special_key+char_key pressed from a browser
    return;
  console.log("keypress handler called");
  const str_now = text_area.value;
  if (char_counter < str_now.length) {
    console.log("Text length increased");
    while (char_counter < str_now.length) {
      socket.emit("keypress", { char: str_now.charAt(char_counter) });
      char_counter++;
    }
  } else {
    console.log("Text length decreased");
    for (var i = 0; i < char_counter - str_now.length; i++)
      socket.emit("keypress", { key: "bs" });
    char_counter = str_now.length;
  }
}
////

function change_conn_status(is_connected) {
  if (is_connected) {
    document.getElementById("client-status").innerHTML = "Connected";
    document.getElementById("client-status").style.color = "#174a02";
  } else {
    document.getElementById("client-status").innerHTML = "Not Connected";
    document.getElementById("client-status").style.color = "rgb(239, 74, 56)";
  }
}

window.addEventListener("load", () => {
  const path =
    window.location.pathname === "/"
      ? "/socket.io"
      : window.location.pathname + "/socket.io";
  socket = io("/browser", {
    path: path,
  });
  socket.on("connect", () => {
    console.log("Connected to server.");
    socket.on("client_connect", (data) => {
      console.log("Event occured - Client connected");
      change_conn_status(true);
    });
    socket.on("client_disconnect", (data) => {
      console.log("Event occured - Client disconnected");
      change_conn_status(false);
    });
  });
  document.getElementById("demo").onkeyup = handle_keypress;
});
