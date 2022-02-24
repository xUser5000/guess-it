import "./App.css";
import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import RegisterUser from "./components/RegisterUser";
import Nav from "./components/Nav";
import Contest from "./components/Contest";
import Leaderboard from "./components/LeaderBoard";

const ENDPOINT = "http://192.168.1.11:5000";

const socket = socketIOClient(ENDPOINT);
function App() {
  const [username, setUsername] = useState("");
  const [isRoundReady, setIsRoundReady] = useState(false);
  const [isContestEnd, setIsContestEnd] = useState(false);
  const [finalResults, setFinalResults] = useState([]);

  useEffect(() => {
    socket.on("end", (finalResults) => {
      setFinalResults(finalResults);
      setIsRoundReady(false)
      setIsContestEnd(true);
    });
  }, []);

  return (
    <div className="App">
      <div
        className="
        min-h-screen
        bg-gray-200
        flex flex-col
        justify-center
        relative
        pt-32
        pb-32
      "
      >
        <Nav />
        <div
          className="
                 "
        >
          {(isRoundReady && <Contest socket={socket} />) ||
            (isContestEnd && <Leaderboard results={finalResults} setIsRoundReady={setIsRoundReady} setIsContestEnd={setIsContestEnd} />) || (
              <RegisterUser
                socket={socket}
                username={username}
                setUsername={setUsername}
                setIsRoundReady={setIsRoundReady}
              />
            )}

        </div>
      </div>
    </div>
  );
}

export default App;
