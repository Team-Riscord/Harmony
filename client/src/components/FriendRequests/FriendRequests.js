import "./FriendRequests.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";

import { useEffect, useState } from "react";
import axios from "axios";

export default function FriendRequests({ onClose }) {
  const [friendRequestsList, setFriendRequestsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userDataFromLocalStorage = JSON.parse(
        localStorage.getItem("userData")
      );
      const response = await axios.get(
        `http://localhost:8800/friend-requests/${userDataFromLocalStorage.userKey}`
      );
      if (response.data) {
        setFriendRequestsList(response.data);
      }
    };

    fetchData();
  }, []);

  const declineFriendRequest = async (requestId, index) => {
    try {
      const response = await axios.post(
        `http://localhost:8800/decline-friend-request/${requestId}`
      );
      if (response.data.success) {
        console.log("Friend request declined");
        const updatedList = [...friendRequestsList];
        updatedList.splice(index, 1);
        setFriendRequestsList(updatedList);
      } else {
        console.error("Failed to decline friend request");
      }
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  const acceptFriendRequest = async (requestId, index) => {
    try {
      const response = await axios.post(
        `http://localhost:8800/accept-friend-request/${requestId}`
      );
      if (response.data.success) {
        console.log("Friend request accepted");
        const updatedList = [...friendRequestsList];
        updatedList.splice(index, 1);
        setFriendRequestsList(updatedList);
      } else {
        console.error("Failed to accept friend request");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  return (
    <div className="friend-requests-component">
      <div className="friend-requests-title">
        <div className="friend-requests-title-text">
          <h1>Friend Requests</h1>
        </div>
        <div className="friend-requests-close-icon">
          <FontAwesomeIcon
            icon={faXmark}
            id="friend-requests-close-icon"
            onClick={() => {
              onClose();
            }}
          />
        </div>
      </div>
      <div className="friend-requests-buttons">
        {friendRequestsList.map((request, index) => (
          <div className="friend-requests-button" key={index} id={request[3]}>
            <div className="friend-requests-button-image">
              <img src={request[1]} />
            </div>
            <div className="friend-requests-button-username">
              <p id={request[2]}>{request[0]}</p>
            </div>
            <div className="friend-requests-button-chat">
              <div className="friend-requests-accept-button">
                <button onClick={acceptFriendRequest(request.id, index)}>
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              </div>
              <div className="friend-requests-decline-button">
                <button onClick={declineFriendRequest(request.id, index)}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
