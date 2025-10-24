import { useEffect, useState } from "react";

function Timer() {
  const [timePlayed, setTimePlayed] = useState(0);
  const [timerStatus, setTimerStatus] = useState(true);
  const [timerStatusMsg, setTimerStatusMsg] = useState("STOP");

  /*   const session = useApiFetch((state) => state.data as UserSchema | null); //here we call the type of data
  const error = useApiFetch((state) => state.error);
  const fetchApi = useApiFetch((state) => state.apiFetchAsync);

  useEffect(() => {
    fetchApi(
      "post", //fetches with get
      `user/${id}`
    ); //fetches localhost:3000/user/:id
  }, [fetchApi, id]); //re-renders if the fetch or id changes
  console.log(user); */

  useEffect(() => {
    let i: number;
    if (timerStatus) {
      i = setInterval(() => {
        setTimePlayed((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(i);
  }, [timerStatus]);

  const handleTimerStatus = () => {
    if (timerStatus) {
      setTimerStatus(false);
      setTimerStatusMsg("START");
    } else {
      setTimerStatus(true);
      setTimerStatusMsg("STOP");
    }
  };

  const patchSessionMinutes = () => {};

  return (
    <div className="timer">
      <div>
        <h2>Minutes played:</h2>
        <h2>{timePlayed}</h2>
      </div>
      <button onClick={handleTimerStatus}>{timerStatusMsg}</button>
      <button onClick={patchSessionMinutes}>Save and Exit</button>
    </div>
  );
}

export default Timer;
