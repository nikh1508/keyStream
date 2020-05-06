# Keyboard Emulator

This python script emulates keystrokes on the client's system via keystroke data received from the server. The server receives this data from another client device through a web browser. It works both on the local network as well as over the internet.

> `client-device-2` (browser)	&#8594;	`server`	&#8594;	`client-device-1` (emulator)

For the transmission of data on both sides, SocketIO library is used for WebSocket implementation.

</br>

## Setup

The setup needs to be done on `server` and `client-device-1`.

You need to set up a server first. This server will serve the webpage as well as act as a WebSocket server. This can either be done on a local system or on a cloud server. Some extra steps are required for setup on a cloud server.

To install all the required packages, you must have `pipenv` installed.

You can install the `pipenv` package using pip:

```bash
pip3 install pipenv
```

</br>

### Install necessary packages

This step is common for both `server` and `client-device-1` 

```bash
git clone https://github.com/nikh1508/keyboard_emulator
cd keyboard_emulator
pipenv --python /usr/bin/python3
pipenv install
```

 `.env` file contains the environment variables for this project and needs to be set correctly on both `server` and `client-device-1`. Necessary changes for local network:

- set `SERVER_ADDR` to `http://your-server-ip:8080`
- set `SERVER_PATH` to `/`

</br>

To start the server, make sure in the directory `keyboard_emulator` and then run:

```bash
pipenv run python server/app.py
```

To start the emulator on client system run:

```
pipenv run python client/app.py
```

Now, you can open the webpage `http://server-ip:8080` on any local device.

</br>

### Setting up the server on Cloud

This can be done in many ways depending on your nameserver and web-server. To keep it simple I will explain my exact setup. Setting up a proxy for WebSocket can be difficult if you don't do it correctly. I found the solution <a href="https://github.com/mattermost/mattermost-docker/issues/363#issuecomment-578495685">here</a>.

My setup :

- Cloud Service Provider:  DigitalOcean
- Web Server:  Caddy
- Nameserver:  Cloudflare



Proxy in caddy can be setup in two ways depending on how you want the URL. It can be either of the two options:

- `app.yourdomain.com`
- `www.yourdomain.com/app` or `subdomain.yourdomain.com/app`

</br>

Caddy config for `app.yourdomain.com`:

```
app.yourdomain.com {
	proxy / localhost:8080 {
		except /socket.io
		transparent
	}
	proxy /socket.io localhost:8080 {
		websocket
		transparent
	}
}
```

Necessary changes in `.env` both on `server` and `client-device-1`:

- set `SERVER_ADDR` to `https://app.yourdomain.com`
- set `SERVER_PATH` to `/`

</br>

Caddy config for `www.yourdomain.com/{app}` (change {app} in your case):

```
subdomain.yourdomain.com{
	root /var/www/landing-page
	proxy /{app} localhost:8080 {
					without /{app}
  				except /{app}/socket.io
  }
  proxy /{app}/socket.io localhost:8080 {
  				websocket
 					transparent
   }
}
```

Necessary changes in `.env` both on `server` and `client-device-1`:

- set `SERVER_ADDR` to `https://www.yourdomain.com/app`
- set `SERVER_PATH` to `/app`

</br>

On __Cloudflare__ just change `SSL/TLS encryption mode` to `FULL`in `SSL/TLS` section.

Restart caddy once. And then start the server. Now start the client and you should be able to connect to your server over the internet.



