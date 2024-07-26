import React, { useState } from "react";

const symbols = ["π", "√", "∞", "∫", "Δ", "Σ", "∂", "±", "≈", "≠", "≤", "≥"];

export default function Keyboard({ onInsertSymbol }) {
  const [keyCounter, setKeyCounter] = useState(0);

  return (
    <div className="flex flex-wrap p-2 border border-gray-400 rounded mt-4">
      {symbols.map((symbol, index) => (
        <button
          key={`${index}-${keyCounter}`}
          onClick={(e) => {
            onInsertSymbol(symbol, e);
            setKeyCounter(prevKeyCounter => prevKeyCounter + 1);
          }}
          className="m-1 p-2 bg-orange-200 rounded hover:bg-orange-300 active:bg-orange-400 focus:outline-none"
        >
          {symbol}
        </button>
      ))}
    </div>
  );
}
