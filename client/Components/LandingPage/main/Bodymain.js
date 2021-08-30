import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Carousel from "react-material-ui-carousel";
import axios from "axios";
import { BASE_URL } from "../../../config";
import UserCard from "./UserCard";
export default function Bodymain() {
  const [Users, setUsers] = useState([]);

  useEffect(() => {
    axios({
      url: `${BASE_URL}getusers`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log(response, "get users information here");
        setUsers(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Container>
      <Carousel>
        {Users.map((key) => (
          <>
            {console.log(key)}
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
