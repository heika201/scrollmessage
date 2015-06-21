var global_username = '';
var global_recipient = '';

sinchClient = new SinchClient({
	applicationKey: '80805d38-246e-4bf7-860a-253e55a73581',
	capabilities: {messaging: true},
});

var clearError = function() {
	$('div.error').text("");
}

var showPickRecipient = function() {
    $('div#auth').css('display', 'none');
    $('form#pickRecipient').show();
}

var showChat = function() {
    $('form#pickRecipient').css('display', 'none');
    
     $('div.container').css('display', 'block');
    //$('div#chat').show();
    
	$('.panel-heading').text(global_recipient);
    
    
    $('span#username').text(global_username);
    $('span#recipient').text(global_recipient);
}

var handleError = function(error) {
	$('button#createUser').attr('disabled', false);
	$('button#loginUser').attr('disabled', false);
	$('div.error').text(error.message);
}

$('button#createUser').on('click', function(event) {
    event.preventDefault();
    $('button#createUser').attr('disabled', true);
    $('button#loginUser').attr('disabled', true);
	clearError();

	var username = $('input#username').val();
	var password = $('input#password').val();

    var loginObject = {username: username, password: password};
	sinchClient.newUser(loginObject, function(ticket) {
		sinchClient.start(ticket, function() {
			global_username = username;
			showPickRecipient();
		}).fail(handleError);
	}).fail(handleError);
});

$('button#loginUser').on('click', function(event) {
    event.preventDefault();
    $('button#createUser').attr('disabled', true);
    $('button#loginUser').attr('disabled', true);
	clearError();

	var username = $('input#username').val();
	var password = $('input#password').val();

    var loginObject = {username: username, password: password};
	sinchClient.start(loginObject, function() {
		global_username = username;
		showPickRecipient();
	}).fail(handleError);
});

$('button#pickRecipient').on('click', function(event) {
    event.preventDefault();
    clearError();
    global_recipient = $('input#recipient').val();
    showChat();
});

var messageClient = sinchClient.getMessageClient();

// Pressing enter submits text
$('#btn-input').keypress(function (e) {
    var code = e.keyCode || e.which;
    if (code === 13) {
        $("#btn-chat").click();
    };
});
   

//$('button#sendMsg').on('click', function(event) {
$('button#btn-chat').on('click', function(event) {
    event.preventDefault();
	clearError();    
    
	var text = $('input#btn-input').val();
    $("#userMsg").tmpl({"username": global_username, "msg": text}).appendTo(".chat");
    
    $('input#btn-input').val('');
	var sinchMessage = messageClient.newMessage(global_recipient, text);
	messageClient.send(sinchMessage).fail(handleError);
});

var eventListener = {
	onIncomingMessage: function(message) {
        if (message.senderId == global_recipient) {
                $("#buddyMsg").tmpl({"username": global_recipient, "msg": message.textBody}).appendTo(".chat");
        }
	}
}



messageClient.addEventListener(eventListener);
