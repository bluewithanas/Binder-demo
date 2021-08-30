import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import InfoModal from "./InfoModal";

function FriendsButton({ key, pid, name }) {
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

export default FriendsButton;
