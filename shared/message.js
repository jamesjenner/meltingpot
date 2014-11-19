/*
 * message.js
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

// "use strict"

if(typeof module == "undefined"){
    var module = function(){};
    var exports = this.message = {};
    module.exports = exports;
}

module.exports = Message;

Message.UNKNOWN = '__unknown';

Message.AUTHENTICATE = 'authenticate';
Message.AUTHENTICATION_ACCEPTED = 'authenticationAccepted';
Message.AUTHENTICATION_REJECTED = 'authenticationRejected';
Message.CHANGE_PWD = 'changePwd';

Message.SESSION = 'session';
Message.SESSION_CONFIRMED = 'sessionConfirmed';
Message.REQUEST_SESSION = 'requestSession';

Message.COMMS_TYPE_SECURE_ONLY = 'secureOnly';
Message.COMMS_TYPE_UNSECURE_ONLY = 'unsecureOnly';
Message.COMMS_TYPE_MIXED = 'mixed';

function Message(data) {
    data = data || {};
	     
    this.id = data.id === undefined ? Message.UNKNOWN : data.id;
    this.body = data.body === undefined ? null : data.body;
}

/* 
 * deconstruct a message 
 */
Message.deconstructMessage = function(jsonData) {
    var obj = JSON.parse(jsonData);

    // initialise in case it wasn't sent
    obj.body = obj.body === undefined ? 'null' : obj.body;

    // always parse, presuming it's JSON
    obj.body = JSON.parse(obj.body);

    return new Message(obj);
};

/* 
 * Constructs a message based on an id and data, while converting the data to a JSON string
 *
 */
Message.constructMessage = function(id, data) {
    return JSON.stringify({id: id, body: JSON.stringify(data)});
};

