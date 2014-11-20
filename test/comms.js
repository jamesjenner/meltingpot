/*jshint node: true*/
/*global describe, it*/

var should = require('chai').should();
var Comms = require('../comms.js');
var Message = require('../shared/message.js');

// expect(wsDefsProcessed).to.deep.equal(expected.def, testDesc + ": definitions do not match");
    
describe('#Comms', function() {
  it('manages options.port correctly', function() {
    (new Comms({port: 1111})).port.should.equal(1111);
    (new Comms()).port.should.equal(9007);
  });
  it('manages options.securePort correctly', function() {
    (new Comms({securePort: 1111})).securePort.should.equal(1111);
    (new Comms()).securePort.should.equal(9008);
  });
  it('manages options.communicationType correctly', function() {
    (new Comms({communicationType: Message.COMMS_TYPE_UNSECURE_ONLY})).communicationType.should.equal(Message.COMMS_TYPE_UNSECURE_ONLY);
    // test without key file, should default to mixed
    (new Comms({communicationType: Message.COMMS_TYPE_MIXED})).communicationType.should.equal(Message.COMMS_TYPE_UNSECURE_ONLY);
    // test without key file, should default to mixed
    (new Comms({communicationType: Message.COMMS_TYPE_SECURE_ONLY})).communicationType.should.equal(Message.COMMS_TYPE_UNSECURE_ONLY);
    (new Comms({communicationType: 'sdjksd'})).communicationType.should.equal(Message.COMMS_TYPE_UNSECURE_ONLY);
    (new Comms()).communicationType.should.equal(Message.COMMS_TYPE_UNSECURE_ONLY);
  });
});
