class Player{
  constructor(name){
    this.name = name;
    this.points = "0";
    this.games = 0;
    this.sets = 0;
    this.tiebreaker = false;
    this.win = false;
  }
  addPoint(player2){
    if(!this.tiebreaker){
      if(this.points == "0"){
        this.points = "15";
      } else if(this.points == "15"){
        this.points = "30";
      } else if(this.points  == "30"){
        this.points = "40";
      } else if(this.points == "40"){
        if(player2.points == "Adv"){
          this.points = "40";
          player2.points = "40";
        } else if (player2.points != "40"){
          this.points = "0";
          player2.points = "0";
          this.games++;
          if(this.games == 6 && player2.games <= 4){
            this.sets++;
            this.games = 0;
            player2.games = 0;
            if (this.sets == 3){
              this.win = true;
            }
          } else if(this.games == 7 && player2.games == 5){
            this.sets++;
            this.games = 0;
            if (this.sets == 3){
              this.win = true;
            }
            player2.games = 0;
          } else if(this.games == 6 && player2.games == 6){
            this.tiebreaker = true;
            player2.tiebreaker = true;
          }
        } else if(player2.points == "40"){
          this.points = "Adv";
          player2.points = "40";
        }
      } else if(this.points == "Adv"){
        this.points = "0";
        player2.points = "0";
        this.games++;
        if(this.games == 6 && player2.games <= 4){
          this.sets++;
          this.games = 0;
          player2.games = 0;
          if (this.sets == 3){
            this.win = true;
          }
        } else if(this.games == 7 && player2.games == 5){
          this.sets++;
          this.games = 0;
          player2.games = 0;
          if (this.sets == 3){
            this.win = true;
          }
        } else if(this.games == 6 && player2.games == 6){
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
          this.tiebreaker = false;
          if (this.sets == 3){
            this.win = true;
          }
        } else{
          this.points++
        }
      }
    }
  }
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
  getScore(){
    return [this.sets.toString(), this.games.toString(), this.points.toString(), this.win];
  }
  setScore(score){
    this.sets = score[0];
    this.games = score[1];
    this.points = score[2];
  }
}
