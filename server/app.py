from flask import Flask, render_template
from flask_socketio import SocketIO
import os
import logging

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)
path = os.environ['SERVER_PATH']

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins='*',
                    path=path if path != '/' else 'socket.io')

client_connected = False


@app.route('/')
def index():
    return render_template('index.html', path=path if path != '/' else '')


@socketio.on('connect', namespace='/client')
def new_client():
    global client_connected
    print('Client Connected.')
    client_connected = True
    socketio.emit('client_connect', '', namespace='/browser')


@socketio.on('disconnect', namespace='/client')
def client_disconnected():
    global client_connected
    print('Client Disconnected.')
    client_connected = False
    socketio.emit('client_disconnect', '', namespace='/browser')


@socketio.on('connect', namespace='/browser')
def new_browser():
    if client_connected:
        socketio.emit('client_connect', '', namespace='/browser')


@socketio.on('keypress', namespace='/browser')
def on_keypress(msg):
    print('New Message:', msg)
    socketio.emit('keypress', msg, namespace='/client')


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=int(os.environ['PORT']))
