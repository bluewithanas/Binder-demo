import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { Button, IconButton } from "@material-ui/core";
import Link from "next/link";
//import pic from "../../public/logo.png"
function Navbar() {
  return (
    <Container>
      <ImageWrapper>
      <Link href="/"><Image priority height={50} width={150} src="/logo.png" /></Link>
      </ImageWrapper>

      <ButtonContainer>
        <Texts>Product </Texts>
        <Texts>Learn More </Texts>
        <Texts>Support </Texts>
     <Link href='/login' ><LoginButton>Login</LoginButton></Link>
      </ButtonContainer>
    </Container>
  );
}

export default Navbar;

const Container = styled.div`
  display: flex;
  background: linear-gradient(to right, #d4d3e6, #64a1ed) ;
;
  position: sticky;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ImageWrapper = styled.div`
  padding-left: 30px;
  cursor: pointer;
`;

const Texts = styled.a`
  color: whitesmoke;
  font-weight: bold;
  padding: 15px;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const ButtonContainer = styled.div``;

const LoginButton = styled(Button)`
  &&& {
    background-color: whitesmoke;
    color: #63a2ed;
    :hover {
      background-color: #63a2ed;
      color: whitesmoke;
    }
  }
`;



const LoginModal=styled.dia
