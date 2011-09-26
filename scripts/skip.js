//  Copyright Stewart Smith 2011. All Rights Reserved.


var forceAugment = function( type, name, data )
{
	return type.prototype[ name ] = data;
};
var augment = function( type, name, data )
{
	if( type.prototype[ name ] === undefined )
	{
		return forceAugment( type, name, data );
	};
};
var cascade = function( a, b )
{
	var args = Array.prototype.slice.call( arguments );
	for( var i = 0; i < args.length; i ++ )
	{
		if( args[ i ] !== undefined ) return args[ i ];
	}
	return false;
};




var E       = Math.E;
var PI      = Math.PI;
var TAU     = Math.PI * 2;
var SQRT2   = Math.SQRT2;
var SQRT1_2 = Math.SQRT1_2;
var LN      = Math.LN2;
var LN10    = Math.LN10;
var LOG2E   = Math.LOG2E;
var LOG10E  = Math.LOG10E;




/*augment( Object, 'clone', function( o )//  Out for the moment in order to play nice with jQuery
{
	function F() {}
    F.prototype = o;
    return new F();
});
augment( Object, 'skipjs', function()
{
	return 'Skip 0.2\nStewart Smith\nhttp://stewd.io';
});*/




augment( Array, 'max', function()
{
	return Math.max.apply( null, this )
});
augment( Array, 'min', function()
{
	return Math.min.apply( null, this )
});
augment( Array, 'remove', function( from, to )
{
	var rest = this.slice(( to || from ) + 1 || this.length );
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply( this, rest );
});
augment( Array, 'shuffle', function()
{
	var i = this.length;
	if( i == 0 ) return false;
	var copy = this;
	while( -- i )
	{
		var j = Math.floor( Math.random() * ( i + 1 ));
		var tempi = copy[ i ];
		var tempj = copy[ j ];
		copy[ i ] = tempj;
		copy[ j ] = tempi;
	};
	return copy;
});
augment( Array, 'toHtml', function()
{
	var html = '<ul>';
	for( var i = 0; i < this.length; i ++ )
	{
		if( this[ i ] instanceof Array )
		{
			html += this[ i ].toHtml();
		}
		else
		{
			html += '<li>' + this[ i ] + '</li>';
		};
	};
	html += '</ul>';
	return html;
});
augment( Array, 'toText', function( depth )
{
	depth = cascade( depth, 0 );
	var indent = '\n' + '\t'.multiply( depth );
	var text = '';
	for( var i = 0; i < this.length; i ++ )
	{
		if( this[ i ] instanceof Array )
		{
			text += indent + this[ i ].toText( depth + 1 );
		}
		else
		{
			text += indent + this[ i ];
		};
	};
	return text;
});




augment( Number, 'abs', function()
{
	return Math.abs( this );
});
augment( Number, 'ceil', function()
{
	return Math.ceil( this );
});
augment( Number, 'constrain', function( a, b )
{
	b = b || 0;
	var higher = [ a, b ].max();
	var lower  = [ a, b ].min();
	var c = this;
	c = [ c, higher ].min();
	c = [ c, lower  ].max();
	return c;
});
augment( Number, 'degreesToRadians', function()
{
	return this * Math.PI / 180;
});
augment( Number, 'floor', function()
{
	return Math.floor( this );
});
augment( Number, 'log10', function()
{
	// is this more pragmatic? ---> return ( '' + this.round() ).length;
	return Math.log( this ) / Math.log( 10 );
});
augment( Number, 'map', function( a0, a1, b0, b1 )
{
	var phase = this.norm( a0, a1 );
	if( b0 == b1 ) return b1;
	return b0 + phase * ( b1 - b0 );
});
augment( Number, 'norm', function( a, b )
{
	if( a == b ) return 1.0;
	return ( this - a ) / ( b - a );
});
augment( Number, 'pad', function( digits, decimals )
{
	digits   = digits   || 2;
	decimals = decimals || 0;
	var stringed = '' + this;
	var padding  = '';
	for( var i = stringed.length; i < digits; i ++ )
	{
		padding += '0';
	};
	return padding + stringed;
	// so what about decimals? padding to right of decimal?
});
augment( Number, 'pow', function( exponent )
{
	return Math.pow( this, exponent );
});
augment( Number, 'radiansToDegrees', function()
{
	return this * 180 / Math.PI;
});
augment( Number, 'random', function( n )// beware, forces integer! but oh-so convenient.
{
	if( n !== undefined )
	{
		var min = Math.min( this, n );
		var max = Math.max( this, n );
		return min + Math.floor( Math.random() * ( max - min ));
	};
	return Math.floor( Math.random() * this );
});
augment( Number, 'round', function( decimals )
{
	decimals = decimals || 0;
	var n  = this;
	n *= Math.pow( 10, decimals );
	n  = Math.round( n );
	n /= Math.pow( 10, decimals );
	return n;
});
augment( Number, 'unixToYear', function()
{
	return ( new Date( this * 1000 )).getUTCFullYear();
});
augment( Number, 'yearToUnix', function()
{
	return ( new Date( this, 0, 0, 0, 0, 0, 0 )).valueOf() / 1000;
});
//  http://www.w3schools.com/jsref/jsref_obj_date.asp




augment( String, 'capitalize', function()
{
	return this.charAt( 0 ).toUpperCase() + this.slice( 1 ).toLowerCase();
});
augment( String, 'downcase', function()
{
	return this.toLowerCase();
});
augment( String, 'isEmpty', function()
{
	return this.length === 0 ? true : false;
});
augment( String, 'multiply', function( n )
{
	n = cascade( n, 2 );
	var s = '';
	for( var i = 0; i < n; i ++ )
	{
		s += this;
	};
	return s;
});
augment( String, 'size', function()
{
	return this.length;
});
augment( String, 'reverse', function()
{
	var s = '';
	for( var i = 0; i < this.length; i ++ )
	{
		s = this[ i ] + s;
	};
	return s;
});
augment( String, 'upcase', function()
{
	return this.toUpperCase();
});