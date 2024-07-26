import React, { useRef, useState } from "react";
import { CiKeyboard, CiImageOn } from "react-icons/ci";
import { FaArrowCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Tesseract from "tesseract.js";
import Keyboard from "../components/Keyboard";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export default function TextArea({
  showKeyboard,
  text,
  setShowKeyboard,
  setText,
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const contentEditableRef = useRef(null);
  const [imageURL, setImageURL] = useState(null);

  const handleKeyboardToggle = () => {
    setShowKeyboard(!showKeyboard);
  };

  const handleSearch = () => {
    navigate("/search", { state: text });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleInsertSymbol = (symbol, e) => {
    e.preventDefault();
    const contentEditable = contentEditableRef.current;
    const selection = window.getSelection();

    // Get the current cursor position (or create a new range at the end if no selection)
    let range;
    if (selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
    } else {
      range = document.createRange();
      range.setStart(contentEditable, contentEditable.childNodes.length); // Start at the end of contentEditable
      range.setEnd(contentEditable, contentEditable.childNodes.length); // End at the end of contentEditable
    }

    // Insert the symbol (if provided)
    if (symbol) {
      const textNode = document.createTextNode(symbol);
      range.deleteContents(); // Clear any existing content in the range
      range.insertNode(textNode); // Insert the new symbol
    }

    // Move the cursor to the end of the inserted symbol
    const newRange = document.createRange();
    newRange.setStartAfter(textNode); // Set the start after the inserted symbol
    newRange.setEndAfter(textNode); // Set the end after the inserted symbol

    // Collapse the range to the end (rightmost)
    newRange.collapse(false);

    // Update the selection with the new range
    selection.removeAllRanges();
    selection.addRange(newRange);

    // Ensure the contentEditable is focused
    contentEditable.focus();

    // Update the state with the new content
    setText(contentEditable.innerText);

    // Scroll to the end to keep the cursor visible
    contentEditable.scrollTop = contentEditable.scrollHeight;
  };

  const handleInputChange = (event) => {
    const inputText = event.target.innerText;
    setText(inputText);

    // Set cursor to the end after input
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(contentEditableRef.current);
    range.collapse(false); // Collapse range to end
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <div
      className={`bg-white p-4 shadow-md rounded-lg w-full max-w-3xl mx-auto ${
        showKeyboard ? "h-auto" : "h-48"
      }`}
    >
      <div
        ref={contentEditableRef}
        contentEditable
        onInput={handleInputChange}
        className="h-32 w-full p-4 overflow-auto border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
        style={{ resize: "none", whiteSpace: "pre-wrap" }}
      >
        {text}
      </div>
     
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={handleImageClick}
          className="text-orange-600 hover:text-orange-800 active:text-orange-900 focus:outline-none"
        >
          <CiImageOn className="text-3xl" />
        </button>

        <button
          onClick={handleKeyboardToggle}
          className="text-orange-600 hover:text-orange-800 active:text-orange-900 focus:outline-none ml-4"
        >
          <CiKeyboard size={29} />
        </button>
        <button
          className="text-orange-600 hover:text-orange-800 active:text-orange-900 focus:outline-none ml-auto"
          onClick={handleSearch}
        >
          <FaArrowCircleRight className="text-3xl" />
        </button>
      </div>
      {showKeyboard && <Keyboard onInsertSymbol={handleInsertSymbol} />}
    </div>
  );
}
