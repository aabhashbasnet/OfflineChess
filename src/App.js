import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import './App.css';
import {
  WhiteKing, WhiteQueen, WhiteRook, WhiteBishop, WhiteKnight, WhitePawn,
  BlackKing, BlackQueen, BlackRook, BlackBishop, BlackKnight, BlackPawn
} from 'react-chess-pieces';

function App() {
  const [game, setGame] = useState(new Chess());
  const [flipped, setFlipped] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [capturedPieces, setCapturedPieces] = useState([]);

  const customPieces = {
    w: {
      k: <WhiteKing />,
      q: <WhiteQueen />,
      r: <WhiteRook />,
      b: <WhiteBishop />,
      n: <WhiteKnight />,
      p: <WhitePawn />
    },
    b: {
      k: <BlackKing />,
      q: <BlackQueen />,
      r: <BlackRook />,
      b: <BlackBishop />,
      n: <BlackKnight />,
      p: <BlackPawn />
    }
  };

  useEffect(() => {
    updateCapturedPieces();
  }, [game]);

  const updateCapturedPieces = () => {
    const history = game.history({ verbose: true });
    const captured = history
      .filter(move => move.captured)
      .map(move => move.captured.toUpperCase());
    setCapturedPieces(captured);
  };

  const onDrop = (sourceSquare, targetSquare) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (move) {
        setMoveHistory([...moveHistory, move.san]);
        updateCapturedPieces();
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };

  const resetGame = () => {
    setGame(new Chess());
    setMoveHistory([]);
    setCapturedPieces([]);
  };

  return (
    <div className="app">
      <div className="controls">
        <button onClick={() => setFlipped(!flipped)}>
          Flip Board
        </button>
        <button onClick={resetGame}>New Game</button>
        
        <div className="game-info">
          <h3>
            {game.isGameOver()
              ? 'Game Over'
              : `${game.turn() === 'w' ? 'White' : 'Black'}'s Turn`}
          </h3>
          <div className="captured">
            <h4>Captured Pieces:</h4>
            <div className="captured-pieces">
              {capturedPieces.join(', ')}
            </div>
          </div>
        </div>
      </div>

      <div className="board-container">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardOrientation={flipped ? 'black' : 'white'}
          customPieces={customPieces}
          boardWidth={600}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
          }}
        />
      </div>

      <div className="history">
        <h3>Move History</h3>
        <div className="move-list">
          {moveHistory.map((move, index) => (
            <div key={index} className="move">
              {`${index + 1}. ${move}`}
            </div>
          ))}
        </div>
      </div>

      {/* Show game over animation when game is finished */}
      {game.isGameOver() && (
        <div className="game-over-overlay">
          <div className="game-over-animation">
            <h2>
              {game.isCheckmate()
                ? 'Checkmate!'
                : game.isStalemate()
                ? 'Stalemate!'
                : 'Game Over!'}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
