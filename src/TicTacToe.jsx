import { useEffect, useState } from "react";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ blue: 0, red: 0 });
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Load scores from localStorage on component mount
    const storedScores = JSON.parse(localStorage.getItem("ticTacToeScores"));
    if (storedScores) {
      setScores(storedScores);
    }
  }, []);

  useEffect(() => {
    // Save scores to localStorage whenever they change
    localStorage.setItem("ticTacToeScores", JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    // Check for a winner on every board change
    const winner = calculateWinner(board);
    let status;
    if (winner) {
      status = `Winner: ${winner === "X" ? "Blue" : "Red"}`;
      // Move the winner calculation outside the state update
      const winningPlayer = winner === "X" ? "blue" : "red";
      setScores((prevScores) => ({
        ...prevScores,
        [winningPlayer]: prevScores[winningPlayer] + 1,
      }));
    } else if (board.every((square) => square !== null)) {
      status = "It's a Draw!";
    } else {
      status = `Next Player: ${xIsNext ? "Blue" : "Red"}`;
    }
    setStatus(status);
  }, [board, xIsNext]);

  const calculateWinner = (squares) => {
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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    const squares = [...board];
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    setBoard(squares);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
  };

  return (
    <div className="tic-tac-toe">
      <div className="status">{status}</div>
      <div className="board">
        {board.map((square, i) => (
          <div key={i} className="square" onClick={() => handleClick(i)}>
            {square}
          </div>
        ))}
      </div>
      <div className="scores">
        <p>Blue: {scores.blue}</p>
        <p>Red: {scores.red}</p>
      </div>
      <button onClick={resetGame}>Reset Game</button>
    </div>
  );
};

export default TicTacToe;
