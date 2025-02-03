import React, { useState } from 'react';
import { State } from './game';

function Square(props: { value: string }) {
  return <button className="square">{props.value}</button>;
}

export default function Board() {
  const [gameState, setGameState] = useState(State.initial());

  const restart = () => setGameState(() => State.initial());
  const move = () => setGameState(() => gameState.result(gameState.decision()));

  return (
    <>
      <h1>Tic-Tac-Toe</h1>
      <p><button onClick={restart}>Restart</button></p>
      <p><button disabled={gameState.isTerminal()} onClick={move}>Move</button></p>
      <div className="board-row">
	<Square value={gameState[0]} />
	<Square value={gameState[1]} />
	<Square value={gameState[2]} />
      </div>
      <div className="board-row">
	<Square value={gameState[3]} />
	<Square value={gameState[4]} />
	<Square value={gameState[5]} />
      </div>
      <div className="board-row">
	<Square value={gameState[6]} />
	<Square value={gameState[7]} />
	<Square value={gameState[8]} />
      </div>
    </>
  );
}
