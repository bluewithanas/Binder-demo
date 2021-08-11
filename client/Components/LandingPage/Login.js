import { Modal } from '@material-ui/core'
import React,{useState} from 'react'
import styled from 'styled-components'
export default function Login() {
const [Open, setOpen]=useState(true);
const handleClose = () => {
    setOpen(false);
  };
    const body=(
        <div>
            <p>im login</p>
        </div>
    )

    return (
        <div>
            <Modal open={open} onClose={handleClose} >

                {body}
            </Modal>
            
        </div>
    )
}

const LoginCard=styled(Modal)`


`