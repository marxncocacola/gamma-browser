

//  Let's add a "time" object to our big XM object.
//  That will keep it nicely packaged away.

XM.time = {
	
	
	add: function( f )
	{
		var earliest = 1900;
		var latest   = 2011;


		//  Here we're going to build out the guts of our filter
		//  which will fit into the generic template filter's empty TABLE.

		var obj = $( '<tr/>' );
		obj.addClass( 'explorer' );
		var html = '';
		html += '<td colspan="3">';
		html += '	<div class="pad">';
		html += '		<div class="sliderPad">';
		html += '			<div class="sliderContainer">';
		html += '				<div class="sliderLabel0">'+ earliest +'</div>';
		html += '				<div class="sliderLabel1">'+ latest +'</div>';
		html += '				<div class="sliderRange"></div>';
		html += '				<div class="sliderLabelMin">'+ earliest +'</div>';
		html += '				<div class="sliderLabelMax">'+ latest +'</div>';
		html += '			</div>';
		html += '		</div>';
		html += '		<div class="timeline"></div>';
		html += '		<div class="clear"></div>';
		html += '	</div>';
		html += '</td>';
		obj.html( html );


		//  And here we go: we take those guts we just built
		//  and add them right into the template filter's innards.

		f.find( 'table' ).append( obj );


		//  Let's take care of some other creation overhead
		
		f.find( '.filterIcon' ).addClass( 'filterIconTime' );
		f.find( '.sliderRange' ).slider(
		{
			range: true,
			min: earliest,
			max: latest,
			values: [ earliest, latest ],
			slide: function( event, ui )
			{
				XM.time.rangeUpdate( f );
			},
			stop: function( event, ui )
			{
				XM.time.rangeStop( f );
			}
		});
		
		
		//  This "onAdd" function will ensure that we store our 
		// "earliest" and "latest" values in the filter.
		
		f.data( 'onAdd', function()
		{
			XM.time.rangeStop( f );			
		});

		return f;
	},
	
	
	
	
	//  The user is currently sliding this filter's time sliders
	//  so we want to update our labels for "earliest" and "latest" accordingly.
	//  As we're doing this we're also storing those values 
	//  right in this filter's DOM element so we can read them later.
	
	rangeUpdate: function( element )
	{
		var f = $( element ).closest( '.filter' );
		var earliest = f.find( '.sliderRange' ).slider( 'values', 0 );
		var latest   = f.find( '.sliderRange' ).slider( 'values', 1 );
		f.data( 'earliest', earliest.yearToUnix() );//  Lo bound is INCLUSIVE
		f.data( 'latest',   latest.yearToUnix()+1 );//  Hi bound is EXCLUSIVE
		f.find( '.summary' ).html( 'created between <strong>' + earliest + '</strong> and <strong>' + latest + '</strong>.' );
		var position0 = f.find( '.sliderRange .ui-slider-handle' )[0].style.left;
		var position1 = f.find( '.sliderRange .ui-slider-handle' )[1].style.left;
		f.find( '.sliderContainer .sliderLabel0' ).css( 'left', position0 ).text( earliest );
		f.find( '.sliderContainer .sliderLabel1' ).css( 'left', position1 ).text( latest );
	},
	
	
	
	
	//  The user has finished sliding around this filter's time sliders.
	//  We'll call "rangeUpdate()" to make sure we have the correct values
	//  for "earliest" and "latest" stored in this filter's DOM element.
	//  Then we'll call the general "XM.filter.apply()" function to send our
	//  assess the state of ALL filters and send the collected query to the server.
	
	rangeStop: function( element )
	{
		var f = $( element ).closest( '.filter' );
		XM.time.rangeUpdate( f );
		
		
		//  Notice the last argument we're sending to the "apply()" function here.
		//  It's actually a *function* (which is defined a few lines below).
		//  What we're doing is defining a call-back function:
		//  When the "apply()" function gets a response from the server
		//  it will fire this call-back function where we draw the results.
		//  In this case our results are just time bins, each of which contains many items,
		//  not the items themselves. 
		
		XM.filter.apply( f, 10, XM.time.draw );
	},
	
	
	
	
	//  We send this to "XM.filter.apply()" as a call-back function.
	// (See a few lines above for more description / in-use example.)
	//  So this function will be called when there are query results
	//  to parse and draw. 
	
	draw: function( data, element )
	{
		var f = $( element ).closest( '.filter' );
		
		var binsCount = data.length;
		var binsSum   = 0;
		var binsMax   = 0;
		for( var i = 0; i < binsCount; i ++ )
		{
			var itemsCount = parseInt( data[ i ].total, 10 );
			binsSum += itemsCount;
			binsMax  = Math.max( binsMax, itemsCount );
		};


		//  Ok. We need to find this filter's "timeline" area. Then empty it.
		//  Then fill it with the new results. 

		var e = f.find( '.timeline' );
		e.empty();
		
		
		//  How big should these time bins be that we're about to draw?
		
		var w = ( e.width() / binsCount ).map( 0, e.width(), 0, 100 );
		var h = 100;
		
		
		//  Time to draw those time bins!
		
		for( var i = 0; i < binsCount; i ++ )
		{
			var itemsCount = parseInt( data[ i ].total, 10 );

			var d = $( '<div>' );
			d.addClass( 'timeBin' );
			d.data( 'binId', i );
			d.width( w + '%' );
			d.height( itemsCount.map( 0, binsMax, 0, 100 ));


			//  Ok. We're already basically done drawing. (That was easy, right?)
			//  But we need to add one more piece of functionality:
			//  When any of these bins are clicked we need to run *another* query
			//  that uses this bin's "earliest" and "latest" values
			//  and then with those results we'll actually populate the main
			//  results tray. 

			d.click( function()
			{			
				f.find( '.timeBin' ).removeClass( 'binHighlight' );
				$( this ).addClass( 'binHighlight' );
				var binId    = $( this ).data( 'binId' );
				var earliest = ( +data[ binId ].earliest ).round();// already in Unix seconds
				var latest   = ( +data[ binId ].latest ).round();// already in Unix seconds
				if( earliest == latest ) latest ++;//  safety first

				f.data( 'earliest', earliest );
				f.data( 'latest',   latest   );
				f.find( '.summary' ).html( 'created between <strong>' + earliest.unixToYear() + '</strong> and <strong>' + latest.unixToYear() + '</strong>.' );

				//  0 sends bare bones
				//  1 sends all the real data!
				XM.filter.apply( f, 0, function( data )
				{

					//  This right here is too messy for my taste. 
					//  We should really generalize this action of populating the main results tray
					//  since it's a task shared by all filters.
					//  Then we can make this a function right in the main XM{} object
					//  and not have to copy and paste this messy code into every filter!

					var summary = $( $( '#results .summary .pad' )[0] );
					/*var html = 'Your filter';
					if( $('.filter').length > 1 ) html += 's';
					html += ' returned '+ data.length +' results.';*/
					html = 'Returned '+ data.length + ' results';
					summary.html( html );
					
					var tray = $( $( '#results .items' )[0] );
					tray.empty();
					for( var i = 0; i < data.length; i ++ )
					{
						if( data[i].id )//  for some reason server sending back multiple arrays of tags mixed in with our data!?!
						{
							var d = $( '<div>' );
							d.addClass( 'item' );
							var html = '<img src="http://mlhplayground.org/Symfony/web/images/thumbs/';
							html +=  data[ i ].id + '_s.jpg" alt="' + data[ i ].title + '" title="' + data[ i ].title + '" />';
							d.html( html );
							tray.append( d );
						};
					};
					d = $( '<div>' );
					d.addClass( 'clear' );
					tray.append( d );			
					tray.sortable({ containment: 'parent' });
					tray.disableSelection();	
					$( '#results' ).show();
				});
			});


			//  One bit of the drawing task left:
			//  Let's give each time bin a text label with the year span and number of results.
			//  Now, in the near future we should change this to be a year span, or month span, 
			//  or days... Whatever the situation would deem most appropriate.
			//  For right now we're just going with years for expediency. 

			var earliest = ( +data[ i ].earliest ).unixToYear();
			var latest   = ( +data[ i ].latest ).unixToYear();
			var html = '<div class="pad">';
			html += earliest;
			html += "<span class='soft'>&ndash;";
			html += latest;
			html += "<br />" + data[ i ].total + " items.";
			html += "</span></div>";
			d.html( html );
			d.appendTo( e );
		};
	}


};