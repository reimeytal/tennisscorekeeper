class Player{
  constructor(name){
    this.name = name;
    this.points = "0";
    this.games = 0;
  }
  //Add set check and win check
  addPoint(player2){
    if(this.points == "0"){
      this.points = "15";
    } else if(this.points == "15"){
      this.points = "30";
    } else if(this.points  == "30"){
      this.points == "40";
    } else if(this.points == "40"){
      if (player2.points != "40"){
        this.points = "0";
        this.games++;
      } else{
        this.points = "Adv";
        player2.points = "40";
      }
    } else if(this.points == "Adv"){
      this.points = "0";
      this.games++;
    }
  }
  //Add remove point
  removePoint(){
    return null;
  }
}
