import { useState, useEffect } from "react";
import type { UserSchema } from "../types/tableTypes";
import defaultPic from "../assets/user.png";

function ActiveUser() {
  const [activeUser, setActiveUser] = useState<UserSchema>();
  useEffect(() => {
    const storedUser = localStorage.getItem("activeUser");
    if (storedUser !== null) {
      setActiveUser(JSON.parse(storedUser));
    }
  }, []);

  if (activeUser) {
    return (
      <div>
        <img
          src={activeUser.profilePic ? activeUser.profilePic : defaultPic}
          alt="Profile picture"
        />
        <p>{activeUser.firstName}</p>
      </div>
    );
  }
}

export default ActiveUser;
