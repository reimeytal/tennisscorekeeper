function score(id, p1, p2){
  return {"id":id, "player1_score":p1, "player2_score":p2};
}
function initialize_game(id, player1Name,  player2Name){
  console.log("init");
  var player1  = new Player(player1Name);
  var player2 = new Player(player2Name);
  console.log("cl");
  const sock = io.connect(location.protocol+"//"+document.domain+":"+location.port);
  document.addEventListener("DOMContentLoaded", () => {
    addButtons = document.querySelectorAll(".player_add");
    console.log(addButtons);
    removeButtons = document.querySelectorAll(".player_remove");
    let i;
    for(i=0; i<addButtons.length; i++){
      console.log("add");
      let button = addButtons[i];
      button.onclick = () => {
        console.log("add", button.dataset.player);
        if(button.dataset.player  == "1"){
          player1.addPoint(player2);
        } else{
          player2.addPoint(player1);
        }
        sock.emit("host-update", score(id, player1.getScore(), player2.getScore()));
      }
    }
    for(i=0;i<removeButtons.length;i++){
      console.log("rms");
      let button = removeButtons[i];
      button.onclick = () =>{
        console.log("remove", button.dataset.player);
        if(button.dataset.player== "1"){
          player1.removePoint();
        } else{
          player2.removePoint();
        }
        sock.emit("host-update", score(id, player1.getScore(), player2.getScore()));
      }
    }
    sock.on("update", (data) => {
      player1.setScore(data["player1_score"]);
      player2.setScore(data["player2_score"]);
      //Player 1 text for loop
      p1 = document.querySelectorAll(".player1");
      for(i=0; i<p1.length; i++){
        let x = p1[i];
        if(x.dataset.type == "sets"){
          x.innerHTML = player1.sets;
          console.log(player1.sets);
        } else if(x.dataset.type == "games"){
          x.innerHTML = player1.games;
          console.log(player1.games);
        } else if(x.dataset.type == "points"){
          x.innerHTML = player1.points;
          console.log(player1.points);
        }
      }
      p2 = document.querySelectorAll(".player2");
      for(i=0; i<p2.length; i++){
        let x = p2[i];
        if(x.dataset.type == "sets"){
          x.innerHTML = player2.sets;
        } else if(x.dataset.type == "games"){
          x.innerHTML = player2.games;
        } else if(x.dataset.type == "points"){
          x.innerHTML = player2.points;
        }
      }
    });
    sock.on('connect', ()=>{
      sock.emit("jr", {"id":id.toString()});
    })
    /*
    window.onunload = () => {
      location.href = location.protocol+"//"+document.domain+":"+location.port+"/del/"+id.toString();
      sock.emit("lr", {"id":id});
    }
    */
  });
}
