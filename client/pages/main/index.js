import React, { useEffect } from "react";
import Sidebar from "../../Components/LandingPage/main/Sidebar";
import styled from "styled-components";
import Bodymain from "../../Components/LandingPage/main/Bodymain";
import router from "next/router";
export default function index() {
  useEffect(() => {
    if (
      localStorage.getItem("token") === null ||
      localStorage.getItem("token") === " "
    ) {
      alert("please login to continue");
      router.push("/");
    }
  }, []);

  return (
    <Container>
      <Sidebar />
      <Bodymain />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: stretch;
  flex-direction: row;
  height: 100vh;
`;
