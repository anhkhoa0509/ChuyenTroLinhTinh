import React from "react";
import firebase, { auth } from "../../firebase/config";
import { addDocument, generateKeywords } from "../../firebase/services";
import styled from "styled-components";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
const fbProvider = new firebase.auth.FacebookAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const LoginStyled = styled.div`
  .login-title {
    width: 100%;
    text-align: center;
    font-size: 32px;
    font-style: italic;
    font-weight: bold;
    color: rgb(36, 32, 82);
  }
  label {
    font-size: 24px;
  }
  .login-header {
    text-align: center;
    font-weigh: bold;
    font-size: 32px;
  }
  form {
    padding: 24px;
    border-radius: 5px;
    max-width: 600px;
    margin: auto;
    font-weigh: bold;
    color: rgb(0, 30, 60);
    font-weight: 500;
  }

  .div-btn {
    display: flex;
    justify-content: center;

    .btn-submit {
      color: white;
      background-color: rgb(0, 30, 60);
    }
  }

  .login-right {
    padding: 36px;

    .login-right-header {
      font-size: 24px;
      font-weight: bold;
    }
    input {
      border-radius: 25px;
    }
  }
  .social-login {
    display: flex;
    margin-bottom: 12px;
    width: 100%;
    .button-social {
      width: 80%;
      max-width: 550px;
      margin: 0 auto;
      border-radius: 25px;
      pading: 6px;
      padding: 6px;
      color: black;
      font-size: 18px;
      background: white;
    }
  }
`;
export default function Login() {
  const handleLogin = async (provider) => {
    const { additionalUserInfo, user } = await auth.signInWithPopup(provider);
    if (additionalUserInfo?.isNewUser) {
      addDocument("users", {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        providerId: additionalUserInfo.providerId,
        keywords: generateKeywords(user.displayName?.toLowerCase()),
      });
    }
  };
  const SubmitDN = () => {};
  const handleInput = () => {};
  return (
    <div>
      <LoginStyled>
        <div className="login ">
          <form onSubmit={SubmitDN} noValidate>
            <div className="form-group">
              <p className="login-header">Đăng nhập</p>
              <label htmlFor="exampleInputEmail1">Email:</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                name="emaildn"
                onChange={handleInput}
                aria-describedby="emailHelp"
                placeholder="Vui lòng nhập nhập email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Mật khẩu:</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                name="password"
                onChange={handleInput}
                placeholder="Vui lòng nhập mật khẩu"
                required
              />
            </div>
            <div className={"div-btn"}>
              <button type="submit" className="btn btn-submit">
                Đăng nhập
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="social-login">
            <button
              className="button-social"
              onClick={() => handleLogin(googleProvider)}
            >
              Đăng nhập bằng Google <GoogleIcon style={{ color: "darkblue" }} />
            </button>
          </div>
          <div className="social-login">
            <button
              className="button-social"
              onClick={() => handleLogin(fbProvider)}
            >
              Đăng nhập bằng Facebook
              <FacebookIcon style={{ color: "darkblue" }} />
            </button>
          </div>
        </div>
      </LoginStyled>
    </div>
  );
}
