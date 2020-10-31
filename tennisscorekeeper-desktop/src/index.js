const {ipcRenderer} = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#create-game").onclick  = () => {
    ipcRenderer.send("loadFile", "create_game.html");
  };
  document.querySelector("#join-game").onclick = () => {
    ipcRenderer.send("loadFile", "join_game.html");
  };
});
