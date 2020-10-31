document.querySelector("#exit").onclick = () => {
  ipcRenderer.send("quit", null);
};

document.querySelector("#back").onclick = () => {
  ipcRenderer.send("loadFile", "index.html");
};
