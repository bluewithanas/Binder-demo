import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import Carousel from "react-material-ui-carousel";
import axios from "axios";
import { BASE_URL } from "../../../config";
import UserCard from "./UserCard";
import { AppContext } from "../../../Context/State";

export default function Bodymain() {
  const [Users, setUsers] = useState([]);
  const { GlobalState, setGlobalState } = useContext(AppContext);

  useEffect(() => {
    // console.log(GlobalState.id, "id is here");

    setInterval(() => {
      axios({
        url: `${BASE_URL}getusers/${localStorage.getItem('id')}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          // console.log(response, "get users information here");
          setUsers(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 5000);
  }, []);

  return (
    <Container>
      <Carousel>
        {Users.map((key) => (
          <>
            <UserCard key={key.userId} data={key} />
          </>
        ))}
      </Carousel>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  background-color: #adc0e8;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 130vh;
`;
