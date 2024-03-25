import "./FriendsList.css";

import axios from "axios";
import profileImage from "../../images/default-profile-image.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useEffect, useState } from "react";

export default function FriendsList({ onClose }) {
  const [friendsList, setFriendsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataFromLocalStorage = JSON.parse(
          localStorage.getItem("userData")
        );
        console.log(userDataFromLocalStorage);
        if (!userDataFromLocalStorage) {
          console.error("User data not found in local storage.");
          return;
        }
        const response = await axios.get(
          `http://localhost:8800/friends-list/${userDataFromLocalStorage.id}`
        );
        if (response.data) {
          setFriendsList(
            response.data.map((friend) => [
              friend.profileImage || profileImage,
              friend.username,
            ])
          );
        }
      } catch (error) {
        console.error("Failed to fetch friends list:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="friends-list-component">
      <div className="friends-list-title">
        <div className="friends-list-title-text">
          <h1>Your Friends List</h1>
        </div>
        <div className="friends-list-close-icon">
          <FontAwesomeIcon
            icon={faXmark}
            id="friends-list-close-icon"
            onClick={() => {
              onClose();
            }}
          />
        </div>
      </div>
      <div className="friends-list-buttons">
        {friendsList.map((friend, index) => (
          <div className="friends-list-button" key={index}>
            <div className="friends-list-button-image">
              <img src={friend[0]} />
            </div>
            <div className="friends-list-button-username">
              <p>{friend[1]}</p>
            </div>
            <div className="friends-list-button-chat">
              <button>Chat</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
