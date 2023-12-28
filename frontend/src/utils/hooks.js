import { useWeb3React } from "@web3-react/core";
import { injected } from "./connectors";
import { useCallback, useEffect,useState } from "react";

export function useWeb3Connect() {
    const { activate, active } = useWeb3React();
    const [tried, setTried] = useState(false);

    const tryActivate = useCallback(() => {
        async function _tryActivate() {
            const isAuthorized = await injected.isAuthorized();// 승인되어있으면 true

            if (isAuthorized) {
                try {
                    await activate(injected, undefined, true);// activate 함수가 켜지면 active가 트루가된다 지갑이 연결되어있는것 커넥터 활성화
                } catch (error) {
                    window.alert('Error: ' + (error && error.message));
                }
            }
            setTried(true); 
        }
        _tryActivate();
    },[activate])

    useEffect(() => {
        tryActivate();
    }, [tryActivate]);

    useEffect(() => {
        if (!tried && active) {
            setTried(true);
        }
    }, [tried, active]);

    return tried;
}

//여기서는 이더리움 자체 라이브러리 가져와서 이더리움 상태에따라 체인이바뀌거나 어카운트 바뀌거나 이런 변경을 감지해서 web3 react와 
//연동하는 부분을 작성, 메타마스크가 있으면 자동으로 연결되게 하는등 
// suppress로 외부에서 접근가능하게 suppress가 true면 useEffect아예 안쓰는 거처럼 
export function useInactiveListner(suppress = false) {
    const {active,error,activate} = useWeb3React();

    useEffect( () => {
        const {ethereum} = window;

        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleConnect = () => {
                console.log('handle connect');
                activate(injected);
            }
            const handleChainChanged = (chainId) => {
                console.log('handleChainChanged',chainId);
                activate(injected);
            }
            const handleAccountsChanged = (accounts) => {
                console.log('handleAccountsChanged',accounts);
                if(accounts.length >0){
                    activate(injected);
                }
            }
            ethereum.on('connect',handleConnect);
            ethereum.on('chainChanged',handleChainChanged);
            ethereum.on('accountsChanged',handleAccountsChanged);
            
            return () => {
                if( ethereum.removeListner) {
                    ethereum.removeListner('connect',handleConnect);
                    ethereum.removeListner('chainChanged',handleChainChanged);
                    ethereum.removeListner('accountsChanged',handleAccountsChanged);

                }
            }
        }
    },[active,error,activate,suppress])
}