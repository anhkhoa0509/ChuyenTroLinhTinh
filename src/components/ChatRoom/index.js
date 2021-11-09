import React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../../Context/AuthProvider";
import { AppContext } from "../../Context/AppProvider";
import { auth } from "../../firebase/config";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import { addDocument } from "../../firebase/services";
import { db } from "../../firebase/config";
import { Form, Modal, Select, Spin } from "antd";
import { debounce } from "lodash";
const ChatRoomBackground = styled.div`
  background-image: linear-gradient(#0093e9, #80d0c7);
  color: black;
  height: 100vh;
  form {
    .ant-select-selector {
      border-radius: 25px !important;
    }
  }
  .title {
    font-size: 32px;
    color: white;
    padding: 28px auto;
    width: 100%;
    text-align: center;
    padding: 28px;
  }
  .input {
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    .search {
      width: 92%;
      padding: 12px;
      border-radius: 25px;
      margin: a;
      border: none;
    }
  }
  .items-friend {
    list-style: none;
    padding: 18px 0 0 0;
    list-style: none;
    padding: 18px 0 0 0;
    height: 596px;
    overflow-y: scroll;
    background: white;
    margin-top: 18px;
    border-top-right-radius: 25px;
    border-top-left-radius: 25px;

    .item-friend {
      display: flex;
      height: 100px;
      overlow: hidden;
      color: black;
      .avt-item {
        margin: 16px;
      }
      .text-mess {
        .name {
          margin: 0;
          font-size: 18px;
          font-weight: 500;
          padding-top: 6px;
          color: #212944;
        }
        .text {
          font-size: 16px;
          opacity: 0.8;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          -webkit-line-clamp: 2;
        }
      }
    }
    .item-friend:hover {
      background: #ccc;
    }
  }
  .footer {
    display: flex;
    z-index: 10;
    position: absolute;
    bottom: 0;
    background: white;
    width: 100%;
    border: 1px solid #ccc;
    height: 60px;
    justify-content: space-around;
    .avt {
      margin: auto 0;
    }
  }
`;
function DebounceSelect({
  fetchOptions,
  debounceTimeout = 300,
  curMembers,
  ...props
}) {
  // Search: abcddassdfasdf
  console.log("curMembers", curMembers);
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);

      fetchOptions(value, curMembers).then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions, curMembers]);

  React.useEffect(() => {
    return () => {
      // clear when unmount
      setOptions([]);
    };
  }, []);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
    >
      {options.map((opt) => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
          <Avatar size="small" src={opt.photoURL}>
            {opt.photoURL ? "" : opt.label?.charAt(0)?.toUpperCase()}
          </Avatar>
          {` ${opt.label}`}
        </Select.Option>
      ))}
    </Select>
  );
}

export default function ChatRoom() {
  const {
    user: { displayName, photoURL, uid },
  } = React.useContext(AuthContext);

  const { friends, rooms, setSelectedRoomId, setSelectedFriendChat } =
    React.useContext(AppContext);

  const { clearState } = React.useContext(AppContext);
  const [value, setValue] = useState("");

  const addRoom = (id) => {
    for (let i = 0; i < rooms.length; i++) {
      let index = rooms[i].members.filter((item) => {
        return item == id;
      });
      if (index.length > 0) {
        setSelectedRoomId(rooms[i].roomID);
        setSelectedFriendChat(id);
        return;
      }
    }
    addDocument("rooms", { roomID: uid + id, members: [uid, id] });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
  };
  async function fetchUserList(search, curMembers) {
    return db
      .collection("users")
      .where("keywords", "array-contains", search?.toLowerCase())
      .orderBy("displayName")
      .limit(20)
      .get()
      .then((snapshot) => {
        return snapshot.docs
          .map((doc) => ({
            label: doc.data().displayName,
            value: doc.data().uid,
            photoURL: doc.data().photoURL,
          }))
          .filter((opt) => !curMembers.includes(opt.value));
      });
  }
  console.log("fetchUserList");
  return (
    <ChatRoomBackground>
      <h3 className="title">Chuyện trò linh tinh</h3>
      <form className="input" onSubmit={handleOnSubmit}>
        <DebounceSelect
          type="text"
          className="search"
          mode="multiple"
          name="search-user"
          label="Tên các thành viên"
          value={value}
          placeholder="Nhập tên thành viên"
          fetchOptions={fetchUserList}
          onChange={(newValue) => setValue(newValue)}
          style={{ width: "100%" }}
          curMembers={friends}
          placeholder="   Tìm kiếm bạn"
        />
      </form>
      <div className="footer">
        <Avatar src={photoURL} className="avt">
          {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <LogoutIcon
          className="avt"
          onClick={() => {
            // clear state in App Provider when logout
            clearState();
            auth.signOut();
          }}
        />
      </div>
      <div className="list-friend">
        <ul className="items-friend">
          {friends &&
            friends.map((item) => {
              return (
                <li>
                  <Link
                    to="/chat"
                    className="item-friend"
                    onClick={() => addRoom(item.uid)}
                  >
                    <Avatar
                      sx={{ width: 56, height: 56 }}
                      src={item.photoURL}
                      className="avt-item"
                    >
                      {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <div className="text-mess">
                      <p className="name">{item.displayName}</p>
                      <span className="text">
                        Hãy nhắn gì đó cho {item.displayName}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </ChatRoomBackground>
  );
}
