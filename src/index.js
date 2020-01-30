import React from 'react';
import ReactDom from 'react-dom';
import './index.css';

function Square(props){
    const className = props.highLight ? ' highlighted' : '';
    return(
        <button 
            id={props.id}
            className={'square'+className}
            onClick={props.updateSquareValue}>
                {props.value}
        </button>
    );
}

class Board extends React.Component{
    renderSquare(i){
        const winnerLine = this.props.winnerLine;
        return (
            <Square 
                key={'sqr'+i}
                value={this.props.squares[i]}
                updateSquareValue= {() => this.props.onClick(i)}
                highLight={winnerLine && winnerLine.includes(i)}
            />
        );
    }

    render(){
        let squares = [];
        for(let i=0; i<=2; i++){
            let rows = [];
            for(let j=i*3; j<=(i*3)+2; j++){
                rows.push(this.renderSquare(j));
            }
            squares.push(<div key={'btn'+i} className="board-row">{rows}</div>);
        }
        return(<div>{squares}</div>);
    }
}

class Game extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            history: [{squares: Array(9).fill(null), lastClicked: 0}],
            isXNext: true,
            stepNumber: 0,
            isAscending: true,
        };
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.isXNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{squares: squares, lastClicked: i}]), 
            isXNext: !this.state.isXNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            isXNext: (step % 2) === 0,
        });
    }

    restart(){
        this.setState({
            history: [{squares: Array(9).fill(null), lastClicked: 0}],
            isXNext: true,
            stepNumber: 0,
            isAscending: true,
        });
    }

    toggleSortMoves(){
        this.setState({isAscending: !this.state.isAscending});
    }

    render(){
        const {history, stepNumber} = this.state;
        const moves = history.map((step, move) => {
            const {lastClicked} = step;
            const row = 1 + Math.floor(lastClicked / 3);
            const col = 1 + lastClicked % 3;
            const desc = move ? `Go to move # ${move} (${row}, ${col})` : '';
            if(desc !== ''){
                return(
                    <li key={move}>
                       <button 
                        className={move === stepNumber ? ' move-selected' : ''} 
                        onClick={ () => this.jumpTo(move)}>{desc}
                       </button> 
                    </li>
                );
            }
            else
                return null;
        });
        
        if(!this.state.isAscending){
            moves.reverse();
        }
        const current = history[stepNumber];
        const winnerLine = calculateWinner(current.squares);
        let status;
        if (winnerLine && winnerLine[0] !== -1) {
            status = 'Winner: ' + current.squares[winnerLine[0]];
        } 
        else if (winnerLine && winnerLine[0] === -1) {
            status = 'Match Drwan!!!';
        }
        else {
            status = 'Next Player: ' + (this.state.isXNext ? 'X' : 'O');
        }

        return(
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winnerLine={winnerLine}
                    />
                </div>
                <div className="game-info">
                    <button onClick={() => this.restart()}>Restart</button><br/><br/>
                    <div>{status}</div>
                    <br/>
                    <button onClick={() => this.toggleSortMoves()}>{this.state.isAscending ? 'Descending' : 'Ascending'}</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

ReactDom.render(
    <div><Game /></div>, document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return lines[i];
      }
    }
    if(squares.includes(null)) 
        return null 
    else
        return [-1];
  }