from flask import Flask, redirect, request, render_template, session, url_for, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room
import os

#close room disconnects everyone from room

app = Flask(__name__)
socket = SocketIO(app)
app.config["SECRET_KEY"] = os.urandom(30)

games = [None, None, None, None, None, None, None, None, None, None]

class Game:
    def __init__(self, player1, player2, id):
        self.id = id
        self.infodictionary = {"player1_name":player1, "player1_score":["0", "0", "0"], "player2_name":player2, "player2_score":["0", "0", "0"]}

@app.route("/")
def index():
    return render_template("index.html", session=session)

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
            games[gameid] = game
            session["host"] = gameid
            return redirect(url_for('game', id=game.id))
    return "No game slot available" #Handle later

@app.route("/create_game/post/desktop", methods=["POST"])
def create_game_post_desktop():
    for gameid, game in enumerate(games):
        if game == None:
            game = Game(request.get_json()["player1"], request.get_json()["player2"], gameid)
            games[gameid] = game
            return jsonify({"success":True, "gameid":gameid})
    return jsonify({"success":False, "reason":"Too many games"})

@app.route("/game/<id>")
def game(id):
    if "host" in session:
        if int(id) == session["host"]:
            return render_template("score.html", host=True, game=games[int(id)])
    else:
        return render_template("score.html", host=False, game=games[int(id)])

@app.route("/game/desktop/<id>")
def game_desktop(id):
    for game in games:
        if game != None:
            if game.id == int(id):
                return jsonify(game.infodictionary)
    return jsonify({"success":False})

@socket.on("host-update")
def update(data):
    p1 = data["player1_score"]
    p2 = data["player2_score"]
    games[int(data["id"])].infodictionary["player1_score"] = p1
    games[int(data["id"])].infodictionary["player2_score"] = p2
    emit("update", {"player1_score":p1, "player2_score":p2}, room=data["id"])

#Handling join game

@app.route("/join_game")
def join_game():
    return render_template("join_game.html")

@app.route("/join_game/join", methods=["POST"])
def join_game_post():
    id = request.form.get("gameid")
    try:
        if games[int(id)] != None:
                return redirect(url_for("game", id=id))
    except IndexError:
        pass
    return "Invalid game ID" #Handle invalid game id

@app.route("/join_game/join/desktop", methods=["POST"])
def join_game_post_desktop():
    id = request.get_json()["gameid"]
    try:
        if games[int(id)] != None:
                return jsonify({"success":True, "gameid":id})
    except IndexError:
        pass
    return jsonify({"success":False})

@app.route("/del")
def delete():
    del session["host"]
    return jsonify({"success":True})

@socket.on("leave")
def lv(data):
    if "host" in session:
        if str(session["host"]) == str(data["id"]):
            games[int(data["id"])] = None
            close_room(str(data["id"]))
        else:
            leave_room(str(data["id"]))
    elif "isHost" in data:
        games[int(data["id"])] = None
        close_room(str(data["id"]))
    else:
        leave_room(str(data["id"]))

@socket.on("jr")
def join_r(data):
    join_room(str(data["id"]))

if __name__ == "__main__":
    app.run(debug=True)
