'use client';

import { useWeb3 } from '@/contexts/Web3Provider';
import { Button, Box, Typography, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import { useState } from 'react';
// Format address to show first and last few characters
const formatAddress = (address: string, chars = 4) => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
};


export const WalletConnectButton = () => {
  const { connectWallet, disconnect, account, balance, isConnected } = useWeb3();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    handleClose();
  };

  if (!isConnected || !account) {
    return (
      <Button
        variant="contained"
        onClick={handleConnect}
        sx={{
          background: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #ea580c 0%, #ca8a04 100%)',
            boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.5), 0 2px 4px -1px rgba(249, 115, 22, 0.3)'
          },
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: '8px',
          padding: '8px 16px'
        }}
        startIcon={
          <Box 
            component="span" 
            sx={{ 
              width: 24, 
              height: 24, 
              background: 'white', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} 
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" fill="#F97316"/>
              <path d="M12 6V12L16.5 9.25L12 6Z" fill="white"/>
            </svg>
          </Box>
        }
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        onClick={handleClick}
        startIcon={
          <Avatar sx={{ width: 24, height: 24, bgcolor: 'transparent', background: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)' }}>
            {account.slice(2, 4).toUpperCase()}
          </Avatar>
        }
      >
        <Box textAlign="left">
          <Typography variant="body2" lineHeight={1}>
            {formatAddress(account)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {parseFloat(balance).toFixed(4)} ETH
          </Typography>
        </Box>
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem sx={{ '&:hover': { backgroundColor: 'transparent' }, cursor: 'default' }}>
          <Box p={1}>
            <Box display="flex" alignItems="center" mb={1}>
              <img 
                src="/metamask-fox.svg" 
                alt="MetaMask" 
                width={24} 
                height={24} 
                style={{ marginRight: '8px' }} 
              />
              <Typography variant="subtitle2" fontWeight={600}>
                Connected with MetaMask
              </Typography>
            </Box>
            <Box 
              display="inline-flex" 
              alignItems="center" 
              bgcolor="rgba(249, 115, 22, 0.1)" 
              px={1.5} 
              py={0.5} 
              borderRadius={1}
            >
              <Box 
                width={8} 
                height={8} 
                bgcolor="#22C55E" 
                borderRadius="50%" 
                mr={1} 
              />
              <Typography variant="body2" color="rgb(249, 115, 22)" fontFamily="monospace">
                {formatAddress(account, 6)}
              </Typography>
            </Box>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={handleDisconnect}
          sx={{ 
            '&:hover': { 
              backgroundColor: 'rgba(239, 68, 68, 0.04)',
              '& .MuiTypography-root': {
                color: '#EF4444'
              }
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <Box display="flex" alignItems="center">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: '8px' }}
            >
              <path 
                d="M17 16L21 12M21 12L17 8M21 12H9M13 16V17C13 17.7956 12.6839 18.5587 12.1213 19.1213C11.5587 19.6839 10.7956 20 10 20H6C5.20435 20 4.44129 19.6839 3.87868 19.1213C3.31607 18.5587 3 17.7956 3 17V7C3 6.20435 3.31607 5.44129 3.87868 4.87868C4.44129 4.31607 5.20435 4 6 4H10C10.7956 4 11.5587 4.31607 12.1213 4.87868C12.6839 5.44129 13 6.20435 13 7V8" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <Typography color="error" fontWeight={500}>
              Disconnect
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};

