import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";

const StyledButton = styled.button`
    width : 150px;
    height: 2rem;
    border-radius : 1rem;
    border-color: blue;
    cursor: pointer;
    margin :20px;
`

export function SignMessage() {
    const {account,library,active} = useWeb3React();

    const handleSignMessage = (event) => {
        event.preventDefault();

        if(!library || !account) {
            window.alert("Wallet is not connected");
            return;
        }

        async function signMessage() {
            try{
                const signature = await library.getSigner(account).signMessage("hello fastcampus");
                window.alert(`Sucess: ${signature}`);
            }catch(error) {
                console.error(error);
            }
        }

        signMessage();
        
    }

    return ( 
        <StyledButton disabled = {!active ? true : false} 
        style={
            {
                borderColor: active ? 'blue' : 'unset'
            }
        }
        onClick={handleSignMessage}>Sign Message</StyledButton>
    )
}