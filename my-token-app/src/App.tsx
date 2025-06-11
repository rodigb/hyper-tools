import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { formatDistanceToNow } from "date-fns";

interface NewToken {
  name: string;
  symbol: string;
  address: string;
  discoveredAt: number;
}

const App: React.FC = () => {
  const [newTokens, setNewTokens] = useState<NewToken[] | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchNewTokens = async () => {
      try {
        const res = await fetch("http://localhost:8080/new-tokens");
        const data = await res.json();
        const sorted = data
          .sort((a: NewToken, b: NewToken) => b.discoveredAt - a.discoveredAt)
          .slice(0, 50);
        setNewTokens(sorted);
      } catch (err) {
        console.error("Failed to fetch new tokens:", err);
      }
    };

    fetchNewTokens();
    interval = setInterval(fetchNewTokens, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f3f4f6"
      width="100vw"
    >
      <Typography variant="h4" gutterBottom>
        Most Recently Launched Tokens
      </Typography>
      <Box mt={4} width="100%">
        {newTokens === null ? (
          <CircularProgress />
        ) : newTokens.length === 0 ? (
          <Typography>No new tokens detected.</Typography>
        ) : (
          newTokens.map((token, index) => (
            <Box
              key={index}
              mb={2}
              p={2}
              bgcolor="#fff"
              borderRadius={2}
              boxShadow={1}
            >
              <Typography>
                <strong>
                  {token.name} ({token.symbol})
                </strong>
              </Typography>
              <Typography variant="body2">Address: {token.address}</Typography>
              <Typography variant="body2">
                Discovered {formatDistanceToNow(new Date(token.discoveredAt))}{" "}
                ago
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default App;
