const App = {
    // All of our selected HTML elements 
    $: {
        // menu: document.querySelector('.menu'),
        // menuItems: document.querySelector('.items'),
        
        // using data-id selector for more stability like in case you change you class so will not make an impact on that

        menu: document.querySelector('[data-id="menu"]'),
        menuItems: document.querySelector('[data-id="menu-items"]'),
        resetBtn: document.querySelector('[data-id="reset-btn"]'),
        newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
        square: document.querySelectorAll('[data-id="square"]'),
        modal: document.querySelector('[data-id="modal"]'),
        modalText: document.querySelector('[data-id="modal-text"]'),
        modalBtn: document.querySelector('[data-id="modal-btn"]'),
        turn: document.querySelector('[data-id="turn"]'),
    },

    state: {
        moves: [],
    },

    getGameStatus(moves) {

        const p1Moves = moves.filter(move => move.playerId === 1).map(move => +move.squareId)
        const p2Moves = moves.filter(move => move.playerId === 2).map(move => +move.squareId)

        console.log(p1Moves);

        const winningPatterns = [
            [1, 2, 3],
            [1, 5, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 5, 7],
            [3, 6, 9],
            [4, 5, 6],
            [7, 8, 9],
        ];

        let winner = null
        winningPatterns.forEach(pattern => {
            const p1Wins = pattern.every(value => p1Moves.includes(value))
            const p2Wins = pattern.every(value => p2Moves.includes(value))

            if(p1Wins) winner = 1;
            if(p2Wins) winner = 2;
        });

        return {
            status: moves.length === 9 || winner != null ? 'complete' : 'in-progress', // in-progress || complete
            winner, // 1 || 2 || null
        };
    },

    // init method is going to be where we are going to add event listeners to our application
    // a shorthand way to define a function property on an object that we're calling app
    init() {
        App.registerEventListeners();
    },

    registerEventListeners() {

        // console.log(App.$.square);

        App.$.menu.addEventListener('click',(event) => {
            // console.log(event);
            App.$.menuItems.classList.toggle('hidden')
        });

        App.$.resetBtn.addEventListener('click',(event) => {
            console.log('reset the game')
        });


        // RESET
        App.$.newRoundBtn.addEventListener('click',(event) => {
            console.log('new rond');
        });

        App.$.modalBtn.addEventListener('click',event => {
            App.state.moves = []
            App.$.square.forEach(square => square.replaceChildren());
            App.$.modal.classList.add('hidden')
        })

        App.$.square.forEach((square) => {
            square.addEventListener('click',(event) => {
                console.log(`square widh id ${event.target.id} was clicked`);

                console.log(`current player is ${App.state.currentPlayer}`);

                
                // Checkif there is already a play, if so, return early
                const hasMove = (squareId) => {
                    const existingMove = App.state.moves.find(move => move.squareId === squareId)
                    return existingMove !== undefined
                }


                if(hasMove(+square.id)) {
                    return;
                }

                // Determine which player icon to add the square
                const lastMove = App.state.moves.at(-1) // at with -1 grab the last element of the array
                const getOppositePlayer = (playerId) => playerId === 1 ? 2 : 1;
                const currentPlayer = App.state.moves.length === 0 ? 1 : getOppositePlayer(lastMove.playerId);

                const nextPlayer = getOppositePlayer(currentPlayer);

                const squareIcon = document.createElement('i');
                const turnIcon = document.createElement('i');
                const turnLabel = document.createElement('p');
                turnLabel.innerText = `Player ${nextPlayer}, you are up!`

                if(currentPlayer === 1) {
                    squareIcon.classList.add('fa-solid','fa-x','turquoise')
                    turnIcon.classList.add('fa-solid','fa-o','yellow')
                    turnLabel.classList = 'yellow';
                }
                else {
                    squareIcon.classList.add('fa-solid','fa-o','yellow')
                    turnIcon.classList.add('fa-solid','fa-x','turquoise')
                    turnLabel.classList = 'turquoise';
                }

                App.$.turn.replaceChildren(turnIcon,turnLabel);

                App.state.moves.push({
                    squareId: +square.id, // + is because we want number here
                    playerId: currentPlayer
                })

                App.state.currentPlayer = currentPlayer === 1 ? 2 : 1; // if player is 1 then assign to 2 and if it 2 assign to 1

                console.log(App.state);
                
                square.replaceChildren(squareIcon)

                // Check if there is a winner or a tie game

                const game = App.getGameStatus(App.state.moves);

                console.log(game);




                if(game.status === 'complete') {

                    App.$.modal.classList.remove('hidden')
                    let message = '';
                    if(game.winner) {
                        // alert(`Playyer ${game.winner} wins`)
                        message = `Player ${game.winner} Wins!`;
                    }
                    else {
                        // alert('Tie!')
                        message = 'Tie Game!'
                    }

                    App.$.modalText.textContent = message;
                }
                
            })
        });
    }
};


window.addEventListener('load',App.init);