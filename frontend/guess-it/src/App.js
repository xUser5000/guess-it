import "./App.css";
import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import RegisterUser from "./components/RegisterUser";

const ENDPOINT = "http://127.0.0.1:5000";

const socket = socketIOClient(ENDPOINT);
function App() {
  const [username, setUsername] = useState("");
  const [isRoundReady, setIsRoundReady] = useState(false);

  socket.on("contest", (contest) => {
    console.log(contest);
  });
  

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
        <nav
          className="
          w-full
          h-16
          bg-white
          absolute
          top-0
          flex
          items-center
          justify-between
          px-4
        "
        >
          <h1 className="logo font-bold">Guess It</h1>
          <ul className="social flex items-center justify-around">
            <li className="mx-2">facbook</li>
            <li className="mx-2">twitter</li>
          </ul>
        </nav>

        <div
          className="
          container
          bg-white
          w-3/4
          lg:w-2/5
          rounded
          shadow
          mx-auto
          p-3
          py-5
        "
        >
          {(isRoundReady && <h1>Contest Is Ready</h1>) || (
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
