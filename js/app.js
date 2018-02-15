//Create a list that holds all of the cards
let icons = ['motorcycle', 'motorcycle', 'leaf', 'leaf', 'basketball', 'basketball', 'anchor', 'anchor', 'plane', 'plane', 'sun', 'sun', 'smile', 'smile', 'gem', 'gem'];
//Store the number of moves and if a match is found
let moves = 0;
let match = 0;
//Array to keep track of open cards
opened = [];
let game_started = false;
let $restart = $('.restart');
//Game Timer Code reference from  https://albert-gonzalez.github.io/easytimer.js/
let timer = new Timer();
timer.addEventListener('secondsUpdates', function(e) {
	$('#timer').html(timer.getTimeValues().toString());
});
//Restart the game
$('#reset-button').click(restartGame);

function createCard(card) {
	$('#deck').append('<li class="card animated"><i class="fa ${card}"></i></li>');
}
//Generate random cards on deck
function generateCards() {
	for (const i = 0; i < 2; i++) {
		cardLists = suffle(cardLists);
		cardLists.forEach(createCard);
	}
}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue, randomIndex;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}
//Card flipping
function toggleCard() {
	if (game_started == false) {
		game_started = true;
		timer.start();
	}
	if (openCards.length === 0) {
		$(this).toggleClass("show open").animateCass('flipInY');
		openCards.push($(this));
		disableClick();
	} else if (openCards.length === 1) {
		//update Moves
		updateMoves();
		$(this).toggleClass("show open").animateCss('flipInY');
		openCards.push($(this));
		setTimeout(matchOpenCards, 1100);
	}
}
//Disallow clicks of open cards
function disableClick() {
	openCards.forEach(function(card) {
		card.off('click');
	});
}
// Enabling click on the open card
function enableClick() {
	openCards[0].click(toggleCard);
}
//Card Matching
function matchOpenCards() {
	if (openCards[0][0].firstChild.className == openCards[1][0].firstChild.className) {
		console.log("matchCard");
		openCards[0].addClass("match").animateCss('pulse');
		openCards[1].addClass("match").animateCss('pulse');
		disableCLick();
		removeOpenCards();
		setTimeout(checkWin, 1000);
	} else {
		openCards[0].toggleClass("show open").animateCss('flipInY');
		openCards[1].toggleClass("show open").animateCss('flipInY');
		enableClick();
		removeOpenCards();
	}
}

function removeOpenCards() {
	openCards = [];
}
//Animations
$.fn.extend({
	animateCss: function(animationName) {
		let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		this.addClass(animationName).one(animationEnd, function() {
			$(this).removeClass(animationName);
		});
		return this;
	}
});
//Calculate moves
function updateMoves() {
	moves += 1;
	$('.moves').html('${moves}  ');
	if (moves == 32) {
		addBlankStar();
	} else if (moves == 16) {
		addBlankStar();
	}
}
//Adding Blank stars
function addBlankStar() {
	$('#stars').children()[0].remove();
	$('#stars').append('<li><i class="fa fa-star-o"></i></li>');
}
//Adding Initial Stars
function addStars() {
	for (const i = 0; i < 3; i++) {
		$('#stars').append('<li><i class="fa fa-star"></i></li>');
	}
}
//Restarting the game https://sweetalert2.github.io/
$restart.bind('click', () => {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Are you sure?',
		text: "Your progress will be Lost!",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#02ccba',
		cancelButtonColor: '#f95c3c',
		confirmButtonText: 'Yes, Restart Game!'
	}).then((isConfirm) => {
		if (isConfirm) {
			moves = 0;
			match_found = 0;
			$('#deck').empty();
			$('#stars').empty();
			$('#game-deck')[0].style.display = "";
			$('#sucess-result')[0].style.display = "none";
			game_started = false;
			timer.stop();
			$('#timer').html("00:00:00");
			init();
		}
	})
})
//Initialization
function init() {
	generateCards();
	$('.card').click(toggleCard);
	$('.moves').html("0  ");
	addStars(3);
}
//Open Popup showing results https://sweetalert2.github.io/
let gameOver = function(moves, score) {
	let msg = score == 1 ? score + ' Star' : score + ' Stars';
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Congratulations! You Won!',
		text: 'With ' + moves + ' Moves and ' + msg + '\n Woooooo!',
		type: 'success',
		confirmButtonColor: '#02ccba',
		confirmButtonText: 'Play again!'
	}).then((isConfirm) =>
		if (isConfirm) {
			game_started = false;
			timer.stop();
			$('#timer').html("00:00:00");
			init();
		}
	})
//start the game
init();
