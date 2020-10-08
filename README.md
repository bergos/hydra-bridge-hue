# hydra-bridge-hue

[Hydra-Box](https://github.com/zazuko/hydra-box) based bridge to control a Philips Hue Bridge using [Hydra](http://www.hydra-cg.com/).

## Installation

`hydra-bridge-hue` is a [Node.js](https://nodejs.org/en/) application.
Run the following command to install all dependencies:

```bash
npm install
``` 

The `examples` folder contains a script to start the server.
Before you can start it, you need to adapt the `HUE_*` variables.
After that you can start the server using the following command:

```bash
./examples/server.sh
``` 

Now you can find the Hydra API at: [http://localhost:9000/hue/](http://localhost:9000/hue/)

## Example Requests

The `request.sh` script in the `examples` folders contains `curl` commands to change the state of a light or group.
Before you run it, you should adapt the URLs in the script and the arguments in the `examples/data.ttl`. 
Then you can run it with:

```bash
./examples/request.sh
```

## Express Middleware

The package exports a [Express](https://expressjs.com/) middlware, that can be used in other Express applications.
See `server.js` how to use it.
