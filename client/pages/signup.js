import React, { useState } from "react";
import Footer from "../Components/LandingPage/Footer";
import Navbar from "../Components/LandingPage/Navbar";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import Link from "next/link";
import axios from "axios";
import { BASE_URL } from "../config";
import {toast,ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

function signup() {
  const [Formdata, setFormdata] = useState({});
  const [Errors, setErrors] = useState({
    confirmPassword: null,
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "confirmPassword") {
      if (Formdata?.password !== value) {
        setErrors((prevState) => ({
          ...prevState,
          confirmPassword: (
            <p style={{ color: "red" }}>Password's don't match</p>
          ),
        }));
      } else if (Formdata?.password === value) {
        setErrors((prevState) => ({
          ...prevState,
          confirmPassword: <p style={{ color: "green" }}>Password matches!</p>,
        }));
      }

      setFormdata((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      console.log(name, value);
      setFormdata((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(Formdata);

    await axios({
      url: `${BASE_URL}auth/register`,
      method: "post",
      data: Formdata,
    })
      .then((response) => {
        console.log(response);
        if(response.status===200){
          toast.success(response.data.msg)
        }
      })
      .catch((err) => {
   console.log(err.response)
        toast.error(err.response.data.msg);
  } );
  };

  return (
    <div>
      <Navbar />
      <Container>
        <h1>Create Account</h1>
        <ItemContainer>
          <InputWrapper>
            <h4>Name</h4>
            <InputField
              name="name"
              onChange={(e) => handleFormChange(e)}
              type="text"
            />
          </InputWrapper>

          <InputWrapper>
            <h4>Email</h4>
            <InputField
              name="email"
              onChange={(e) => handleFormChange(e)}
              type="text"
            />
          </InputWrapper>

          <InputWrapper>
            <h4>Password</h4>
            <InputField
              name="password"
              onChange={(e) => handleFormChange(e)}
              type="password"
            />
          </InputWrapper>
          {Errors.confirmPassword}

          <InputWrapper>
            <h4>Confirm Password</h4>
            <InputField
              name="confirmPassword"
              onChange={(e) => handleFormChange(e)}
              type="password"
            />
          </InputWrapper>
          <Link href="/login">
            <LoginLink>Already have an Account? LoginIn</LoginLink>
          </Link>
          <SubmitButton type="submit" onClick={(e) => handleSubmit(e)}>
            Submit
          </SubmitButton>
        </ItemContainer>
        <ToastContainer/>
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
  padding: 30px 100px 30px 100px;
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

const LoginLink = styled.a`
  cursor: pointer;

  :hover {
    color: blue;
    text-decoration: blue;
  }
`;

export default signup;
