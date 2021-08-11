import React from 'react'
import styled from 'styled-components';
import { Button } from '@material-ui/core';
function Signup() {
    return (
        <div>
<Navbar />
      <Container>
          <h1>Login</h1>
        <ItemContainer>
          <InputWrapper>
            <h4>Email</h4>
            <InputField  type="text"/>
          </InputWrapper>

          <InputWrapper>
            <h4>Password</h4>
            <InputField type="password" />
          </InputWrapper>

          <SubmitButton>Submit</SubmitButton>
        </ItemContainer>

    
      </Container>
      <Footer />        </div>
    )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #fafafa;
  flex-direction: column;
`;

const ItemContainer = styled.div`
  box-sizing: border-box;
  box-shadow: inset 20px 20px 60px #d5d5d5, inset -20px -20px 60px #ffffff;
  border-radius: 50px;
  display: flex;
  flex-direction: column;
  padding: 40px;
  margin-bottom: 10%;
`;

const InputField = styled.input`
  background: white;
  border-color: gray;
  outline-width: 5px;
  
`;

const InputWrapper = styled.div`
  padding: 15px 0px 5px 0px ;
`;

const SubmitButton=styled(Button)`
&&&{
    border-radius: 40px;
    box-shadow: inset 20px 20px 60px #d5d5d5, inset -20px -20px 60px #ffffff;
    width: 50%;
    margin-left: 20%;
:hover{
    background-color: turquoise;
}
}


`;


export default Signup
