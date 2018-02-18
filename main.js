process.on( "unhandledRejection" , function( reason , p ) {
	console.error( reason, "Unhandled Rejection at Promise" , p );
	console.trace();
});
process.on( "uncaughtException" , function( err ) {
	console.error( err , "Uncaught Exception thrown" );
	console.trace();
});

const port = process.env.PORT || 1033;
const ip = require("ip");
const WebSocket = require( "ws" );


const SFWrapper = require( "./server/utils/stockfishWrapper.js" );

( async ()=> {
	
	await SFWrapper.init();
	const isReady = await SFWrapper.isReady();
	console.log( "Is Ready ??? " + isReady );
	await SFWrapper.reset();
	await SFWrapper.loadFEN( "7K/8/k1P5/7p/8/8/8/8 w - -" );
	await SFWrapper.eval( 30 );

	process.on( "SIGINT" , async function () {
		await require( "./server/utils/stockfishWrapper.js" ).close();
	});

})();