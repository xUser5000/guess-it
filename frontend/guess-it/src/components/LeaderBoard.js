import React from "react";

const Leaderboard = (props) => {
  let colors = ["green", "blue"];
  return (
    <div className="players w-full lg:w-2/6 bg-white min-h-64 shadow p-5 mt-2 mx-auto">
      <h1 className="text-3xl font-bold mb-4">LeaderBoard</h1>
      <div className="flex w-4/5 lg:w-full md:w-full mx-auto my-3 flex-wrap items-center justify-around">
        {props.results
          .sort((a, b) => a.score < b.score)
          .map((player, i) => (
            <div
              className="player flex items-center w-full mb-4"
              key={"player" + i}
            >
              <div className="player-avatar">
                <div
                  className={
                    "w-12 h-12 rounded-full  mr-3 " + `bg-${colors[i]}-900`
                  }
                ></div>
              </div>
              <div className="player-name text-left">
                <p className="font-semibold">{player.name}</p>
                <p className="font-bold text-sm text-gray-700">
                  <span className="text-blue-500">{player.score}</span> points
                </p>
              </div>
            </div>
          ))}
      </div>
      <div className="my-3">
        <button
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-500"
          onClick={() => {
            props.setIsRoundReady(false);
            props.setIsContestEnd(false)
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
