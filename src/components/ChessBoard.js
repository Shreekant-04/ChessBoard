import React, { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Timer from "./Timer";
import MoveList from "./MoveList";
import CapturedPieces from "./CapturedPieces";

const ChessBoard = () => {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [turn, setTurn] = useState("w");
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const [moveList, setMoveList] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [capturedPieces, setCapturedPieces] = useState({ w: [], b: [] });
  const [autoMoveTimeout, setAutoMoveTimeout] = useState(null);

  const whiteTimer = useRef(null);
  const blackTimer = useRef(null);

  useEffect(() => {
    if (turn === "w") {
      clearInterval(blackTimer.current);
      whiteTimer.current = setInterval(() => {
        setWhiteTime((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(whiteTimer.current);
      blackTimer.current = setInterval(() => {
        setBlackTime((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      clearInterval(whiteTimer.current);
      clearInterval(blackTimer.current);
    };
  }, [turn]);

  useEffect(() => {
    if (autoMoveTimeout) {
      clearTimeout(autoMoveTimeout);
    }

    const timeout = setTimeout(() => {
      const moves = game.moves();
      if (moves.length > 0) {
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        game.move(randomMove);
        setFen(game.fen());
        setMoveList([...moveList, randomMove]);
        setTurn(game.turn());
        setSelectedSquare(null);
        setLegalMoves([]);
      }
    }, 15000);

    setAutoMoveTimeout(timeout);

    return () => {
      clearTimeout(timeout);
    };
  }, [turn, moveList, game, autoMoveTimeout]);

  const onDrop = (sourceSquare, targetSquare) => {
    const legalMove = game
      .moves({ square: sourceSquare, verbose: true })
      .some((m) => m.to === targetSquare);

    if (!legalMove) {
      alert("Illegal move!");
      return false;
    }

    const promotion =
      (sourceSquare[1] === "7" && targetSquare[1] === "8") ||
      (sourceSquare[1] === "2" && targetSquare[1] === "1");

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: promotion ? "q" : undefined,
    });

    if (move === null) {
      alert("Illegal move!");
      return false;
    }

    if (move.captured) {
      setCapturedPieces((prev) => ({
        ...prev,
        [move.color === "w" ? "b" : "w"]: [
          ...prev[move.color === "w" ? "b" : "w"],
          move.captured,
        ],
      }));
    }

    setFen(game.fen());
    setMoveList([...moveList, move.san]);
    setTurn(game.turn());
    setSelectedSquare(null);
    setLegalMoves([]);
    return true;
  };

  const onSquareClick = (square) => {
    setSelectedSquare(square);
    const moves = game.moves({ square, verbose: true }).map((move) => move.to);
    setLegalMoves(moves);
  };

  const undoMove = () => {
    const move = game.undo();
    if (move) {
      setFen(game.fen());
      setMoveList(moveList.slice(0, -1));
      setTurn(game.turn());

      if (move.captured) {
        setCapturedPieces((prev) => {
          const updatedCaptured = [...prev[move.color === "w" ? "b" : "w"]];
          updatedCaptured.pop();
          return {
            ...prev,
            [move.color === "w" ? "b" : "w"]: updatedCaptured,
          };
        });
      }
    }
  };

  useEffect(() => {
    if (game.inCheck()) {
      alert("Check!");
    }
    if (game.isCheckmate()) {
      alert("Checkmate!");
    }
  }, [fen, game]);

  return (
    <div className="h-screen flex flex-col md:flex-row justify-evenly gap-4 overflow-hidden p-4">
      <div className="flex-1 flex justify-center items-center h-full">
        <div className="w-full max-w-md md:max-w-3xl h-full ml-8 	">
          <Chessboard
            position={fen}
            onPieceDrop={onDrop}
            onSquareClick={onSquareClick}
            boardWidth={Math.min(window.innerWidth, window.innerHeight) * 0.95}
            customSquareStyles={legalMoves.reduce(
              (acc, move) => {
                acc[move] = { backgroundColor: "rgba(0, 255, 0, 0.4)" };
                return acc;
              },
              { [selectedSquare]: { backgroundColor: "rgba(0, 0, 255, 0.4)" } }
            )}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center overflow-auto mt-4">
        <div className="flex items-center justify-evenly  w-4/5 md:mt-0 md:ml-8">
          <Timer label="White Timer" time={whiteTime} />
          <Timer label="Black Timer" time={blackTime} />
          <button
            onClick={undoMove}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Undo Move
          </button>
        </div>
        <MoveList moveList={game.history({ verbose: true })} />
        <CapturedPieces pieces={capturedPieces.w} label="White" />
        <CapturedPieces pieces={capturedPieces.b} label="Black" />
      </div>
    </div>
  );
};

export default ChessBoard;
