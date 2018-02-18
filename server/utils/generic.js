require( "shelljs/global" );

function W_SLEEP( ms ) { return new Promise( resolve => setTimeout( resolve , ms ) ); }
module.exports.wSleep = W_SLEEP;

function W_PKILL( wName ) {
	if ( !wName ) { return; }
	exec( "sudo pkill -9 " + wName , { silent: true , async: false } ); 
}
module.exports.pKill = W_PKILL;