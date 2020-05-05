# Keyboard Emulator

This python script emulates keystrokes on the client's system via keystroke data received from server. The server receives this data from another client device through a web-browser. It works both on the local network as well as over the internet.

> `client-device-2` (browser)	&#8594;	`server`	&#8594;	`client device-1` (emulator)

For the transmission of data on both sides SocketIO library is used for websocket implementation.



## Setup

The setup needs to be done on `server` and `client device-1`.

You need to setup a server first. This server will server the webpage as well as act as a websocket server. This can either be done on a local system or on a cloud server. Some extra steps are required for setup on a cloud server.

In order to install all the required packages you must have `pipenv` installed.

You can install the `pipenv` package using pip:

```bash
pip3 install pipenv
```



### Install necessary packages

This step is common for both `server` and `client-device-1` 

```bash
git clone https://github.com/nikh1508/keyboard_emulator
cd keyboard_emulator
pipenv --python /usr/bin/python3
pipenv install
```



To start the server, make sure in the directory `keyboard_emulator` and then run:

```bash
pipenv run python server/app.py
```



<p>In file client/app.py change http://localhost:8080 to http://server-ip:8080. </br>Then to start the client run:</p>

```
pipenv run python client/app.py
```

Now, you can open the webpage `http://server-ip:8080` on any local device.



### Setting up server on Cloud

This can be done in many ways dependig on your nameserver and web-server. To keep it simple I will expain my exact setup. Setting up proxy for websocket can be difficult if you don't do it correctly. I found the solution <a href="https://github.com/mattermost/mattermost-docker/issues/363#issuecomment-578495685"> here</a>.

My setup :

- Cloud Service Provider :  DigitalOcean
- Web Server :   Caddy
- Nameserver :   Cloudflare



Proxy in caddy can be setup in two ways depending on how you want the url. It can be either of the two options:

- app.yourdomain.com
- www.yourdomain.com/app or subdomain.yourdomain.com/app

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

In file `client/app.py` change `http://localhost:8080/` to `https://app.yourdomain.com`. And then start the client.



Caddy config for `www.yourdomain.com/app`:

```
subdomain.yourdomain.com{
	root /var/www/landing-page
}
```





