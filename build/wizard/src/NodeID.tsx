import React, { useEffect, useState } from 'react';

interface NodePOP {
    publicKey: string;
    proofOfPossession: string;
}

function NetworkID() {
    const [nodeID, setNodeID] = useState();
    const [nodePOP, setNodePOP] = useState<NodePOP | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch network info
        const fetchNodeID = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://avalanchego.my.ava.do:9650/ext/info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'info.getNodeID',
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log("RES", JSON.stringify(data));
                if (data.result?.nodeID) {
                    setNodeID(data.result.nodeID);
                }
                if (data.result?.nodePOP) {
                    setNodePOP(data.result.nodePOP);
                }
            } catch (error) {
                console.error('Error fetching network name:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNodeID();
    }, []); // Empty dependency array means this effect runs once on mount

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (


        <>

            <section className="is-medium has-text-white">

                <table className="table-profile table-wider-first-column">
                    <tbody><tr>
                        <th colSpan={1}></th>
                        <th colSpan={1}></th>
                    </tr>
                        <tr>
                            <td>Node Id</td>
                            <td>{nodeID}</td>
                        </tr>
                        <tr>
                            <td>BLS Public Key</td>
                            <td className="table-cell-wrap">{nodePOP?.publicKey}</td>
                        </tr>
                        <tr>
                            <td>BLS Signature</td>
                            <td className="table-cell-wrap">{nodePOP?.proofOfPossession}</td>
                        </tr>
                    </tbody></table>
            </section>
        </>
    );
}

export default NetworkID;
