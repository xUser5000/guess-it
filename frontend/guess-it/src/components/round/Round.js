import React from "react";
import Words from "./Words";
import Players from "./Players";
const Round = (props) => {
  return (
    <div className="container w-full p-5 roudned mx-auto text-center flex items-start justify-around flex-wrap">
      <div className="round w-full lg:w-4/6 my-2 bg-white min-h-64 shadow p-2">
        <div className="text-center text-gray-700">Round {props.round.id} of {props.round.maxRounds}</div>
        <img
          src={props.round.image}
          className="rounded h-80 mx-auto my-3 object-cover"
          alt=""
        />
        <Words choices={props.round.choices}  socket={props.socket}/>
      </div>
      <Players players={props.round.users} />
    </div>
  );
};

export default Round;
