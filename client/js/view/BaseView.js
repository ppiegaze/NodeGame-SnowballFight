define(['factories/HTMLFactory', 'model/EntityModel', 'lib/jsclass/core'], function(HTMLFactory, EntityModel )
{
	return new JS.Class(
	{
		initialize:  function(controller, model) {
			this.setModel( model );
			this.controller = controller;
			this.theme = this.getCssClassFromTheme( this.model.theme );

			// our default position is north
			this.currentRotation = 0;
			this.createElement();
		},

		setModel: function( model )
		{
			this.model = model;
		},

		removeEntity: function( anEntityView )
		{
			anEntityView.getElement().remove();
		},

		getThemeCodeFromName: function( themeName )
		{
			var key;

			for( key in EntityModel.THEME_MAP ) {
				if( EntityModel.THEME_MAP.hasOwnProperty( key ) )
				{
					if( EntityModel.THEME_MAP[ key ] === themeName ) {
						return key;
					}
				}
			}

			return null;
		},

		getCssClassFromTheme: function( theme )
		{
			return EntityModel.THEME_MAP[ theme ];
		},

		getElement: function() {
			return this.element;
		},

		destroy: function() {
			this.element.destroy();
		},
		
		update: function()
		{
			// the position
			this.element.css({
				'left': this.controller.getPosition().x,
				'top': this.controller.getPosition().y
			});

			// the sprite
			this.adjustSprite();
		},

		centerElement: function()
		{
			this.element.css({
				'margin-left': - ( this.element.width() / 2 ),
				'margin-top': - ( this.element.height() / 2 )
			});
		},

		/**
		 * Based on our rotation, we should show a different sprite.
		 */
		adjustSprite: function()
		{
			if( this.controller.useTransform ) {
				$(this.element).css({'WebkitTransform': 'rotate(' + ( this.controller.getRotation() ) + 'deg)' });
			} else {

				var actualRotation = this.controller.getRotation();
				if(actualRotation < 0) actualRotation += 360;

				// Round to the number of sprites we have
				var roundTo = 45,
					roundedRotation = Math.round(actualRotation / roundTo) * roundTo;

				// Only modify the CSS property if it has changed
				var diff = this.currentRotation - roundedRotation;
				if(diff < -1 || diff > 1)
				{
					$(this.element)
						.removeClass( 'rotation-' + this.currentRotation )
						.addClass( 'rotation-' + roundedRotation );

					this.currentRotation = roundedRotation;
				}
            }
		}
	});
});

