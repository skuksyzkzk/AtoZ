import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react";
import styled from "styled-components"
import { ethers} from "ethers";

const StyledWalletStatusDiv = styled.div`
    display : flex;
    gap :20px;
`

function ChainId () {
    const { chainId } = useWeb3React();

    return (
        <>
            <span>Chain Id:</span>
            <span>{chainId}</span>
        </>
    )
}

function BlockNumber() {
    const {library,chainId} = useWeb3React();
    const [blockNumber,setBlockNumber] = useState();

    useEffect( () => {
        if(!library) return;

        let stale = false;

        async function getBlockNumber() {
            try {
                const blockNumber = await library.getBlockNumber();
                if(!stale) {
                    setBlockNumber(blockNumber);
                } 
            }catch(error){
                window.alert(error);
            }
        }

        getBlockNumber();

        library.on('block',getBlockNumber);

        return () => {
            stale = true;
            library.removeListener('block',getBlockNumber);
            setBlockNumber(undefined);
        }
    },[chainId,library])

    return ( 
        <>
            <span>Block Number: </span>
            <span>{blockNumber}</span>
        </>
    )
}

function Account() {
    const {account} = useWeb3React();

    return ( 
        <>
            <span>Account :</span>
            <span>
                {account ? `${account.substring(0,6)}...${account.length-4}}` : ''}
            </span>
        </>
    )
}

function Balance() {
    const {chainId,library,account} = useWeb3React();
    const [balance,setBalance] = useState();

    let stale = false; //flag 이걸로 컨트롤

    useEffect(() => {
        if (typeof account === 'undefined' || account === null || !library){
            return;
        }
        async function getBalacne() {
            try {
                const balance = await library.getBalance(account);          
                if(!stale){
                    setBalance(balance);
                }
            }catch(error){
                window.alert(error);
            }
        }

        getBalacne();

        library.on('block',getBalacne);
        
        return () => { 
            stale = true;
            library.removeListener('block',getBalacne);
            setBalance(undefined);
        }
    },[chainId,library,account])

    return (
        <>
            <span>Balance :</span>
            <span>
                {balance ? balance.toString() : 'nothing'}
            </span>
        </>
    )
}

function NextNonce() {
    const {account,library,chainId} = useWeb3React();
    const [nextNonce,setNextNonce] = useState();

    useEffect( () =>{
        if (typeof account === 'undefined' || account === null || !library){
            return;
        }
        let stale = false;

        async function getNextNonce() {
            try{
                const nextNonce = await library.getTransactionCount(account);
                if(!stale) {
                    setNextNonce(nextNonce);
                }
            }catch(error){
                console.error(error);
            }
        }
        getNextNonce();

        library.on('block',getNextNonce);

        return () => {
            stale = true;
            library.removeListener('block',getNextNonce);
            setNextNonce(undefined);
        }
    })

    return (
        <>
            <span>NextNonce: </span>
            <span>{nextNonce ? nextNonce : ''}</span>
        </>
    )
}
export function WalletStatus() {
    return (
        <StyledWalletStatusDiv>
        
            <ChainId />
            <BlockNumber />
            <Account />
            <Balance />
            <NextNonce />

        </StyledWalletStatusDiv>
    )
}