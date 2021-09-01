import React, { useState, useContext } from "react";
import Footer from "../Components/LandingPage/Footer";
import Navbar from "../Components/LandingPage/Navbar";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import Link from "next/link";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../config";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";

import { AppContext } from "../Context/State";

const parseJwt = (token) => {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  console.log("here", JSON.parse(window.atob(base64)));
  return JSON.parse(window.atob(base64));
};

export default function login() {
  const { GlobalState, setGlobalState } = useContext(AppContext);
  const [LoginData, setLoginData] = useState({});
  const router = useRouter();

  const handleFormChange = (e) => {
    let { name, value } = e.target;

    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(LoginData);
    await axios({
      url: `${BASE_URL}auth/login`,
      method: "post",
      data: LoginData,
    })
      .then((response) => {
        console.log(response.data.token);

        localStorage.setItem("token", response.data.token);
        let tokenData = parseJwt(response.data.token);

        setGlobalState((prevState) => ({
          ...prevState,
          name: tokenData.name,
          email: tokenData.email,
          id: tokenData.id,
        }));

        localStorage.setItem("name", tokenData.name);
        localStorage.setItem("email", tokenData.email);
        localStorage.setItem("id", tokenData.id);

        if (tokenData.first_login) {
          router.push("/profile");
        } else {
          router.push("/main");
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.msg);
      });
  };

  return (
    <div>
      <Navbar />
      <Container>
        <h1>Login</h1>
        <ItemContainer>
          <InputWrapper>
            <h4>Email</h4>
            <InputField name="email" onChange={handleFormChange} type="text" />
          </InputWrapper>

          <InputWrapper>
            <h4>Password</h4>
            <InputField
              name="password"
              onChange={handleFormChange}
              type="password"
            />
          </InputWrapper>

          <Link href="/signup">
            <SignupLink>Create an Account</SignupLink>
          </Link>

          <SubmitButton type="submit" onClick={(e) => handleSubmit(e)}>
            Submit
          </SubmitButton>
        </ItemContainer>

        <ToastContainer />
      </Container>
      <Footer />
    </div>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #fafafa;
  flex-direction: column;
`;

const ItemContainer = styled.div`
  box-sizing: border-box;
  box-shadow: inset 20px 20px 60px #d5d5d5, inset -20px -20px 60px #ffffff;
  border-radius: 50px;
  display: flex;
  flex-direction: column;
  padding: 40px;
  margin-bottom: 10%;
`;

const InputField = styled.input`
  background: white;
  border-color: gray;
  outline-width: 5px;
`;

const InputWrapper = styled.div`
  padding: 15px 0px 5px 0px;
`;

const SubmitButton = styled(Button)`
  &&& {
    border-radius: 40px;
    box-shadow: inset 20px 20px 60px #d5d5d5, inset -20px -20px 60px #ffffff;
    width: 50%;
    margin-left: 20%;
    :hover {
      background-color: turquoise;
    }
  }
`;

const SignupLink = styled.a`
  cursor: pointer;
  :hover {
    color: blue;
    text-decoration: underline;
  }

  padding-bottom: 10px;
`;
