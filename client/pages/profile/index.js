import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { AppContext } from "../../Context/State";
import { BASE_URL } from "../../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { route } from "next/dist/next-server/server/router";
import router from "next/router";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function index() {
  const { GlobalState, setGlobalState } = useContext(AppContext);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const classes = useStyles();

  const [Formdata, setFormdata] = useState({
    userId: GlobalState.id,
  });
  const [Token, setToken] = useState("");
  const handleFormData = (e) => {
    let { name, value } = e.target;

    setFormdata((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(Formdata);
    await axios({
      method: "post",
      url: `${BASE_URL}userinfo`,
      data: Formdata,
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          toast.success("Submitted successfully");
          setTimeout(() => {
            router.push("/Homepage");
          }, 2000);
        }
      })
      .catch((err) => {
        toast.error(err.response.data?.msg._message);
      });
  };

  return (
    <Container>
      <h2>Please enter details</h2>

      <FormContainer className={classes.root} noValidate autoComplete="off">
        <FormDiv>
          <>
            <h3>DOB</h3>
            <InputField
              onChange={(e) => handleFormData(e)}
              name="dob"
              type="date"
              id="outlined-basic"
              variant="outlined"
            />
          </>

          <InputField
            type="text"
            id="outlined-basic"
            label="City"
            variant="outlined"
            name="location"
            onChange={(e) => handleFormData(e)}
          />
        </FormDiv>

        <FormDiv>
          <>
            <InputField
              type="text"
              label="Faviorite book"
              id="outlined-basic"
              variant="outlined"
              name="fav_book"
              onChange={(e) => handleFormData(e)}
            />
          </>

          <InputField
            type="text"
            id="outlined-basic"
            label="Interest"
            variant="outlined"
            onChange={(e) => handleFormData(e)}
            name="interest"
          />

          <InputField
            type="text"
            id="outlined-basic"
            label="book offering"
            variant="outlined"
            onChange={(e) => handleFormData(e)}
            name="book_offering"
          />
        </FormDiv>

        <FormDiv>
          <>
            <InputField
              type="text"
              label="your fav quote"
              id="outlined-basic"
              variant="outlined"
              onChange={(e) => handleFormData(e)}
              name="fav_quote"
            />
          </>

          <InputField
            type="text"
            id="outlined-basic"
            label="social profile"
            variant="outlined"
            onChange={(e) => handleFormData(e)}
            name="social_url"
          />
        </FormDiv>
      </FormContainer>
      <SubmitButton type="submit" onClick={(e) => handleSubmit(e)}>
        {" "}
        <ButtonText>Submit</ButtonText>{" "}
      </SubmitButton>
      <ToastContainer />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  height: 100vh;

  background: #d2d1d1;
`;

const FormContainer = styled.form`
  display: flex;
  border-radius: 50px;
  background: #d2d1d1;
  height: 70vh;
  width: 110vh;
  box-shadow: 20px -20px 20px #b3b2b2, -20px 20px 20px #f2f0f0;
  padding: 15px;
  justify-content: space-around;
  flex-direction: column;
`;

const InputField = styled(TextField)``;

const FormDiv = styled.div`
  display: flex;
  justify-content: space-around;
`;

const SubmitButton = styled.a`
  cursor: pointer;

  :hover {
    background-color: black;
  }

  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 3%;
  border-radius: 50px;
  background: linear-gradient(145deg, #f0f0f0, #cacaca);
  box-shadow: 22px 22px 44px #7d7d7d, -22px -22px 44px #ffffff;
  height: 10vh;
  width: 30vh;
`;

const ButtonText = styled.h4``;
