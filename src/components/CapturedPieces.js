import React from 'react';

const pieceIcons = {
  p: '♙', n: '♘', b: '♗', r: '♖', q: '♕', k: '♔',
  P: '♟', N: '♞', B: '♝', R: '♜', Q: '♛', K: '♚'
};

const CapturedPieces = ({ pieces, label }) => {
  return (
    <div className="w-full  p-2">
      <h3 className="font-bold">{label} Captured Pieces</h3>
      <div className="flex flex-wrap">
        {pieces.map((piece, index) => (
          <span key={index} className="text-2xl">
            {pieceIcons[piece]}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CapturedPieces;
