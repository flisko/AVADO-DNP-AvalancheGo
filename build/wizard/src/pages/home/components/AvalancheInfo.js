import React from "react";
import "./AvalancheInfo.css";
import spinner from "../../../assets/spinner.svg";
import checkmark from "../../../assets/green-checkmark-line.svg";

import {
    Avalanche,
    // BinTools,
    // Buffer,
    // BN
} from "avalanche"


const endpoint = {
    protocol: "https",
    host: "avalanchego.avadopackage.com",
    port: 9650
}

const Comp = ({ onNodeReady,onNodeIdAvailable }) => {

    const [nodeID, setNodeID] = React.useState();
    const [nodePeers, setNodePeers] = React.useState();
    const [isBootstrapped, setIsBootstrapped] = React.useState(undefined);
    const [clockTick, setClockTick] = React.useState(0);
    const [walletReady, setWalletReady] = React.useState(false);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setClockTick(c => c + 1);
        }, 1000 * 15);
        return (() => {
            console.log("Clean up timer");
            clearInterval(timer);
        });
    }, []);

    React.useEffect(() => {

        let myNetworkID = 1; //default is 3, we want to override that for our local network
        let myBlockchainID = "X"; // The X-Chain blockchainID on this network
        let ava = new Avalanche(endpoint.host, endpoint.port, endpoint.protocol, myNetworkID, myBlockchainID);

        let info = ava.Info();
        info.getNodeID().then((res) => {
            setNodeID(res);
            onNodeIdAvailable && onNodeIdAvailable(res);
        }).catch((e) => {
            setNodeID(`Unknown:` + e.message);
        })
        info.isBootstrapped(myBlockchainID).then((res) => {
            // debugger;
            setIsBootstrapped(res);
        })
        info.peers().then((res) => {
            // debugger;
            setNodePeers(res.length);
        })

    }, [clockTick]);


    React.useEffect(() => {
        if (nodeID && isBootstrapped && nodePeers > 10) {
            setWalletReady(true);
            onNodeReady && onNodeReady(true);
        } else {
            setWalletReady(false);
        }
    }, [nodeID, isBootstrapped, nodePeers])

    // if (!node) {
    //     return (<div>Loading...</div>);
    // }

    return (
        <>
            <h3 className="is-size-3 has-text-white">Node status</h3>

            <section className="is-medium has-text-white">

                <table className="table-profile">
                    <tbody><tr>
                        <th colSpan="1"></th>
                        <th colSpan="2"></th>
                    </tr>
                        <tr>
                            <td>Node Id</td>
                            <td>{nodeID || "..loading"}</td>
                        </tr>
                        <tr>
                            <td>connected peers</td>
                            <td>{nodePeers || "..loading"}</td>
                        </tr>
                        <tr>
                            <td>is bootstrapped</td>
                            <td>{isBootstrapped === undefined ? "..loading" : isBootstrapped === false ? "no" : "yes"}</td>
                        </tr>
                    </tbody></table>

                {!walletReady ? (
                    <div className="level">
                        <div className="level-left">
                            <span class="icon is-medium ">
                                <img alt="spinner" src={spinner} />
                            </span>
                            <p className="has-text-white is-size-5 has-text-weight-bold">Waiting for AVALANCHE node to finish bootstrapping & syncing</p>
                        </div>
                    </div>
                ) : (
                        <div className="level">
                            <div className="level-left">
                                <img className="icon is-medium" alt="checkmark" src={checkmark} />
                                <p className="has-text-white is-size-5 has-text-weight-bold">Avalanche node is ready</p>
                            </div>
                        </div>
                    )
                }
            </section>
        </>);

};

export default Comp;