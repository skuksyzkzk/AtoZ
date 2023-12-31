import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers";
///import { ethers } from "hardhat";
import { useEffect, useInsertionEffect, useState } from "react";
import GreetingArtifacts from '../artifacts/Greeting.json';
import styled from "styled-components";

const StyledDeployButton = styled.button`
    width: 200px;
    height: 2rem;
    border-radius: blue;
    cursor : pointer;
    place-self: center;
`
const StyledGreetingDiv = styled.div`
    display : flex;
    gap : 10px;
    align-items: center;
`
const StyledLabel = styled.span`
    font-weight : bold;
`
export function ContractCall() {
    const { active, library } = useWeb3React();

    const [signer, setSigner] = useState();
    const [greetingContract, setGreetingContract] = useState();
    const [greetingContractAddr, setGreetingContractAddr] = useState('');
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        if (!library) {
            setSigner(undefined);
            return;
        }

        setSigner(library.getSigner());
    }, [library])

    useEffect( () => {
        if(!greetingContract){
            return;
        }
        async function getGreeting(greetingContract){
            const _greeting = await greetingContract.greet();
            
            if(_greeting !== greeting){
                setGreeting(_greeting);
            }
        }

        getGreeting(greetingContract);
    },[greetingContract,greeting])

    const handleDeployContract = (event) => {
        event.preventDefault();

        if (greetingContract) {
            return; 
        } // greetingContract 오브젝트가 있으면 배포된거니까 리턴해줘야된다 

        async function deployContract() {
            const Greeting = new ethers.ContractFactory(
                GreetingArtifacts.abi,
                GreetingArtifacts.bytecode,
                signer
            );// contract abi file,bytecode,signer를 넣어줘야된다. 
            
            try {
                const greetingContract =  await Greeting.deploy('hello fastCampus');//이 부분이 Greeting.sol의 생성자에 인자로 넘겨줄 부분이다 .
                console.log(greetingContract); // 이 부분에서 반환되는 객체 출력
                // 프로토타입 체인 확인
                console.log(Object.getPrototypeOf(greetingContract));
                //await greetingContract.deployed();
                window.alert(
                    'delpoyed'
                );
                const greeting = await greetingContract.greet();//문자열 리턴되겄지 여기서 hello fastCampus 저게 
                setGreetingContract(greetingContract);
                setGreeting(greeting);
                setGreetingContractAddr(greetingContract.target);
                window.alert(`Greeting Deployed to: ${greetingContract.target}`);
            } catch (error) {
                console.error(error);
            }

        }
        deployContract();
    }
    return (
        <>
            <StyledDeployButton disabled={!active || greetingContract ? true : false} onClick={handleDeployContract}>Deploy Contract</StyledDeployButton>
            <StyledGreetingDiv>
                <StyledLabel>Contract Address :</StyledLabel>
                <span>{greetingContractAddr ? greetingContractAddr : "Contract is not yet deployed"}</span>
            </StyledGreetingDiv>
            <StyledGreetingDiv>
                <StyledLabel>Greeting : </StyledLabel>
                <span>{greeting ? greeting : <>Contract Not yet deployed</>}  </span>
            </StyledGreetingDiv>
            <StyledGreetingDiv>
                <StyledLabel>Set new Greeting</StyledLabel>
                <input 
                    id='greetingInput' type="text" placeholder={greeting ? '' : 'Contract not yet deployed'}
                    onChange={handleGreetingChange}
                ></input>
            </StyledGreetingDiv>
        </>
    )
}