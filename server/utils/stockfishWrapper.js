const { spawn } = require( "child_process" );
const sleep = require( "./generic.js" ).wSleep;
const pkill = require( "./generic.js" ).pKill;
var stockfish = null;

function INITIALIZE() {
	return new Promise( async function( resolve , reject ) {
		try {
			if ( stockfish !== null ) {
				stockfish = null;
				await sleep( 500 );
				pkill( "stockfish" );
				await sleep( 500 );
			}
			stockfish = spawn( "stockfish" );

			stockfish.stdout.on( "data" , ( data ) => {
				//console.log( `debug-stdout: ${data}` );
			});

			stockfish.stderr.on( "data" , ( data ) => {
				if ( data ) { console.log( `stderr: ${data}` ); }
			});

			stockfish.on( "close" , ( code ) => {
				console.log( `stockfish exited with code ${code}` );
			});
			await SET_OPTIONS();
			resolve();
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}
module.exports.init = INITIALIZE;

function CLOSE() {
	return new Promise( function( resolve , reject ) {
		try {
			if ( stockfish !== null ) { stockfish.kill( "SIGINT" ); }
			pkill( "stockfish" );
			resolve();
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}
module.exports.close = CLOSE;

function SEND_COMMAND( wCommand ) {
	return new Promise( function( resolve , reject ) {
		try {
			if ( stockfish === null ) { resolve(); return; }
			console.log( `${wCommand}\n` );
			stockfish.stdin.write( `${wCommand}\n` );
			resolve();
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}

function SEND_COMMAND_GET_RESPONSE( wCommand ) {
	return new Promise( function( resolve , reject ) {
		try {
			if ( stockfish === null ) { resolve(); return; }
			console.log( `${wCommand}\n` );
			stockfish.stdin.write( `${wCommand}\n` );
			stockfish.stdout.once( "data" , ( data ) => {
				console.log( data.toString().trim() );
				resolve( data.toString().trim() );
				return;
			});
			setTimeout( function() {
				resolve();
			} , 30000 );
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}

function UPDATE_OPTION( wOption , wValue ) {
	return new Promise( function( resolve , reject ) {
		try {
			if ( stockfish === null ) { resolve(); return; }
			SEND_COMMAND( `setoption name ${ wOption } value ${ wValue }` );
			resolve();
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}
module.exports.updateOption = UPDATE_OPTION;

function SET_OPTIONS( wOptions ) {
	return new Promise( async function( resolve , reject ) {
		try {
			if ( stockfish === null ) { resolve(); return; }
			wOptions = wOptions || {
				Threads: 4 ,
				Hash:  1024 ,
				MultiPV: 6
			};
			for ( var xOption in wOptions ) {
				const x11 = `setoption name ${ xOption } value ${ wOptions[ xOption ] }`;
				SEND_COMMAND( x11 );
				await sleep( 300 );
			}
			resolve();
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}
module.exports.setOptions = SET_OPTIONS;

function IS_READY() {
	return new Promise( async function( resolve , reject ) {
		try {
			if ( stockfish === null ) { resolve(); return; }
			const answer = await SEND_COMMAND_GET_RESPONSE( "isready" );
			if ( answer === "readyok" ) { resolve( true ); return; }
			else { resolve( false ); return; }
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}
module.exports.isReady = IS_READY;

function RESET_STOCKFISH() {
	return new Promise( async function( resolve , reject ) {
		try {
			await SEND_COMMAND( "ucinewgame" );
			resolve();
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}
module.exports.reset = RESET_STOCKFISH;

function LOAD_FEN( wFenString ) {
	return new Promise( async function( resolve , reject ) {
		try {
			wFenString = wFenString || "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1";
			await SEND_COMMAND( `position fen ${ wFenString }` );
			resolve();
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}
module.exports.loadFEN = LOAD_FEN;

function EVAL( wDepth ) {
	return new Promise( async function( resolve , reject ) {
		try {
			if ( stockfish === null ) { resolve(); return; }
			wDepth = wDepth || 20;
			stockfish.stdin.write( `go depth ${ wDepth }\n` );
			var cached_depth_line = null;
			stockfish.stdout.on( "data" , ( data ) => {
				var xstd_out = data.toString().trim();
				var xsplit = xstd_out.split( " " );
				if ( xsplit[ 0 ] === "info" && xsplit[ 1 ] === "depth" ) {
					cached_depth_line = xstd_out;
				}
				if ( xsplit[ 0 ] === "bestmove" ) {
					var wLines = [];

					var pv_lines = cached_depth_line.split( "\n" );
					console.log( "PV_Lines Length === " + pv_lines.length.toString() );
					const upper_bound = ( pv_lines.length );
					for ( var i = 0; i < upper_bound; ++i ) {
						const isplit = pv_lines[ i ].split( " " );
						const pv_string = pv_lines[ i ].split( "pv " )[ 2 ];
						const pv_array = pv_string.split( " " );
						wLines.push({
							score_text: isplit[ 8 ] ,
							score: isplit[ 9 ] ,
							pv_string: pv_string ,
							pv: pv_array
						});
					}
					resolve( wLines );
					return;
				}
			});
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}
module.exports.eval = EVAL;