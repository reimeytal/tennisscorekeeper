const {app, BrowserWindow, ipcMain} = require("electron");

let window;
let game = {
  id:null,
  host:null,
};

app.on("ready", () => {
  window = new BrowserWindow({
    width:1024,
    height:512,
    frame:false,
    webPreferences:{
      nodeIntegration:true
    }
  });
  window.loadFile("./src/index.html");
});

ipcMain.on("loadFile", (event, arg) => {
  window.loadFile(`./src/${arg}`);
});

ipcMain.on("quit", (event, arg) => {
  app.quit();
});

ipcMain.on("setGame", (event, arg) => {
  game = arg;
});

ipcMain.on("getGame", (event, arg) => {
  event.reply("game", game);
});
