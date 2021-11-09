import { UserAddOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button, Tooltip, Form, Input, Alert } from "antd";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import Message from "./Message";
import { AppContext } from "../../Context/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../Context/AuthProvider";
import useFirestore from "../../hooks/useFirestore";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
const HeaderStyled = styled.div`
  display: flex;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 2px solid #ccc;
  height: 120px;
  padding: 0 16px;
  flex-direction: column;
  justify-content: center;
  span {
    font-size: 21px;
    padding: 12px;
    font-weight: 500;
  }
  .icon-back {
    position: absolute;
    left: 20px;
    top: 26px;
    color: blue;
  }
  .avt {
    margin-top: 6px;
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  flex-flow: column;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 2px 2px 2px 0;
  border: 1px solid black;
  border-radius: 2px;
  .input-text-mess {
    border-radius: 25px !important;
  }
  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
  font-size: 24px;
  .my-send {
    display: flex;
    justify-content: end;
  }
`;

export default function ChatWindow() {
  const { selectedRoom, members, setIsInviteMemberVisible, friend } =
    useContext(AppContext);
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState("");
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnSubmit = () => {
    console.log("roomId tao phong", selectedRoom);
    addDocument("messages", {
      text: inputValue,
      uid,
      photoURL,
      roomId: selectedRoom.id,
      displayName,
    });

    form.resetFields(["message"]);

    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };

  const condition = React.useMemo(
    () => ({
      fieldName: "roomId",
      operator: "==",
      compareValue: selectedRoom.id,
    }),
    [selectedRoom.id]
  );

  const messages = useFirestore("messages", condition);
  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

  return (
    <WrapperStyled>
      {selectedRoom.id ? (
        <>
          <HeaderStyled>
            <Link to="/">
              <ArrowBackIosIcon className="icon-back" />
            </Link>
            <Avatar
              src={friend.photoURL}
              className="avt"
              sx={{ width: 56, height: 56 }}
            >
              {friend.photoURL
                ? ""
                : friend.displayName?.charAt(0)?.toUpperCase()}
            </Avatar>
            <span>{friend.displayName}</span>
          </HeaderStyled>
          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {messages.map((mes) => (
                <div className={mes.uid === uid ? "my-send" : ""}>
                  <Message
                    key={mes.id}
                    text={mes.text}
                    photoURL={mes.photoURL}
                    displayName={mes.displayName}
                  />
                </div>
              ))}
            </MessageListStyled>
            <FormStyled form={form}>
              <Form.Item name="message">
                <Input
                  ref={inputRef}
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                  placeholder="Nhập tin nhắn..."
                  bordered={false}
                  className="input-text-mess"
                  autoComplete="off"
                />
              </Form.Item>
              <SendIcon
                type="primary"
                onClick={handleOnSubmit}
                style={{ color: "blue" }}
              />
            </FormStyled>
          </ContentStyled>
        </>
      ) : (
        <Alert
          message="Hãy chọn phòng"
          type="info"
          showIcon
          style={{ margin: 5 }}
          closable
        />
      )}
    </WrapperStyled>
  );
}
