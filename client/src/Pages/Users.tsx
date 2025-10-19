import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Users() {
  const navigate = useNavigate();
  const [array, setArray] = useState<unknown[]>([]);

  const fetchApi = async () => {
    const response = await axios.get("http://localhost:3000/users");
    setArray(response.data);
  };

  useEffect(() => {
    fetchApi();
  }, []);
  return (
    <div>
      <div>
        {array.map((item: unknown, index: number) => (
          <div key={index}>{JSON.stringify(item)}</div>
        ))}
      </div>
      <button onClick={() => navigate("/")}>Add user</button>
    </div>
  );
}

export default Users;
