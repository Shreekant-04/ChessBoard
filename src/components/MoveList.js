import React from "react";

const MoveList = ({ moveList }) => {
  const blackMoves = moveList.filter((moves) => moves.color === "b");
  const whiteMoves = moveList.filter((moves) => moves.color === "w");
  return (
    <div className="mt-4 w-full">
      <h3 className="font-bold">Move List</h3>
      <div>
        <ul className="list-none list-inside flex flex-wrap	">
          <h3>
            <b>Black</b>
          </h3>
          {blackMoves.map((move, index) => (
            <li key={index} className="px-2">
              {move.from}-{move.to},
            </li>
          ))}
        </ul>
        <ul className="list-none list-inside flex flex-wrap	">
          <h3>
            <b>White</b>
          </h3>
          {whiteMoves.map((move, index) => (
            <li key={index} className="px-2">
              {move.from}-{move.to},
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MoveList;
