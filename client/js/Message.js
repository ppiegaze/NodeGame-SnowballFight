/**
* A message is a small value-object wrapper
* @param aSequenceNumber 	Ties us to an array by the owning class
* @param isReliable		This message MUST be sent if it is 'reliable' (Connect / Disconnect). If not it can be overwritten by newer messages (for example moving is unreliable, because once it's outdates its worthless if new information exist)
* @param anEncodedMessage	The actualMessage that will be sent. Already encoded
**/

define(["Bison"], function() {
	function Message(aSequenceNumber, isReliable, anUnencodedMessage)
	{
		// Info
		this.sequenceNumber = aSequenceNumber;
		this.clientID = 0; // Some kind of hash value returned to the NetChannel from the server on connect
		
		// Data
		this.unencodedMessage = anUnencodedMessage;
		
		// State
		this.messageTime = -1;
		this.isReliable = isReliable;
	}
	
	/**
	* Encode data to send using BISON
	*/
	Message.prototype.encodedSelf = function()
	{
		return BISON.encode({id:this.clientID, seq:this.sequenceNumber, cmds:this.unencodedMessage, t:this.messageTime});
	};
	return Message;
});