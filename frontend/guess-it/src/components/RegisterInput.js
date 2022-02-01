import React from "react";

const userInput = (props) => {
  return (
    <div>
      <input
        placeholder="Enter Username"
        type="text"
        className="border p-2 rounded-md my-2 w-4/5 border-gray-300"
        onChange={(e) => props.setUsername(e.target.value)}
      />

      <input
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 cursor-pointer"
        value="Play"
      />
    </div>
  );
};

export default userInput;
