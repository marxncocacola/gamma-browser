//  Copyright metaLAB 2011. All Rights Reserved.




//  We're going to pack all of our functionality into an object
//  named 'XM' which will avoid polluting the global scope
//  and hopefully avoid the nasty situation of relying on custom
//  functions in the global scope that might be overwritten 
//  by third-party scripts!

var XM = {

	debug: true,
	tabMode: false,
	
	
	
	
	
	
	
	
	    //////////////
	   //          //
	  //   Boot   //
	 //          //	
	//////////////
	
	
	//  Having 'boot tasks' is a nice way to ensure that
	//  scripts contained in other files have a way to hook-in
	//  to our start-up environment.
	//  They just use XM.bootAdd( someFunctionName );
	
	bootTasks : [],
	bootAdd : function( task )
	{
		XM.bootTasks.push( task );
	},
	boot : function()
	{
		for( var i = 0; i < XM.bootTasks.length; i ++ )
		{
			XM.bootTasks[ i ]();
		};
		XM.bootTasks = [];
		
		
		//  Create a 'Tag' filter as our default filter
		//  then force anything in the 'filters' DIV to 
		//  be sortable.
		
		XM.filter.add( 'tag' );
		$(function()
		{
			$( "#filters" ).sortable(
			{
				containment: 'parent',
				handle: '.bar',
				stop: function()
				{
					XM.filter.update();
					XM.filter.apply();
				}
			});
		});
	},
	
	
	
	
	
	

	
	    /////////////////
	   //             //
	  //   Filters   //
	 //             //	
	/////////////////
	
	
	//  Our filters have to do a lot of work. They pretty much deserve
	//  their own object within the global XM object. So here it is:
	
	filter: {
	
	
		add: function( filterType )
		{
			if( XM.tabMode )
			{
				var a = $( '.filterIcon' + filterType.capitalize() );
				a.addClass( 'disabled' );
				a.attr( 'onclick', 'return false' );
			};
			
			
			//  Create a new List Item <li> as the container for this filter.
			//  This is a big deal because we're going to store all this
			//  filter's important data right here using jQuery's 'data' function.
			//  Note that 'onAdd' and 'onRemove' are empty functions right now.
			//  We can always override them later to do stuff.
			
			var f = $( '<li/>' );
			f.addClass( 'filter' );
			f.data( 'filterType', filterType );
			f.data( 'resolution', 12 );
			f.data( 'onAdd', function() {} );
			f.data( 'onRemove', function() {} );


			//  To make visual alignments and some other tasks simpler
			//  the guts of the filter are built inside a <table>
			//  complete with Table Rows <tr> that contain Table Data <td>.
			
			var html = '<table><tr class="bar">';
			html += '<td class="w1">';
			html += '	<div class="filterIcon"></div>';
			html += '</td>';
			html += '<td class="w9 t2">';
			html += '	<div class="pad">'
			html += '		<span class="and"></span>';
			html += '		<span class="summary"></span>';
			html += '		<span class="toggleExplore"></span>';
			html += '	</div>';
			html += '</td>';
			html += '<td class="control w2">';
			html += '	<div class="pad">';
			html += '		<span class="removeFilter"><a class="quiet removeFilterIcon" href="." onclick="XM.filter.remove(this);return false"></a></span>';
			html += '	</div>';
			html += '</td>';
			html += '</tr></table>';
			f.html( html );


			//  What we've created so far is a GENERIC filter; a template really.
			//  Now here's some magic:
			//  We can pass this template to a function that wil customize it
			//  and overwrite our template here 'f' with the customized version!
			//  Talk about flexibility!! 

			f = XM[ filterType ].add( f );


			//  Make sure that this filter's 'Explorer' area is open.
			//  This is where you make adjustments to the filter,
			//  like clicking on Map cells or dragging Time sliders.

			var e = f.find( '.explorer' )[0];
			if( e !== undefined ) XM.filter.expand( e );


			//  If we're down to just one filter we need to hide the option
			//  to remove it. But if we have more than one filter we need
			//  to ensure the 'Remove' buttons are all visible.

			$( '#filters' ).append( f );
			var filters = $('.filter');
			if( filters.length == 1 )
			{
				$( filters[ 0 ] ).find( '.removeFilter' ).hide();
			}
			else
			{
				$( filters[ 0 ] ).find( '.removeFilter' ).show();
			};
			
			
			//  Ok. We're done adding our brand new customized filter to the document.
			//  Only thing left to do on this guy is call its 'onAdd' function.
			
			f.data( 'onAdd' )();


			//  Might as well log this to the console if we're debugging. 

			if( XM.debug )
			{
				console.log( "\nAdded the following Filter:" );
				console.log( f );
			};
			
			
			//  Oh wait. One final thing:
			//  Apply our entire collection of existing filters!
			
			XM.filter.update();
		},
		
		
		
		
		remove: function( element )
		{
			var f = $( element ).closest( '.filter' );
			if( XM.tabMode )
			{
				var filterType = f.data( 'filterType' );
				var a = $( '.filterIcon' + filterType.capitalize() );
				a.removeClass( 'disabled' );
				a.attr( 'onclick', 'XM.filter.add(\'' + filterType + '\');return false' );
			};
			
			
			//  Remember how we created an 'onRemove' function for each filter?
			//  Now's the time to call it! And then we'll actually do the removal.
			
			f.data( 'onRemove' )();
			f.remove();
			
			
			//  If we're down to one single filter it doesn't make sense
			//  that a user could remove it, so hide the 'Remove' button.
			
			var filters = $( '.filter' )
			if( filters.length == 1 )
			{
				$( filters[0] ).find( '.removeFilter' ).hide();
			};
			
			
			//  Note our actions in the log
			//  then apply our remaining filter collection.
			
			if( XM.debug )
			{
				console.log( "\nRemoved the following Filter:" );
				console.log( f );
			};
			XM.filter.update();
			XM.filter.apply();
		},
		
		
		
		
		expand: function( element )
		{
			
			//  This filter already exists,
			//  we just want to make sure its 'Explorer' area is expanded.
			
			var f = $( element ).closest( '.filter' );
			var e = f.find( '.toggleExplore' )[ 0 ];
			$( e ).html( '<a class="soft" href="." onclick="XM.filter.collapse(this);return false">Collapse &larr;</a>' );
			f.find( '.explorer' ).show();
			if( XM.debug )
			{
				console.log( "\nExpanded the following Filter:" );
				console.log( f );
			};
			XM.filter.update();
		},
		
		
		
		
		collapse: function( element )
		{
			
			//  Time to collapse the 'Explorer' area of this filter.
			
			var f = $( element ).closest( '.filter' );
			var e = f.find( '.toggleExplore' )[ 0 ];
			$( e ).html( '<a class="soft" href="." onclick="XM.filter.expand(this);return false">Explore &rarr;</a>' );
			f.find( '.explorer' ).hide();
			if( XM.debug )
			{
				console.log( "\nCollapsed the following Filter:" );
				console.log( f );
			};
			XM.filter.update();
		},
		
		
		
		
		update: function()
		{
			
			//  To make the list of filters more friendly
			//  I've added the word 'and' in front of each
			//  where i > 1.
			
			var filters = $( '.filter' );
			$($( filters[0] ).find( '.and' )[0]).text( '' );
			for( var i = 1; i < filters.length; i ++ )
			{
				$($( filters[i] ).find( '.and' )[0]).text( 'and ' );
			};
		
		
			//@@   TO DO LIST !
		
			//  this is where we should also check for 'remove' buttons
			//  and possibly also launch apply() from here?
			//  Will make things more tidy.
		},
		
		
		
		
		apply: function( element, resolution, callback )
		{
			var f = $( element ).closest( '.filter' );


			//  Ok. We're going to have to play dirty right now.
			//  In the future we'd like to just to the obvious, simple thing:
			//  One filter = one element in the query array.
			//  But the server's not setup for that so we need a quick fix.
			//  We'll only send ONE element in the query array.

			var post = { 'query': [] };
			var q = {
			
				'mediaType'   : 'all',
				'contentType' : 'all'
			};
			//q.tags = [ 'Boston' ];//  Tags don't work just yet server-side.
			q.geo  = {
			
				'north' :  42.4,
				'east'  : -87.6,
				'south' :  41.0,
				'west'  : -99.2
			};
			q.time = {
				
				'earliest' : -218799493233,
				'latest'   :  218799493233
			};
			
			
			//  Output Type and Resolution
			//  Normally this would be per-filter, but it's the quick and dirty (Q&D)

			var filterType = f.data( 'filterType' );
			if( filterType == 'space' ) filterType = 'geo';//  We call it 'space' but server calls it 'geo'
			resolution = cascade( resolution, f.data('resolution'), 12 );
			q.output = {
				
				'type'       : filterType,
				'resolution' : resolution,
				'limit'      : 100,
				'offset'     :   0
			};
			
			
			//  So for this quick and dirty fix
			//  we'll just OVERWRITE the objects in the "q" object.
			//  I know, I know. But it's temporary! 
			
			var filters = $( '.filter' );
			for( var i = 0; i < filters.length; i ++ )
			{
				switch( $( filters[i] ).data( 'filterType' ))
				{
					/*
					case 'tag' :
						q.tags = $(filters[i]).data( 'tokens' ).slice();
						break;
					*/
					case 'space' :
						q.geo = {
							'north': $(filters[i]).data( 'north' ),
							'east' : $(filters[i]).data( 'east'  ),
							'south': $(filters[i]).data( 'south' ),
							'west' : $(filters[i]).data( 'west'  )
						};
						break;
					case 'time' :
						q.time = {
							'earliest': $(filters[i]).data( 'earliest' ),
							'latest'  : $(filters[i]).data( 'latest' )
						};
						break;
				};
				//if( filters[ i ] === f ) break;
			};




			post.query.push( q );//  See above.
			
			
			
			
			if( XM.debug )
			{
				console.log( '\nSending the following request to server:' );
				console.log( post );
			}
			$.post( 'http://mlhplayground.org/em/web/app_dev.php/search', post, function( data )
			{
				data = $.parseJSON( data );
				if( XM.debug )
				{
					console.log( '\nReceived the following data from server:' );
					console.log( data );
				};
				if( typeof callback == 'function' ) callback( data, f );
			});
		},
	},



	
	//  Background Grid
	//  Very useful for checking visual alignments while designing.
	//  Not necessary for the end user.

	gridShow: function()
	{
		$( '.page' ).css( 'background-image', 'url("media/grid.png")' );
	},
	gridHide: function()
	{
		$( '.page' ).css( 'background-image', 'none' );
	},
};




//  Don't execute our boot function until our document has finished loading.
//  This is standard practice don't you know ;)
//  It avoids messy situations like trying to perform operations on elements
//  that don't exist.

$( document ).ready( function(){ XM.boot(); });