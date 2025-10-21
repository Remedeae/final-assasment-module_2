import { useEffect, useState } from "react";

function Timer() {
  const [timePlayed, setTimePlayed] = useState(0);
  const [stopTimer, setStopTimer] = useState(false);

  useEffect(() => {
    let i: number;
    if (!stopTimer) {
      i = setInterval(() => {
        setTimePlayed((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(i);
  }, [stopTimer]);

  return (
    <div className="timer">
      <div>
        <h2>Minutes played:</h2>
        <h2>{timePlayed}</h2>
      </div>
      <button onClick={() => setStopTimer(true)}>STOP</button>
    </div>
  );
}

export default Timer;
