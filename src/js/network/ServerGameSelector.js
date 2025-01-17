define( ['lib/jsclass-core', 'view/managers/QueryStringManager', 'lib/bison' ], function( JS, QueryStringManager, BISON ) {
	return new JS.Class({
		initialize: function( config, callback )
		{
			this.callback = callback;
			this.config = config;
			this.actualPort = this.config.SERVER_SETTING.GAME_PORT;
			this.initAndConnetToWebSocket();
		},

		initAndConnetToWebSocket: function()
		{
			var that = this;
			this.hasConnected = false;
			this.connection = new WebSocket( 'ws://' + this.config.HOST + ':' + this.config.SERVER_SETTING.MASTERSERVER_PORT );
			console.log('(ServerGameSelector) Connecting to ws://' + this.config.HOST + ':' + this.config.SERVER_SETTING.MASTERSERVER_PORT);
			this.connection.onopen = function() { that.onConnectionOpened(); };
			this.connection.onmessage = function(messageEvent) { that.onServerMessage(messageEvent); };
			this.connection.onclose = function() { that.onConnectionClosed(); };
		},

		onConnectionOpened: function()
		{
			console.log('(ServerGameSelector) Connected!');
			var newData = { 'desiredPort': QueryStringManager.getQueryString('game') || this.config.SERVER_SETTING.GAME_PORT };
			var encodedData = BISON.encode( newData );
			this.hasConnected = true;
			this.connection.send( encodedData );
		},

		onServerMessage: function( messageEvent )
		{
			var decodedMessage = BISON.decode( messageEvent.data );
			this.actualPort = decodedMessage.actualPort;

			history.pushState(null, "game-" + this.actualPort, "?game=" + this.actualPort );

			console.log("(ServerGameSelector) got response ", decodedMessage );
			this.connection.close();
		},

		onConnectionClosed: function()
		{
			console.log("(ServerGameSelector) socket closed");
			this.callback( this.actualPort, this.hasConnected );
		}
	});
});