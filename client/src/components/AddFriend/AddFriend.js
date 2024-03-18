import "./AddFriend.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";

export default function AddFriend({ onClose }) {
  const [errorText, setErrorText] = useState("");
  const [friendUsername, setFriendUsername] = useState("");

  const userData = JSON.parse(localStorage.getItem("userData"));

  const addFriend = async () => {
    if (friendUsername === "") {
      setErrorText("* Please enter a username to add as a friend");
      return;
    }

    if (friendUsername === userData.username) {
      setErrorText(
        "* You cannot add yourself as friend, but you can be your own friend :)"
      );
      return;
    }

    try {
      const res = await axios.post("http://localhost:8800/addfriend", {
        userUsername: userData.username,
        friendUsername: friendUsername,
      });

      if (res.data.status === "success") {
        setErrorText("");
        onClose();
      } else {
        setErrorText(res.data.message);
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      setErrorText("* Something went wrong, please try again");
    }
  };

  return (
    <div className="add-friend-component">
      {console.log("in the add friend componenet")}
      <div className="add-friend-title">
        {console.log("in the add friend title componenet")}
        <div className="add-friend-title-text">
          {console.log("in the add friend title text componenet")}
          <h1>Add Friend</h1>
        </div>
        <div className="add-friend-close">
          <FontAwesomeIcon
            icon={faXmark}
            style={{ cursor: "pointer" }}
            onClick={onClose}
          />
        </div>
      </div>
      <div className="add-friend-subtitle">
        <div style={{ gridRow: "1" }}>
          <h3>You can add friends with their Harmony username.</h3>
        </div>
        <div style={{ gridRow: "2" }}>
          <p style={{ visibility: errorText === "" ? "hidden" : "visible" }}>
            {errorText}
          </p>
        </div>
      </div>
      <div className="add-friend-user-input">
        <div className="add-friend-input">
          <input
            type="text"
            onChange={(e) => setFriendUsername(e.target.value)}
          />
        </div>
        <div className="add-friend-button">
          <button type="submit" onClick={addFriend}>
            Send Friend Request
          </button>
        </div>
      </div>
    </div>
  );
}
