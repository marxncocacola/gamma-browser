XM.tag = {
	

	add: function( f )
	{
		var obj = $( '<tr/>' );
		//var html = '';
		//html += '</td>';
		//obj.html( html );
		var defaultQuery = 'Boston';
		f.data( 'tokens', [ defaultQuery ] );
		f.find( 'table' ).append( obj );
		f.find( '.summary' ).html( 'tagged with <input type="text" class="t2" value="' + defaultQuery + '" />' );
		f.find( '.filterIcon' ).addClass( 'filterIconTag' );
		f.find( 'input' ).change( function()
		{
			XM.tag.typed( f );
		});
		f.data( 'onAdd', function()
		{
			XM.tag.typed( f );	
		});
				
		return f;
	},
	
	
	typing: function( element )
	{
		var f = $( element ).closest( '.filter' );
		//  what we should actually do:
		//  every 1/2 second compare old value to current value
		//  if there was a change, trip a flag and start a new counter
		//  if that flag is tripped and there's been no change for 
		//  1 full second then do XM.tag.typed(f) !
	},


	typed: function( element )
	{
		var f = $( element ).closest( '.filter' );
		var tokens = f.find( '.summary input' ).val().split( ' ' );
		f.data( 'tokens', tokens );
		XM.filter.apply( f, 10, XM.tag.draw );
	},


	draw: function( data, element )
	{
		var f = $( element ).closest( '.filter' );
		var maxCollectionTotal = data.max;

		var tray = $( $( '#results .items' )[0] );
		tray.empty();

		var summary = $( $( '#results .summary .pad' )[0] );
		/*var html = 'Your filter';
		if( $('.filter').length > 1 ) html += 's';
		html += ' returned '+ data.collections.length + ' results.';*/
		html = 'Returned '+ data.collections.length + ' results';
		summary.html( html );
		

		$.each( data.collections, function( i, val )
		{
			if( val.id )//  for some reason server sending back multiple arrays of tags mixed in with our data!?!
			{
				var d = $( '<div>' );
				d.addClass( 'item' );
				var html = '<img src="http://mlhplayground.org/Symfony/web/images/thumbs/';
				html +=  val.id + '_s.jpg" alt="' + val.title + '" title="' + val.title + '" />';
				d.html( html );
				tray.append( d );
			};
			//$( '#results' ).append( "<li data-count='"+ this.total +"'><div class='inner-block'><img src='http://mlhplayground.org/Symfony/web/images/thumbs/"+this.id+"_s.jpg'/></div><div class='tooltip'><span class='point'></span><span class='collection-tooltip' >"+this.title+":"+this.total+" items</span></div></li>");
		});
		$( '#results li' ).hover( function()
		{
			$( this ).children( '.tooltip' ).fadeIn();
		},
		function()
		{
			$( this ).children( '.tooltip' ).fadeOut( 'fast' );
		});
		
		
		d = $( '<div>' );
		d.addClass( 'clear' );
		tray.append( d );
		
		tray.sortable({ containment: 'parent' });
		tray.disableSelection();	


		$( '#results' ).show();
	}


};












/*
	
	//populate empty #assetsView Div with the framework to make this happen
	var populateDiv = 
		"<a href='#' id='scale-button'>Toggle Scale</a><br /><br /><div id='user-tray-div' class='tray'><ul id='user-tray' class='connectedSortable'></ul></div><ul id='collection-tray' class='connectedSortable'></ul>";
	
	//empty div
	$("#assetsView").text("");
	//repopulate div
	$("#assetsView").append(populateDiv);
	
	

	//	generate html list items for each collection/item that the server returns





	//	make lists sortable

	$( "#user-tray, #collection-tray" ).sortable(
	{
		connectWith: ".connectedSortable",
		opacity: 0.5,
		placeholder: 'ui-state-highlight',
		start: function( event, ui )
		{
			$('#user-tray-div').css('background-color','#ffffcc');
			//$('#user-tray-div ul').text('drop collections here to begin sorting');
		},
		stop: function( event, ui )
		{
			$('#user-tray-div').css('background-color','#fff')
			$(ui.item).children("div").effect( 'highlight','slow')
			//$('#user-tray-div ul').text('');
		}
	})
	.disableSelection();



	//	Scales the collection boxes to a relative size
	
	$( "#scale-button" ).toggle( function()
	{
		$( '#results li' ).each( function( i, val )
		{
			var percent = Math.sqrt( $(this).attr('data-count') / maxCollectionTotal );
			//$(this).children("div").animate({height:75*percent+"px", width:75*percent+"px"},'slow');//  Too slow for many objects!
			$( this ).children( 'div' ).css(
			{
				height: 75 * percent + 'px',
				width:  75 * percent + 'px'
			});
		});
	},
	function()
	{
		$( '#results li' ).each( function( i, val )
		{
			//slow
			//$(this).children("div").animate({height:"75px",width:"75px"},'slow');
			$( this ).children( 'div' ).css(
			{
				height: '75px',
				width:  '75px'
			});
		});
	});
*/