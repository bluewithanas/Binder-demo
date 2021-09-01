import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { BASE_URL } from "../../../config";
import axios from "axios";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { AppContext } from "../../../Context/State";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: "whitesmoke",
    border: "none",
    padding: theme.spacing(2, 4, 3),
    borderRadius: "10px",
    height: "80vh",
    width: "50vh",
  },
}));

export default function InfoModal({ pid, open, setOpen, name }) {
  const classes = useStyles();

  const [Data, setData] = useState(null);
  const { GlobalState, setGlobalState } = useContext(AppContext);

  const handleClose = () => {
    setOpen(false);
  };
  function _calculateAge(birthday) {
    // birthday is a date
    console.log(birthday);
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  useEffect(() => {
    axios({
      url: `${BASE_URL}userinfo/${pid}`,
      method: "get",

      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const removeFriend = async (e, pid) => {
    e.preventDefault();
    console.log('i am going to remove the friend')
   await  axios({
      url: `${BASE_URL}removefriend/${GlobalState.id}/${pid}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(response=>{
      console.log('i remove friend here')
      console.log(response);
      
    }).catch(err=>{
      console.log(err);
    })
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">{name} Info </h2>
            <h5>{Data?.location}</h5>
            <Divider />
            <h5>Interest: </h5>
            {Data?.interest.map((key) => (
              <p> | {key} </p>
            ))}
            <Divider />
            <h5>Book list: </h5>
            {Data?.book_list.map((key) => (
              <p>| {key}</p>
            ))}
            <Divider />
            <h5>Book Offering:</h5>
            <p>{Data?.book_offering}</p>
            <Divider />
            <h5>Fav quote - "{Data?.fav_quote}"</h5>{" "}
            <a
              style={{ color: "blue" }}
              href={Data?.social_url}
              target="_blank"
            >
              Link to social profile
            </a>
            {"       "}{" "}
            <Button
              onClick={(e) => removeFriend(e, pid)}
              variant="outlined"
              color="secondary"
            >
              Remove Friend
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
