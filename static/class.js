//Add win check and handling
class Player{
  constructor(name){
    this.name = name;
    this.points = "0";
    this.games = 0;
    this.sets = 0;
    this.tiebreaker = false;
  }
  addPoint(player2){
    if(!this.tiebreaker){
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
          if(this.games == 6 && player2.games <= 4){
            this.sets++;
            this.games = 0;
          } else if(this.games == 7 && player2.games == 5){
            this.sets++;
            this.games = 0;
          } else{
            this.tiebreaker = true;
            player2.tiebreaker = true;
          }
        } else if(player2.points == "40"){
          this.points = "Adv";
          player2.points = "40";
        } else if(player2.points == "Adv"){
          this.points = "40";
          player2.points = "40";
        }
      } else if(this.points == "Adv"){
        this.points = "0";
        this.games++;
        if(this.games == 6 && player2.games <= 4){
          this.sets++;
          this.games = 0;
        } else if(this.games == 7 && player2.games == 5){
          this.sets++;
          this.games = 0;
        } else{
          this.tiebreaker = true;
          player2.tiebreaker = true;
          this.points = 0;
          player2.points = 0;
        }
      }
    } else{
      if(this.points < 7){
        this.points++;
      }  else{
        if(this.points-player2.points >= 2){
          this.sets++;
          this.games = 0;
          this.points = "0";
        } else{
          this.points++
        }
      }
    }
  }
  //Potential tiebreaker bug
  removePoint(){
    if(!this.tiebreaker){
      if(this.points == "Adv"){
        this.points = "40";
      } else if(this.points == "40"){
        this.points = "30";
      } else if(this.points == "30"){
        this.points = "15";
      } else if(this.points == "15"){
        this.points = "0";
      }
    } else{
      this.points--;
    }
  }
}
