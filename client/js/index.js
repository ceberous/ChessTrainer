// http://chessboardjs.com/examples#1003
const ruyLopez = "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R";

function _on_drop( source , target , piece , newPos , oldPos , orientation )  {
	console.log("Source: " + source);
	console.log("Target: " + target);
	console.log("Piece: " + piece);
	console.log("New position: " + ChessBoard.objToFen(newPos));
	console.log("Old position: " + ChessBoard.objToFen(oldPos));
	console.log("Orientation: " + orientation);
	console.log("--------------------");
}

function INIT() {
	const cfg = {
		draggable: true ,
		position: "start" ,
		onDrop: _on_drop ,
		//sparePieces: true
	};
	var board = ChessBoard( "board" , cfg );
}

$( document ).ready( INIT );