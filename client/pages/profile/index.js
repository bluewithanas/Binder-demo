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
import hobbies from "../../Components/LandingPage/hobbies.json";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import books from "../../Components/LandingPage/books.json";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function index() {
  const { GlobalState, setGlobalState } = useContext(AppContext);

  useEffect(() => {
    console.log(GlobalState);
    setToken(localStorage.getItem("token"));
  }, []);

  const classes = useStyles();

  const [Formdata, setFormdata] = useState({
    userId: GlobalState.id,
    email: GlobalState.email,
  });
  const [Token, setToken] = useState("");
  const [Booklist, setBooklist] = useState([]);
  const [Interest, setInterest] = useState([]);
  const [BookOffering, setBookOffering] = useState();
  const handleFormData = (e) => {
    let { name, value } = e.target;

    if (name === "book_list") {
      let list = [...Booklist];

      list.push(value);

      setBooklist(list);

      setFormdata((prevState) => ({
        ...prevState,
        [name]: list,
      }));
    } else if (name === "interest") {
      let list = [...Interest];

      list.push(value);

      setInterest(list);

      setFormdata((prevState) => ({
        ...prevState,
        [name]: list,
      }));
    } else if (name === "book_offering") {
      setBookOffering(value);

      setFormdata((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setFormdata((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(Formdata);
    console.log(Token);
    await axios({
      method: "post",
      url: `${BASE_URL}userinfo`,
      data: Formdata,
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    })
      .then((response) => {
        console.log("response is here");
        console.log(response);
        if (response.status === 200) {
          toast.success("Submitted successfully");
          setTimeout(() => {
            router.push("/main");
          }, 2000);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.msg._message);
      });
  };

  return (
    <Container>
      <h2>Please enter details</h2>

      <FormContainer noValidate autoComplete="off">
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
          <ListContainer>
            {Booklist.map((key) => {
              return (
                <Chip
                  avatar={<MenuBookIcon />}
                  label={key}
                  // onDelete={handleDelete}
                />
              );
            })}
          </ListContainer>

          <ListContainer>
            {Interest.map((key) => {
              return (
                <Chip
                  avatar={<MenuBookIcon />}
                  label={key}
                  // onDelete={handleDelete}
                />
              );
            })}
          </ListContainer>

          <ListContainer>
            {BookOffering ? (
              <Chip
                avatar={<MenuBookIcon />}
                label={BookOffering}
                // onDelete={handleDelete}
              />
            ) : (
              " "
            )}
          </ListContainer>
        </FormDiv>

        <FormDiv>
          <>
            <FormControl className={classes.formControl}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="book_list"
                onChange={(e) => handleFormData(e)}
              >
                {books.map((key, index) => {
                  return (
                    <MenuItem key={index} value={key.title}>
                      {key.title}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>Select your Faviorite Books</FormHelperText>
            </FormControl>
          </>

          <FormControl className={classes.formControl}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              onChange={(e) => handleFormData(e)}
              name="interest"
            >
              {hobbies.map((key, index) => {
                return (
                  <MenuItem key={index} value={key.title}>
                    {key.title}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>Select your hobbies</FormHelperText>
          </FormControl>

          <FormControl className={classes.formControl}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              onChange={(e) => handleFormData(e)}
              name="book_offering"
            >
              {books.map((key, index) => {
                return (
                  <MenuItem key={index} value={key.title}>
                    {key.title}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>Select book you are offering</FormHelperText>
          </FormControl>
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

const ListContainer = styled.div`
  display: flex;
`;

const ButtonText = styled.h4``;
