import React from "react";

const Leaderboard = (props) => {
  return (
    <div className="bg-white p-2 rounded shadow lg:w-3/4 mx-auto">
      <div className="users flex items-center justify-around ">
        {props.results
          .sort((a, b) => a.score < b.score)
          .map((user, i) => (
            <div className="user p-2 shadow my-2 rounded" key={"result" + i}>
              {i + 1}- {user.name} ({user.score}){" "}
              <span>{i == 0 ? "(king)" : ""}</span>
            </div>
          ))}
      </div>
    </div>
  );
};


export default Leaderboard