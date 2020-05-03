from pynput.keyboard import Key, Controller
import socketio

sio = socketio.Client()
keyboard = Controller()


@sio.event
def connect():
    print('Connection established')


@sio.event
def disconnect():
    print('Disconnected from server')


@sio.on('keypress', namespace='/client')
def handle_keypress(data):
    print('recvd:', data)
    if data == None or not isinstance(data, dict):
        print(type(data))
        return
    if 'key' in data.keys():
        if data['key'] == 'bs':
            keyboard.press(Key.backspace)
    elif 'char' in data.keys():
        if data['char'] == '\n':
            keyboard.press(Key.enter)
        else:
            keyboard.press(data['char'])


# sio.connect('https://nikhilkr.com', namespaces=['/client'])
sio.connect('http://localhost:8080', namespaces=['/client'])
sio.wait()
