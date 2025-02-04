import React, { useState } from 'react';
import { Action, State } from './game';

function Square(props: { value: string, onClick: React.MouseEventHandler, disabled: boolean }) {
  return <button disabled={props.disabled} onClick={props.onClick} className="square">{props.value}</button>;
}

export default function Board() {
  const [gameState, setGameState] = useState(State.initial());

  const isTerminal = gameState.isTerminal();
  
  const restart = () => setGameState(() => State.initial());
  const move = (action: Action) => setGameState(() => gameState.result(action));

  return (
    <>
      <h1>Tic-Tac-Toe</h1>
      <p><button onClick={restart}>Restart</button></p>
      <p><button disabled={isTerminal} onClick={() => move(gameState.decision())}>AI Move</button></p>
      <div className="board-row">
	<Square disabled={isTerminal} onClick={() => move(Action.Mark0)} value={gameState[0]} />
	<Square disabled={isTerminal} onClick={() => move(Action.Mark1)} value={gameState[1]} />
	<Square disabled={isTerminal} onClick={() => move(Action.Mark2)} value={gameState[2]} />
      </div>
      <div className="board-row">
	<Square disabled={isTerminal} onClick={() => move(Action.Mark3)} value={gameState[3]} />
	<Square disabled={isTerminal} onClick={() => move(Action.Mark4)} value={gameState[4]} />
	<Square disabled={isTerminal} onClick={() => move(Action.Mark5)} value={gameState[5]} />
      </div>
      <div className="board-row">
	<Square disabled={isTerminal} onClick={() => move(Action.Mark6)} value={gameState[6]} />
	<Square disabled={isTerminal} onClick={() => move(Action.Mark7)} value={gameState[7]} />
	<Square disabled={isTerminal} onClick={() => move(Action.Mark8)} value={gameState[8]} />
      </div>
    </>
  );
}
