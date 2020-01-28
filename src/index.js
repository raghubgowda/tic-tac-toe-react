import React from 'react';
import ReactDom from 'react-dom';
import './index.css';

function Square(props){
    const className = props.highLight ? 'highlighted' : 'square';
    return(
        <button 
            className={className}
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
                value={this.props.squares[i]}
                updateSquareValue= {() => this.props.onClick(i)}
                highLight={winnerLine && winnerLine.includes(i)}
            />
        );
    }

    render(){
        return(
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            history: [{squares: Array(9).fill(null)}],
            isXNext: true,
            stepNumber: 0,
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
            history: history.concat([{squares: squares}]), 
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
            history: [{squares: Array(9).fill(null)}],
            isXNext: true,
            stepNumber: 0,
        });
    }

    render(){
        const history = this.state.history;
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #'+move : '';
            if(desc !== ''){
                return(
                    <li key={move}>
                       <button onClick={ () => this.jumpTo(move)}>{desc}</button> 
                    </li>
                );
            }
            else
                return null;
        });
        const current = history[this.state.stepNumber];
        const winnerLine = calculateWinner(current.squares);
        let status;
        if (winnerLine && winnerLine[0] !== -1) {
            status = 'Winner: ' + current.squares[winnerLine[0]];
        } 
        else if (winnerLine && winnerLine[0] === -1) {
            status = 'Match drwan!!!';
        }
        else {
            status = 'Next player: ' + (this.state.isXNext ? 'X' : 'O');
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