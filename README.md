##The Melting Pot
An application template with the following components:

* html based front end
* node.js back end
* websockets as the communication channel between font and back end

The purpose is to allow rapid development of a web based client, utilising encapsulated protocol 
extensions to remove the pain of a typical thin client / websocket style application. This allows 
the developer to focus on the front end design and back end logic without worrying about 
communications and the framework to support the server.

##Features

* javascript library to provide complete comms for a html page
* all comms is pure websockets
* extensible modular message protocol, allowing encapuslation of message logic on a per entity basis

##Quick Start

- Install client dependancies via [Bower](http://bower.io): `bower install meltingpot`
- Install server via [NPM](http://www.npmjs.org/): `npm install meltingpot`

OR 

- Clone the repository: `git clone https://github.com/jamesjenner/meltingpot.git`

##Usage

Use the git repository as a template for a new application you can either clone the respository or install the client via bower and the server via npm (see quick start). 

To extend the protocol refer to `shared/panel.js` and `panelHandler.js` examples. The `testClient.html` will run in a cloned environment, utilising the panel extension example.  

##Key Components

Client side:

* testClient.html - an exmaple web client, presumption is bower and npm used to install packages
* panelHandler.js - an example protocol handler extension for the server (defines server logic for the entity)
* shared/panel.js - an example protocol extension
* server.js - javascript lib for the web client to connect to the server
* shared/message.js  - javascript protocol lib shared between client and server 

Server side:

* application.js - an example node.js server
* meltingpot.js - node js module, exposes comms.js and shared/message.js

##Example

Use `application.js` to run an example server, meltingpot and associated dependancies will need to be installed via `npm`. 

To run the example application use the following:

    node application.js --debug

Use `testClient.html` to run an example client, meltingpot will need to be installed via `bower`. 
In addition, the following files will be required:

* panelHandler.js
* shared/panel.js

Open `testClient.html` in a browser to run the client. When it first runs it will attempt to connect to the server on the localhost.
If the server is running, then you can choose the buttons to send messages back and forth to the server.

The example will create `panels.json` file in the same directory that `application.js` is running. The add and delete buttons in the client
will result in updates to the `panels.json` file by the server.
Closing and reopening the `testClient.html` will reconnect to the server and retreive whatever information is within the `panels.json` file.

##Node Dependancies

* opt `npm install opt`
* websocket `npm install websocket`
* node-uuid `npm install node-uuid`
* bcrypt/bcryptjs, use bcryptjs on windows `npm install bcryptjs`, bcrypt on linux `npm install bcrypt`

To install all dependancies, use the following command that is appropriate.

* Linux: `npm install opt websocket node-uuid bcrypt`
* Windows: `npm install opt websocket node-uuid bcryptjs`

##Notes

* Interfaces are subject to change until version 1.0
* Communications is not secure by default
* The client will connect to the local host by default, using port 9007
* A user will be created automatically
* All methods that start with underscore are subject to change
* server.DEFAULT_PROTOCOL defines the default protocol for the client, the server is currently hardcoded inline

##To Do

* Move protocol definition (used in websocket connection negotiation) to central point
* Decide on debug/log options
* Complete authentication
* Improve user logic (add options to remove/add/change pwd, etc)
* Introduce default administrator
* Incorporate user based privlages for data message types
* Move User logic into seperate js (currently in comms.js)
* Investigate breaking up comms.js
* Add logic for update to the panel example

##History

19 July 2015: Added auto reconnect option to server.js. The client will automatically connect/reconnect when set to true.

##License (MIT)

Copyright (c) 2014 James Jenner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
