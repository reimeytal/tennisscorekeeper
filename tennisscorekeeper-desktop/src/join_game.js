const {ipcRenderer} = require("electron");
const http = require("http");
const {domain, port} = require("../assets/json/info.json");

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#join").onclick = () => {
    const data = JSON.stringify({
      gameid:document.querySelector("#gameid").value
    });

    const options = {
      host:domain,
      port:port,
      path:"/join_game/join/desktop",
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Content-Length":Buffer.byteLength(data)
      }
    };

    const request = http.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data+=chunk;
      });

      response.on("end", () => {
        console.log("End");
        data = JSON.parse(data);
        if(data.success){
            ipcRenderer.send("setGame", {
              gameid:data.gameid,
              host:false
            });
            ipcRenderer.send("loadFile", "score.html");
        } else{
          //Handle if no game found
        }
      });
    });

    request.write(data);
    request.end();
  };
});
