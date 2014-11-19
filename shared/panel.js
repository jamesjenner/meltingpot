/*global window, require, console */
/*
 * panel.js
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

var node = false;

if (typeof module == "undefined") {
  var module = function () {};
  var exports = this.panel = {};
  module.exports = exports;
}
if (typeof require != "undefined") {
  var uuid = require('node-uuid');
}

module.exports = Panel;

Panel.KEY = 'Panel';

Panel.DEFAULT_NAME = 'Panel Name';
Panel.DEFAULT_WIDTH = 1;
Panel.DEFAULT_POSITION = -1;

Panel.MESSAGE_ADD_PANEL = 'addPanel';
Panel.MESSAGE_DELETE_PANEL = 'deletePanel';
Panel.MESSAGE_UPDATE_PANEL = 'updatePanel';
Panel.MESSAGE_GET_PANELS = 'getPanels';
Panel.MESSAGE_PANELS = 'panels';


function Panel(options) {
  options = options || {};
  
  var uuidV1 = ((options.uuidV1 !== null && options.uuidV1 !== undefined) ? options.uuidV1 : false);
  
  this.id = ((options.id !== null && options.id !== undefined) ? options.id : uuidV1 ? uuid.v1() : uuid.v4());
  this.name = ((options.name !== null && options.name !== undefined) ? options.name : Panel.DEFAULT_NAME);
  this.width = ((options.width !== null && options.width !== undefined) ? options.width : Panel.DEFAULT_WIDTH);
  this.position = ((options.position !== null && options.position !== undefined) ? options.position : Panel.DEFAULT_POSITION);
}

/* 
 * merge
 */
Panel.merge = function (d1, d2) {
  d1.name = ((d2.name !== null && d2.name !== undefined) ? d2.name : d1.name);
  d1.width = ((d2.width !== null && d2.width !== undefined) ? d2.width : d1.width);
  d1.position = ((d2.position !== null && d2.position !== undefined) ? d2.position : d1.position);
};