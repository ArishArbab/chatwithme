function onConnection(socket){
	console.log('New Socket Connection established');
	

	socket.on('new-user',function(data,isUnique){
		if(data in users) {
			isUnique(false);
		}else {
			isUnique(true);
			socket.nickname=data;
			users[data]=socket;
			sockets.emit('usernames',Object.keys(users));
		}
	});

	socket.on('send-message',function(data,callback){
		var msg = data.trim();
		if(msg.substr(0,1) === '@') {
			msg=msg.substr(1);
			var index = msg.indexOf(' ');
			if(index !== -1) {
				var name = msg.substring(0,index);
				var msg  = msg.substring(index+1);
				if(name in users) {
					users[name].emit('whisper',{msg:msg,nick:socket.nickname});
					socket.emit('private',{msg:msg,nick:name});
				} else{
					callback('Sorry '+name+' is not online');
				}
			}else {
				callback('Lools like you sent a blank message');
			}
		}else {
			sockets.emit('new-message',{msg:msg,nick:socket.nickname});

		}
	});

	socket.on('disconnect',function(data){
		if(!socket.nickname) return;
		delete users[socket.nickname];
		sockets.emit('usernames',Object.keys(users));
	});

}

module.exports.onConnection = onConnection;