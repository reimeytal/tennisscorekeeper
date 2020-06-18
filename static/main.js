function score(p1, p2){
  return {"player1_score":p1, "player2_score":p2};
}
function initialize_game(player1Name,  player2Name){
  var player1  = new Player(player1Name);
  var player2 = new Player(player2Name);
  document.addEventListener("DOMContentLoaded", ()=>{
    const sock= io.connect(location.protocol+"//"+document.domain+":"+location.port);
    addButtons = document.querySelectorAll("#player_add");
    removeButtons = document.querySelectorAll("#player_remove");
    let i;
    for(i=0; i<addButtons.length; i++){
      let button = addButtons[i];
      button.onclick = () => {
        if(button.dataset.player  == "1"){
          player1.addPoint(player2);
        } else{
          player2.addPoint(player1);
        }
        sock.emit("host-update", score(player1.getScore(), player2.getScore()));
      }
    }
    for(i=0;i<remvoveButtons.length;i++){
      let button = removeButtons[i];
      button.onclick = () =>{
        if(button.dataset.player== "1"){
          player1.removePoint();
        } else{
          player2.removePoint();
        }
        sock.emit("host-update", score(player1.getScore(), player2.getScore()));
      }
    }
  });
}
