/*global console, window, WebSocket, Message, Panel */
/*
 * server.js
 *
 * Copyright (c) 2014 James G Jenner
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var COMMS_SECURITY_SECURE_AND_UNSECURE = 'Secure and Unsecure';
var COMMS_SECURITY_SECURE_ONLY = 'Secure Only';
var COMMS_SECURITY_UNSECURE_ONLY = 'Unsecure Only';

var SERVER_KEY = 'Server';
var DEFAULT_ADDRESS = 'localhost';
var DEFAULT_PORT = '9007';
var DEFAULT_SECURE_PORT = '9008';
var DEFAULT_PROTOCOL = 'meltingpot_0.1';
var DEFAULT_USER_ID = 'user';
var DEFAULT_COMMS_SECURITY = COMMS_SECURITY_UNSECURE_ONLY;

/*
 * Server manager for html based clients connecting to a node based server
 */
var Server = function (options) {
  options = options || {};

  this.position = options.position || 0;

  this.name = options.name || "Server";
  this.address = options.address || DEFAULT_ADDRESS;
  this.port = options.port || DEFAULT_PORT;
  this.securePort = options.securePort || DEFAULT_SECURE_PORT;
  this.protocol = options.protocol || DEFAULT_PROTOCOL;
  this.userId = options.userId || DEFAULT_USER_ID;
  this.password = options.password || '';
  this.rememberPassword = options.rememberPassword || false;
  this.commsSecurity = options.commsSecurity || DEFAULT_COMMS_SECURITY;
  this.isConnected = false;

  this.rcvdUnsupportedMessage = options.rcvdUnsupportedMessage || function () {};
  this.connectionListener = options.connectionListener || function () {};
  this.disconnectionListener = options.disconnectionListener || function () {};
  this.errorListener = options.errorListener || function () {};

  this.messageHandlers = (options.messageHandlers !== null && options.messageHandlers !== undefined) ? options.messageHandlers : [];
  
//  this.rcvdAddPanel = options.rcvdAddPanel || this.rcvdUnsupportedMessage;
//  this.rcvdPanels = options.rcvdPanels || this.rcvdUnsupportedMessage;
//  this.rcvdDeletePanel = options.rcvdDeletePanel || this.rcvdUnsupportedMessage;
//  this.rcvdUpdatePanel = options.rcvdUpdatePanel || this.rcvdUnsupportedMessage;

  this.log = options.log || false;

  this.unsecureConnection = {};
  this.secureConnection = {};
};

Server.prototype.load = function (obj) {
  this.position = obj.position || 0;
  this.name = obj.name || "Server";
  this.address = obj.address || DEFAULT_ADDRESS;
  this.port = obj.port || DEFAULT_PORT;
  this.securePort = obj.securePort || DEFAULT_SECURE_PORT;
  this.protocol = obj.protocol || DEFAULT_PROTOCOL;
  this.userId = obj.userId || DEFAULT_USER_ID;
  this.password = obj.password || '';
  this.rememberPassword = obj.rememberPassword || false;
  this.commsSecurity = obj.commsSecurity || DEFAULT_COMMS_SECURITY;
  this.log = obj.log || false;
};

Server.prototype.connect = function () {
  if (this.log) {
    console.log(this.name + " webSocket connect " + this.address + ":" + this.securePort + " " + this.protocol);
  }

  this.secureOnly = this.commsSecurity === COMMS_SECURITY_SECURE_ONLY;
  this.unsecureOnly = this.commsSecurity === COMMS_SECURITY_UNSECURE_ONLY;
  this.secureAndUnsecure = this.commsSecurity === COMMS_SECURITY_SECURE_AND_UNSECURE;

  if (this.secureOnly || this.secureAndUnsecure) {
    this.connectSecure();
  } else {
    this.connectUnsecure();
  }
};

Server.prototype.connectSecure = function () {
  if (this.log) {
    console.log(this.name + " webSocket secure connect " + this.address + ":" + this.securePort + " " + this.protocol);
  }

  if (window.WebSocket !== undefined) {
    if (this.secureConnection.readyState === undefined || this.secureConnection.readyState > 1) {

      this.secureConnection = new WebSocket('wss://' + this.address + ':' + this.securePort, this.protocol);

      var self = this;

      this.secureConnection.binaryType = "arraybuffer";
      this.secureConnection.onopen = function (e) {
        self.openSecureEvent(e);
      };
      this.secureConnection.onmessage = function (e) {
        self.messageEvent(e);
      };
      this.secureConnection.onclose = function (e) {
        self.closeSecureEvent(e);
      };
      this.secureConnection.onerror = function (e) {
        self.errorEvent(e);
      };
    }
  }
};

Server.prototype.connectUnsecure = function () {
  if (this.log) {
    console.log(this.name + " webSocket unsecure connect " + this.address + ":" + this.port + " " + this.protocol);
  }
  if (window.WebSocket !== undefined) {
    if (this.unsecureConnection.readyState === undefined || this.unsecureConnection.readyState > 1) {

      this.unsecureConnection = new WebSocket('ws://' + this.address + ':' + this.port, this.protocol);

      var self = this;

      this.unsecureConnection.binaryType = "arraybuffer";
      this.unsecureConnection.onopen = function (e) {
        self.openUnsecureEvent(e);
      };
      this.unsecureConnection.onmessage = function (e) {
        self.messageEvent(e);
      };
      this.unsecureConnection.onclose = function (e) {
        self.closeUnsecureEvent(e);
      };
      this.unsecureConnection.onerror = function (e) {
        self.errorEvent(e);
      };
    }
  }
};

Server.prototype.disconnect = function () {
  if (this.unsecureConnected) {
    this.unsecureConnection.close();
  }
  if (this.secureConnected) {
    this.secureConnection.close();
  }
};

Server.prototype.openSecureEvent = function (event) {
  // note that we cannot fire the connectionListener event yet, as we don't know if the connection has been accepted based on the messaging protocol
  if (this.log) {
    console.log(this.name + " webSocket secure open " + this.address + ":" + this.securePort + " " + this.protocol);
  }
  this.secureConnected = true;
  this.authenticated = false;


  // setup the authenticate object
  if (this.secureOnly) {
    this.sendAuthentication(Message.COMMS_TYPE_SECURE_ONLY);
  } else {
    this.sendAuthentication(Message.COMMS_TYPE_MIXED);
  }
};

Server.prototype.openUnsecureEvent = function (event) {
  // note that we cannot fire the connectionListener event yet, as we don't know if the connection has been accepted based on the messaging protocol
  if (this.log) {
    console.log(this.name + " webSocket unsecure open " + this.address + ":" + this.port + " " + this.protocol);
  }
  this.unsecureConnected = true;

  if (this.secureAndUnsecure) {
    var sessionDetails = {};
    sessionDetails.sessionId = this.sessionId;
    this.sendUnsecureMessage(Message.SESSION, sessionDetails);
  } else {
    this.authenticated = false;
    // must be unsecure only, send authentication
    this.sendAuthentication(Message.COMMS_TYPE_UNSECURE_ONLY);
  }
};

Server.prototype.sendAuthentication = function (connectionType) {
  var authDetails = {};

  authDetails.userId = this.userId;
  authDetails.password = this.password;
  authDetails.connectionType = connectionType;

  this.sendMessage(Message.AUTHENTICATE, authDetails);
};

Server.prototype.closeSecureEvent = function (event) {
  if (this.log) {
    console.log(this.name + " webSocket secure close");
  }
  this.secureConnected = false;

  // close the unsecure connection if it exists
  if (this.unsecureConnected) {
    // TODO: should this be after a delay?
    this.unsecureConnection.close();
  }

  // at this point the disconnection listener will only fire here
  // TODO: if a pure unsecure connection is allowed in the future, then this event will need to be fired from the close unsecure event 
  this.isConnected = false;
  this.disconnectionListener(event, this);
};

Server.prototype.closeUnsecureEvent = function (event) {
  if (this.log) {
    console.log(this.name + " webSocket unsecure close");
  }
  this.unsecureConnected = false;

  // if there is a secure connection then close it
  if (this.secureConnected) {
    // TODO: should this be after a delay?
    this.secureConnection.close();
  }
  // if unsecure only then fire disconnection event 
  if (this.unsecureOnly) {
    this.isConnected = false;
    this.disconnectionListener(event, this);
  }
};

Server.prototype.messageEvent = function (event) {
  if (event.data) {
    var msg = Message.deconstructMessage(event.data);

    if (this.log) {
      console.log((new Date()) + " rcvdMsg     " + msg.id + " body: " + JSON.stringify(msg.body, null, ' '));
    }

    if (!this.authenticated) {
      switch (msg.id) {
      case Message.AUTHENTICATION_ACCEPTED:
        if (this.log) {
          console.log(this.name + " Authentication successful");
        }
        this.authenticated = true;
        this.sessionId = msg.body.sessionId;

        var connectionTypeAllowed = msg.body.connectionType;

        /*
         * the host can pass back that only secure is allowed if connectiong secure and unsecure
         * in such a case dont allow the session negotiation by connecting unsecure
         */

        if (this.secureOnly || this.unsecureOnly || connectionTypeAllowed === Message.COMMS_TYPE_SECURE_ONLY) {
          // can fire the connection sucessful event as secure only and unsecure only do not need session negotiation
          this.isConnected = true;
          this.connectionListener(event);
        } else {
          // get the session id and connect in clear
          this.connectUnsecure();
        }

        break;

      case Message.AUTHENTICATION_REJECTED:
        if (this.log) {
          console.log(this.name + " Authentication failed");
        }
        this.disconnect();
        break;
      }
    }

    switch (msg.id) {
    case Message.SESSION_CONFIRMED:
      // can fire the connection sucessful event, this only occurs for secureAndUnsecure
      this.isConnected = true;
      this.connectionListener(event);
      break;

//    case Message.PANELS:
//      this.rcvdPanels(this, msg.body);
//      break;
//
//    case Message.ADD_PANEL:
//      this.rcvdAddPanel(this, new Panel(msg.body));
//      break;
//
//    case Message.DELETE_PANEL:
//      this.rcvdDeletePanel(this, new Panel(msg.body));
//      break;
//
//    case Message.UPDATE_PANEL:
//      this.rcvdUpdatePanel(this, new Panel(msg.body));
//      break;

    default:
        if(!this._processMessageHandlers(msg.id, msg.body)) {
          this.rcvdUnsupportedMessage();
        }
        break;

    }
  }
};

/*
 * calls each message handler until the message is complete or no more handlers
 */
Server.prototype._processMessageHandlers = function(id, messageContent) {
  var processed = false;
  
  for(var i = 0; i < this.messageHandlers.length && !processed; i++) {
    processed = this.messageHandlers[i](this, id, messageContent);
  }
  
  return processed;
};

Server.prototype.errorEvent = function (event) {
  if (this.log) {
    console.log(this.name + " webSocket error: " + event);
  }
  this.errorListener(event);
};

Server.prototype.sendMessage = function (id, body) {
  if (this.secureOnly) {
    if (this.secureConnected) {
      if (this.log) {
        console.log(this.name + " sending secure message, id: " + id + " body: " + body);
      }
      // only send secured due to configuration
      this.secureConnection.send(Message.constructMessage(id, body));
    }
  } else {
    if (this.secureConnected) {
      if (this.log) {
        console.log(this.name + " sending secure message, id: " + id + " body: " + body);
      }
      // only send secure if we have a secure connection
      this.secureConnection.send(Message.constructMessage(id, body));
    } else if (this.unsecureConnected) {
      if (this.log) {
        console.log(this.name + " sending unsecure message, id: " + id + " body: " + JSON.stringify(body));
      }
      // fallback is to send unsecure only when no secure connection and not secure only
      this.unsecureConnection.send(Message.constructMessage(id, body));
    }
  }
};

Server.prototype.sendUnsecureMessage = function (id, body) {
  if (this.log) {
    console.log(this.name + " sending unsecure message, id: " + id + " body: " + body);
  }
  if (this.unsecureConnected) {
    this.unsecureConnection.send(Message.constructMessage(id, body));
  }
};