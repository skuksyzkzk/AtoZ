import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { useState } from "react";
import { injected } from "../utils/connectors";
import { useInactiveListner, useWeb3Connect } from "../utils/hooks";
import styled from 'styled-components';
import { NoEthereumProviderError, UserRejectedRequestError } from "@web3-react/injected-connector";

const StyledActivateButton = styled.button`
    width : 150px;
    height : 2rem;
    border-radius : 1rem;
    border-color : green ;
    cursor : pointer;
    margin: 10px;
`
const StyledDeActivateButton = styled.button`
    width : 150px;
    height : 2rem;
    border-radius : 1rem;
    border-color : red ;
    cursor : pointer;
    margin: 10px;
`
const Activate = () => {
    const context = useWeb3React();
    const {activate , active} = context;

    const [activating,setActivating] = useState(false);

    const handleActivate = (event) => {
        event.preventDefault();
        
        async function _activate() {
            setActivating(true);
            await activate(injected);
            setActivating(false);
        }

        _activate();
    }

    const eagerConnectionSuccessful = useWeb3Connect();
    useInactiveListner(!eagerConnectionSuccessful);

    return (
        <StyledActivateButton disabled= {active} 
        style={
            {
                borderColor: activating ? 'orange' : active ? 'unset' : 'green' 
            }
        }
        onClick={handleActivate}>Connect</StyledActivateButton>
    )
}

const Deactivate = () => {
    const { deactivate, active} = useWeb3React();

    const handleDeactivate = (event) => {
        event.preventDefault();

        deactivate();
    }

    return (
        <StyledDeActivateButton disabled={!active}
        style={{
            borderColor: active ? 'red' : 'unset'
        }}
        onClick={handleDeactivate}>Disconnect</StyledDeActivateButton>
    )
}

/// error 가져오는 함수
function getErrorMessage(error) {
    let errorMessage;

    switch (error.constructor) {
        case NoEthereumProviderError:
            errorMessage = `No Ethereum browser extension created`;
            break;
        
        case UnsupportedChainIdError:
            errorMessage = `You're connectes unsurpported chain Id `;
            break;
        case UserRejectedRequestError:
            errorMessage = `Please Authorize this website to access your Ethereum Account`;
            break;
        default:
            errorMessage = error.message;
        
    }

    return errorMessage;
}

export function Connect() {
    // error 컨트롤해서 좀더 방어적인 코딩하기 

    const { error} = useWeb3React();

    if( error) {
        window.alert(getErrorMessage(error));
    }

    return  (
        <>
            <Activate /> 
            <Deactivate /> 
        </>
        
    )
}