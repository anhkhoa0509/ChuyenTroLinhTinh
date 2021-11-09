import React, { useState, useEffect } from "react";
import useFirestore from "../hooks/useFirestore";
import { AuthContext } from "./AuthProvider";
import { db } from "../firebase/config";

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedFriendChat, setSelectedFriendChat] = useState("");
  const [friend, setFriend] = useState({});
  const {
    user: { uid },
  } = React.useContext(AuthContext);
  const roomsCondition = React.useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValue: uid,
    };
  }, [uid]);
  const friendCondition = React.useMemo(() => {
    return {
      fieldName: "friends",
      operator: "array-contains",
      compareValue: uid,
    };
  }, [uid]);

  const rooms = useFirestore("rooms", roomsCondition);
  const friends = useFirestore("users", friendCondition);

  let value = 1;
  if (selectedFriendChat) {
    friends.map((item) => {
      if (item.uid === selectedFriendChat) {
        value = item;
      }
    });
  }
  useEffect(() => {
    setFriend(value);
  }, [value]);
  const selectedRoom = React.useMemo(
    () => rooms.find((room) => room.roomID === selectedRoomId) || {},
    [rooms, selectedRoomId]
  );
  const usersCondition = React.useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: selectedRoom.members,
    };
  }, [selectedRoom.members]);

  const members = useFirestore("users", usersCondition);

  const clearState = () => {
    setSelectedRoomId("");
    setIsAddRoomVisible(false);
    setIsInviteMemberVisible(false);
  };

  return (
    <AppContext.Provider
      value={{
        rooms,
        members,
        friend,
        friends,
        selectedRoom,
        setSelectedFriendChat,
        isAddRoomVisible,
        setIsAddRoomVisible,
        selectedRoomId,
        setSelectedRoomId,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        clearState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
