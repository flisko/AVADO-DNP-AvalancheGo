import React, { useEffect, useState } from 'react';

function IsBootStrapped({ chain }: { chain: string }) {
    const [isBootStrapped, setIsBootStrapped] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch network info
        const fetchBootstrapped = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://avalanchego.my.ava.do:9650/ext/info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'info.isBootstrapped',
                        "params": {
                            "chain": chain
                        }
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                if (data.error){
                    throw new Error(data.error.message);
                }

                setIsBootStrapped(data?.result?.isBootStrapped === true);

            } catch (error) {
                console.error('Error fetching bootstrap info:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBootstrapped();
    }, [chain]); // Empty dependency array means this effect runs once on mount


    if (isLoading) return <div>{chain}-chain: Loading...</div>;
    if (error) return <div>{chain}-chain:  Error: {error}</div>;

    return (
        <div>
            <p>{chain}-chain: {isBootStrapped ? "ready" : "not ready yet"}</p>
        </div>
    );
}

export default IsBootStrapped;
