jQuery(function($){
	var socket=io.connect();
	var username='Anonymous';

	//chat box
	$('#message').keydown(function(key){
		if (key.keyCode == 13) {
			$(this.form).submit();
			return false;
		}
	});

	$('#setUser').submit(function(e){
		e.preventDefault();
		username=$('#userName').val();
		socket.emit('new-user',username,function(data){
			if(data) {
				$('#chatwithmeWrap').hide();
				document.title=username;
				$('#chatBox').show();
			}else {
				$('#nameError').html("Apologies, '"+username+"' is already taken, try something else");
			}
		});
		$('#userName').val('');
	});

	socket.on('usernames',function(data){
		var html = '<ul>';
		for(i=0; i<data.length; i++){
			var name=data[i];
			if(username == name){
				name='me';
			}
			html+='<li><span>'+name+'</span></li>';
		}
		html+='</ul>';
		$('#users').html(html);
	});

	$('#message-box').submit(function(e){
		e.preventDefault();
		socket.emit('send-message',$('#message').val(),function(data){
			$('#chat').append("<p align='right' class='error'>"+data+"&nbsp;&nbsp;</p><br/>");
		});
		$('#message').val('');
	});

	socket.on('whisper',function(data){
		$('#chat').append("<p align='left' class='whisper'><b>&nbsp;&nbsp;&nbsp;"+data.nick+" : </b>"+data.msg+"</p><br/>");
	});

	socket.on('private',function(data){
		$('#chat').append("<p align='right' class='whisper'><b>You"+"@"+data.nick+" : </b>"+data.msg+"</p><br/>");
	});

	socket.on('new-message',function(data){
		if(data.nick === username){
			$('#chat').append("<p align='right' class='msg'><b>You"+" : </b>"+data.msg+"&nbsp;&nbsp;</p>");
		}else{
			$('#chat').append("<p align='left' class='msg'><b>&nbsp;&nbsp;&nbsp;"+data.nick+" : </b>"+data.msg+"</p>");
		}
		$('#chatWrap').scrollTop($('#chat').outerHeight());
	});

});