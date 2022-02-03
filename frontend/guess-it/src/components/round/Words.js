import React from "react";

const Words = (props) => {
  return (
    <div className="words flex items-center my-5 mx flex-wrap justify-around w-full lg:w-3/4 text-center mx-auto">
      {props.choices.map((choice, i) => (
        <div
          className="key-wrapper flex items-center justify-center flex-col mx-3"
          key={"word" + i}
        >
          <a
            href="#"
            className="word shadow rounded px-4 py-2 mb-3 cursor-pointer border hover:bg-gray-200"
            onClick={(e) => {
                e.preventDefault()
              props.socket.emit("select", i);
            }}
          >
            {choice}
          </a>
          <div className="key shadow w-6 text-xs border border-gray-700 rounded hidden lg:block md:block">
            {i + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Words;