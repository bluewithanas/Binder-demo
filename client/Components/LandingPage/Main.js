import React,{useState} from 'react'
import styled from 'styled-components'
import pic from "../../public/bg.png"
import Login from "./Login"
import Link from "next/link"
export default function Main() {
    const [showModal, setshowModal]=useState(false);
    return (
        <Container>
            {showModal ?  <Login/> :' '}
 <Link href="/signup" ><Button>Create Account</Button>
 </Link>  </Container>
    )
}

const Container=styled.div`
display: grid;
place-items: center;
background-image: url('/bg.png');
background-repeat: no-repeat;
height: 100vh;
background-size: cover;

`;


const Button=styled.button`
z-index: 1;
width: 200px;
height: 70px;
border-radius: 70px;
cursor: pointer;
color: #63a2ed;
font-weight: bolder;
outline: none;
border: none;
outline-width: 0;

:hover{
    background-color: #63a2ed;
    color: whitesmoke;
}
`;


