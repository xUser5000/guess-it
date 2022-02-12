import React, { useState, useEffect } from "react";

const Words = (props) => {
  var [isCorrect, setIscorrect] = useState(true);
  useEffect(() => {
    setIscorrect(true);
    props.socket.on("isCorrect", (isCorrect) => {
      setIscorrect(isCorrect);
    });
  }, [props.choices]);

  return (
    <div className="words flex items-center my-5 mx flex-wrap justify-around w-full lg:w-3/4 text-center mx-auto">
      {props.choices.map((choice, i) => (
        <div
          className="key-wrapper flex items-center justify-center flex-col mx-3 "
          key={"word" + i}
        >
          <button
            className={
              "word shadow rounded px-4 py-2 mb-3 cursor-pointer border " +
              (isCorrect ? "bg-gray-100   hover:bg-gray-200  " : "bg-red-500 text-white cursor-not-allowed")
            }
            
            onClick={(e) => {
              e.preventDefault();
              if (isCorrect) {
                props.socket.emit("select", i);
              }
            }}
            disabled={!isCorrect && true}
          >
            {choice}
          </button>
          <div className="key shadow w-6 text-xs border border-gray-700 rounded hidden lg:block md:block">
            {i + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Words;
