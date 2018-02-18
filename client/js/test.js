// https://rawgit.com/raneku/chessboardjs/master/www/releases/0.3.0-r1/test.html

function _remove_grey_squares() {
	$('#board .square-55d63').css( "background" , "" );
}

function _grey_square() {
	var squareEl = $( "#board .square-" + square );
	var background = "#a9a9a9";
	if ( squareEl.hasClass( "black-3c85d" ) === true) {
		background = "#696969";
	}
	squareEl.css( "background" , background );
}

function _on_drag_start( source , piece ) {
	// do not pick up pieces if the game is over
	// or if it's not that side's turn
	if ( game.game_over() === true ||
		( game.turn() === "w" && piece.search( /^b/ ) !== -1 ) ||
		( game.turn() === "b" && piece.search( /^w/ ) !== -1 ) ) {
		return false;
	}
}

function _on_drop( source , target , piece , newPos , oldPos , orientation ) {

	console.log("Source: " + source);
	console.log("Target: " + target);
	console.log("Piece: " + piece);
	console.log("New position: " + ChessBoard.objToFen(newPos));
	console.log("Old position: " + ChessBoard.objToFen(oldPos));
	console.log("Orientation: " + orientation);
	console.log("--------------------");

	_remove_grey_squares();
	// see if the move is legal
	var move = game.move({
		from: source,
		to: target,
		promotion: "q" // NOTE: always promote to a queen for example simplicity
	});

	// illegal move
	if ( move === null ) return "snapback";
}

function _on_mouse_over_square( square , piece ) {
	// get list of possible moves for this square
	var moves = game.moves({
		square: square,
		verbose: true
	});

	// exit if there are no moves available for this square
	if ( moves.length === 0 ) { return; }

	// highlight the square they moused over
	_grey_square( square );

	// highlight the possible squares for this piece
	for ( var i = 0; i < moves.length; i++ ) {
		board.addArrowAnnotation( square , moves[i].to );
		_grey_square( moves[i].to );
	}
}

function _on_mouse_out_square( square , piece ) {
	//board.clearAnnotation();
	_remove_grey_squares();
}

function _on_snap_end() {
	board.position( game.fen() );
}

var game = board = null;
function INIT() {
	game = new Chess();
	const cfg = {
		draggable: true,
		position: "start",
		onDragStart: _on_drag_start ,
		onDrop: _on_drop ,
		onMouseoutSquare: _on_mouse_out_square ,
		onMouseoverSquare: _on_mouse_out_square ,
		onSnapEnd: _on_snap_end ,
		overlay: true
	};
	board = ChessBoard( "board" , cfg );
}

$( document ).ready( INIT );