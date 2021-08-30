import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { AppContext } from "../../../Context/State";
import InfoModal from "./InfoModal";
function MatchButton({ key, pid, name }) {
  const { GlobalState, setGlobalState } = useContext(AppContext);
  const [Token, setToken] = useState("");

  const declineInvite = (e, pid) => {
    e.preventDefault();

    axios({
      url: `${BASE_URL}delete/${GlobalState.id}/${pid}`,
      method: "delete",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const acceptInvite = (e, pid) => {
    e.preventDefault();

    axios({
      url: `${BASE_URL}accept/${GlobalState.id}/${pid}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  if (open) {
    return <InfoModal pid={pid} open={open} setOpen={setOpen} name={name} />;
  }

  return (
    <Container>
      <UserAvatar onClick={handleOpen} />

      <p>{name}</p>

      <ActionContainer>
        <a onClick={(e) => declineInvite(e, pid)}>
          {" "}
          <CancelIcon style={{ cursor: "pointer", color: "red" }} />
        </a>
        <a onClick={(e) => acceptInvite(e, pid)}>
          {" "}
          <CheckCircleIcon style={{ cursor: "pointer", color: "green" }} />
        </a>
      </ActionContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  word-break: break-word;
  justify-content: space-between;

  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default MatchButton;
