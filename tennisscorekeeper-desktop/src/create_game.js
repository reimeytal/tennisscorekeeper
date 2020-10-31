const {ipcRenderer} = require("electron");
const http = require("http");
const {domain, port} = require("../assets/json/info.json");

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#submit").onclick = () => {

    const data = JSON.stringify({
      player1:document.querySelector("#player1").value,
      player2:document.querySelector("#player2").value
    });

    const options = {
      host:domain,
      port:port,
      path:"/create_game/post/desktop",
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Content-Length":Buffer.byteLength(data)
      }
    };

    const request = http.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data+=chunk
      });

      response.on("end", () => {
        console.log("End");
        data = JSON.parse(data);
        if(data.success){
            ipcRenderer.send("setGame", {
              gameid:data.gameid,
              host:true
            });
            ipcRenderer.send("loadFile", "score.html");
        } else{
          //Handle if game cannot be created
        }
      });
    });

    request.write(data);
    request.end();
  };
});
