/**
File:
	ProjectileTraitFreeze.js
Created By:
	Mario Gonzalez
Project	:
	Ogilvy Holiday Card 2010
Abstract:
	Hijacks the characters position property so that it never changes
Basic Usage:
 	// Let my character be controlled by the KB
	if(newEntity.connectionID === this.netChannel.connectionID) {
		aCharacter.addTraitAndExecute( new ClientControlledTrait() );
		this.clientCharacter = aCharacter;
	}
*/
define(['lib/jsclass-core', 'controllers/entities/traits/BaseTrait'], function(JS, BaseTrait, TraitFactory) {
	return new JS.Class("ProjectileTraitFreeze", BaseTrait,
	{
		initialize: function(collisionNormal, freezeTime) {
			this.traitFactory = require('factories/TraitFactory');
			this.callSuper();
			this.collisionNormal = collisionNormal;
			this.freezeTime = freezeTime || 4500;
		},

		attach: function()
		{
			this.callSuper();

			// Set our theme, and hijack the characters
			this.attachedEntity.themeMask |= this.themeMaskList.FROZEN;
			this.damping = 0.985; // Make us slide-y
			this.intercept(['handleInput', 'damping']);
		},

		execute: function()
		{
			this.collisionNormal.mul(-5);
			// apply
			this.attachedEntity.velocity.mul(0);
			this.attachedEntity.velocity.add(this.collisionNormal);
			this.detachAfterDelay(this.freezeTime);
		},

		detach: function(force) {
			var entity = this.attachedEntity; // Store in var because the super call below will clear the memory
			this.callSuper();

			// turn off bitmask
			entity.themeMask &= ~this.themeMaskList.FROZEN;

			// Add an invulnerability trait
			if(!force)
			{
			 	console.log("(ProjectileTraitFreeze) TraitFactory!", this.traitFactory);

				var characterTraitInvulnerable = this.traitFactory.createTraitWithName('CharacterTraitInvulnerable');
				entity.addTraitAndExecute( new characterTraitInvulnerable(this.freezeTime*0.5) );
			}
		},


		/**
		 * Intercepted propertys
		 */
		handleInput: function()
		{
			// Do nothing! You're frozen!
		}
	});
});