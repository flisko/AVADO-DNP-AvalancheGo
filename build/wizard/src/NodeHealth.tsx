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
        const fetchNodeHealth = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://avalanchego.my.ava.do:9650/ext/health', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'health.health',
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log("RES", JSON.stringify(data,null,2));


            } catch (error) {
                console.error('Error fetching network name:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNodeHealth();
    }, []); // Empty dependency array means this effect runs once on mount

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Node Health</h1>
            {/* <p>NodeID: {nodeID}</p>
            <p>BLS Public Key: {nodePOP?.publicKey}</p>
            <p>BLS Signature: {nodePOP?.proofOfPossession}</p> */}
        </div>
    );
}

export default NetworkID;
