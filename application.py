from flask import Flask, redirect, request, render_template
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
socket = SocketIO(app)

games = [None, None, None, None, None, None, None, None, None, None]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/create_game")
def create_game():
    #return render_template("create_game.html")
    return "create game"

@app.route("/join_game")
def join_game():
    #return render_template("join_game.html")
    return "join game"
