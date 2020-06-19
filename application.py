from flask import Flask, redirect, request, render_template, session, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room

#close room disconnects everyone from room

app = Flask(__name__)
print("App:", app)
socket = SocketIO(app)
app.config["SECRET_KEY"] = 'secret-key'

games = [None, None, None, None, None, None, None, None, None, None]

class Game:
    def __init__(self, player1, player2, id):
        self.id = id
        self.infodictionary = {"player1_name":player1, "player1_score":["0", "0", "0"], "player2_name":player2, "player2_score":["0", "0", "0"]}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/create_game")
def create_game():
    return render_template("create_game.html")

@app.route("/create_game/post", methods=["POST"])
def create_game_post():
    if "host" in session:
        return "Already hosting a game" #Handle later
    for gameid, game in enumerate(games):
        if game == None:
            game = Game(request.form.get("player1"), request.form.get("player2"), gameid)
            session["host"] = gameid
            break
    else:
        return "No game slot available" #Handle later
    return None

@app.route("/game/<id>")
def game(id):
    if int(id) == session["host"]:
        return render_template("score.html", host=True, game=games[int(id)])
    else:
        return render_template("score.html", host=False, game=games[int(id)])

@socketio.on("host-update")
def update(data):
    p1 = data["player1_score"]
    p2 = data["player2_score"]
    games[int(data["id"])].infodictionary["player1_score"] = p1
    games[int(data["id"])].infodictionary["player2_score"] = p2
    emit("update", {"player1_score":p1, "player2_score":p2}, room=data["id"])

#Handling join game
'''
@socketio.on("joingame")
def join(data):
    r = data["room"]
    join_room(r)
'''

@app.route("/join_game")
def join_game():
    return render_template("join_game.html")
    #join_game.html will redirect user to join_game_post. The socket will activate in join_game.html

@app.route("/join_game/join", methods=["POST"])
def join_game_post():
    id = request.form.get("id")
    join_room(str(id))
    return redirect(url_for("game", id=id))
