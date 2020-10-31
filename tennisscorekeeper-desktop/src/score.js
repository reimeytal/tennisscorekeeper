const Player = require("./player.js");
const {domain, port} = require("../assets/json/info.json");
const socket = require("socket.io-client")(`http://${domain}:${port}`);
const {ipcRenderer} = require("electron");
const http = require("http");

let infodictionary;
let i;

const player1 = new Player(null);
const player2 = new Player(null);

function setScores(data){
  player1.setScore(data.player1_score);
  player2.setScore(data.player2_score);
  const p1 = document.querySelectorAll(".player1");
  const p2 = document.querySelectorAll(".player2");

  for(i=0;i<p1.length;i++){
    let x = p1[i];
    if(x.dataset.type === "sets"){
      x.innerHTML = player1.sets;
    } else if(x.dataset.type === "games"){
      x.innerHTML = player1.games;
    } else if(x.dataset.type === "points"){
      x.innerHTML = player1.points;
    }
  }

  for(i=0;i<p2.length;i++){
    let x = p2[i];
    if(x.dataset.type === "sets"){
      x.innerHTML = player2.sets;
    } else if(x.dataset.type === "games"){
      x.innerHTML = player2.games;
    } else if(x.dataset.type === "points"){
      x.innerHTML = player2.points;
    }
  }
}

function disconnect(game){
  if(game.host){
    socket.emit("leave", {"id":game.gameid, "isHost":true});
  } else{
    socket.emit("leave", {"id":game.gameid});
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.on("game", (event, g) => {
    const game = g;

    document.querySelector("#exit").onclick = () => {
      disconnect(game);
      ipcRenderer.send("quit", null);
    };

    document.querySelector("#back").onclick = () => {
      disconnect(game);
      ipcRenderer.send("loadFile", "index.html");
    };

    const options = {
      domain:domain,
      port:port,
      method:"GET",
      path:`/game/desktop/${game.gameid}`,
    };

    const request = http.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data+=chunk;
      });

      response.on("end", () => {
        infodictionary = JSON.parse(data);

        player1.name = infodictionary.player1_name;
        player2.name = infodictionary.player2_name;
        document.querySelector("#p1name").innerHTML = infodictionary.player1_name;
        document.querySelector("#p2name").innerHTML = infodictionary.player2_name;

        setScores(infodictionary);
      });
    });
    request.end();

    document.querySelector("#idheader").innerHTML = "Game ID: " + game.gameid.toString();

    if(game.host){
      let ap = document.createElement("th");
      let rp = document.createElement("th");
      ap.innerHTML = "Add point";
      rp.innerHTML = "Remove point";
      document.querySelector("#hdrrow").appendChild(ap);
      document.querySelector("#hdrrow").appendChild(rp);

      let p1apb = document.createElement("button");
      p1apb.classList.add("player_add");
      p1apb.innerHTML = "+";

      p1apb.onclick = () => {
        player1.addPoint(player2);
        socket.emit("host-update", {"id":game.gameid, "player1_score":player1.getScore(), "player2_score":player2.getScore()});
        setScores({"player1_score":player1.getScore(), "player2_score":player2.getScore()});
      };

      document.querySelector("#p1atd").appendChild(p1apb);

      let p2apb = document.createElement("button");
      p2apb.classList.add("player_add");
      p2apb.innerHTML = "+";

      p2apb.onclick = () => {
        player2.addPoint(player1);
        socket.emit("host-update", {"id":game.gameid, "player1_score":player1.getScore(), "player2_score":player2.getScore()});
        setScores({"player1_score":player1.getScore(), "player2_score":player2.getScore()});
      };

      document.querySelector("#p2atd").appendChild(p2apb);

      let p1rpb = document.createElement("button");
      p1rpb.classList.add("player_remove");
      p1rpb.innerHTML = "-";

      p1rpb.onclick = () => {
        player1.removePoint();
        socket.emit("host-update", {"id":game.gameid, "player1_score":player1.getScore(), "player2_score":player2.getScore()});
        setScores({"player1_score":player1.getScore(), "player2_score":player2.getScore()});
      };

      document.querySelector("#p1rtd").appendChild(p1rpb);

      let p2rpb = document.createElement("button");
      p2rpb.classList.add("player_remove");
      p2rpb.innerHTML = "-";

      p2rpb.onclick = () => {
        player2.removePoint();
        socket.emit("host-update", {"id":game.gameid, "player1_score":player1.getScore(), "player2_score":player2.getScore()});
        setScores({"player1_score":player1.getScore(), "player2_score":player2.getScore()});
      };

      document.querySelector("#p2rtd").appendChild(p2rpb);
    }
  });

  ipcRenderer.send("getGame", null);
});
