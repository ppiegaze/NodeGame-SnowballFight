/**
File:
	ProjectileTraitFreeze.js
Created By:
	Mario Gonzalez
Project	:
	Ogilvy Holiday Card 2010
Abstract:
	Hijacks the characters shooting speed to allow for faster shooting
Basic Usage:
 	// Let my character be controlled by the KB
	if(newEntity.connectionID === this.netChannel.connectionID) {
		aCharacter.addTraitAndExecute( new ClientControlledTrait() );
		this.clientCharacter = aCharacter;
	}
*/
var init = function(BaseTrait)
{
	return new JS.Class("PresentTrait360Shot", BaseTrait,
	{
		initialize: function(collisionNormal)
		{
			this.callSuper();
		},

		attach: function()
		{
			this.callSuper();

			// Set our theme, and hijack the characters
			this.attachedEntity.themeMask |= this.themeMaskList.HAS_POWERUP;
		},

		detach: function()
		{
			this.attachedEntity.themeMask &= ~this.themeMaskList.HAS_POWERUP;
			this.callSuper();
		},

		execute: function()
		{
			var amount = 12;
			var angleOffset = Math.random() * Math.PI * 2;
			for(var i = 0; i <amount; i++)
			{
				// For now always fire the regular snowball
				var projectileModel = ProjectileModel['powerupModeTheme'+this.attachedEntity.theme];
				projectileModel.force = 1.5; // slower is actually more deadly!
				projectileModel.initialPosition = this.attachedEntity.position.cp();
				projectileModel.initialPosition.y += 19;
				projectileModel.angle = i/amount * (Math.PI*2) + angleOffset;

				this.attachedEntity.fieldController.fireProjectileFromCharacterUsingProjectileModel( this.attachedEntity, projectileModel);
			}

			this.detachAfterDelay(500);
		}
	});
};


if (typeof window === 'undefined')
{
	// We're in node!
	require('js/controllers/entities/traits/BaseTrait');
	PresentTrait360Shot = init(BaseTrait);
}
else
{
	// We're on the browser.
	// Require.js will use this file's name (CharacterController.js), to create a new
	define(['lib/Vector', 'controllers/entities/traits/BaseTrait', 'lib/jsclass/core'], init);
}