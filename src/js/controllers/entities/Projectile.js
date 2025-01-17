/**
File:
	Projectile.js
Created By:
	Mario Gonzalez
Project	:
	Ogilvy Holiday Card 2010
Abstract:
	A basic projectile that uses ProjectileModel.js objects to define it's attributes
Basic Usage:
*/

define(['lib/jsclass-core', 'lib/Vector', 'lib/Rectangle', 'controllers/FieldController', 'controllers/entities/GameEntity', 'model/ProjectileModel'],
	function(JS, Vector, Rectangle, FieldController, GameEntity)
	{
		return new JS.Class(GameEntity,
		{
			initialize: function(anObjectID, aClientID, projectileModel, aFieldController, config)
			{
				this.callSuper();
				this.entityType = this.config.ENTITY_MODEL.ENTITY_MAP.PROJECTILE; //

				// By default all projectiles are destroyed when they hit a field-entity
				this.themeMask |= this.config.SPRITE_THEME_MASK.DESTROY_ON_FIELD_ENTITY_HIT;

				this.force = projectileModel.force;
				// Get information from the projectile model
				this.position = projectileModel.initialPosition;
				this.maxVelocity = projectileModel.maxVelocity;
				this.radius = projectileModel.radius;
				this.angle = projectileModel.angle * 57.2957795;

				// Round to the number of sprites we have
				var roundTo = 45;
				this.angle = Math.round(this.angle / roundTo) * roundTo;
				this.angle *= 0.0174532925;
				this.rotation = this.angle;

				this.damping = 1;
				this.transferredTraits = projectileModel.transferredTraits;
				this.velocity = new Vector(Math.cos(this.angle) * this.maxVelocity * this.force, Math.sin(this.angle) * this.maxVelocity * this.force);
				this.destroyOnWrap = true;
			}
		});
	}
);