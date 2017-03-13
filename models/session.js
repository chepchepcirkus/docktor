var Session = function(app) {
    this.app = app;
    this.messages = [];
};

Session.prototype.setMessage = function (message) {
    var messObj = {type: 'info'};
    if(typeof(message) == 'string') {
        messObj.message = message;
    } else if(typeof(message) == 'object') {
        if(message.type != undefined) {
            messObj.type = message.type
        }

        if(message.text != undefined) {
            messObj.message = message.text
        } else {
            console.log('Session - Message text is undefined');
            return;
        }
    }
    this.messages.push(messObj);
};

Session.prototype.flushMessage = function () {
    this.messages = [];
};

module.exports = Session;