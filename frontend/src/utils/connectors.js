import {InjectedConnector} from '@web3-react/injected-connector';

export const injected = new InjectedConnector( {
    supportedChainIds : [1,31337] //서포트할 chain id 
})