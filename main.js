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


const StockFish = require( "./server/utils/stockfishWrapper.js" );

( async ()=> {
	
	await StockFish.init();
	const isReady = await StockFish.isReady();
	console.log( "Is Ready ??? " + isReady );
	await StockFish.reset();
	await StockFish.loadFEN( "7K/8/k1P5/7p/8/8/8/8 w - -" );
	var lines = await StockFish.eval( 20 );
	console.log( lines );

	process.on( "SIGINT" , async function () {
		await StockFish.close();
	});

})();