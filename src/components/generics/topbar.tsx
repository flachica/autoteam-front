import React, { useState } from 'react';
import { usePlayer } from '../../app/player.context';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Menu, MenuItem, CircularProgress, Snackbar, Button, Alert } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SettingsIcon from '@mui/icons-material/Settings'; // Add this line to import SettingsIcon
import { signOut } from 'next-auth/react';
import BugReportIcon from '@mui/icons-material/BugReport'; // Importar el icono de bicho
import { useIsDebugging, useToggleDebugging } from '../../app/debug.context';
import { AccountCircle } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const TopBar = () => {
  const myPlayer = usePlayer();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const toggleDebugging = useToggleDebugging();
  const isDebugging = useIsDebugging();
  const router = useRouter();
  
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCash = async () => {
    setIsRefreshing(true);
    await router.push('/cash');
    setIsRefreshing(false);
    setAnchorEl(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleToken = async () => {
    setIsRefreshing(true);
    navigator.clipboard.writeText(myPlayer?.accessToken || '');
    setSnackbarOpen(true);
    setIsRefreshing(false);
    setAnchorEl(null);
  }

  const handleProfile = async () => {
    setIsRefreshing(true);
    await router.push('/profile');
    setIsRefreshing(false);
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setIsRefreshing(true);
    await signOut({ callbackUrl: '/login' });
  };
  return (
    <div className="topbar">
      { isRefreshing && 
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <CircularProgress />
      </div>}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <div style={{ flexGrow: 1 }} />
          {myPlayer?.role === 'admin' && (
            <IconButton color="inherit" onClick={toggleDebugging}>
              <BugReportIcon style={{ color: isDebugging ? 'red' : 'inherit' }}/>
            </IconButton>
          )}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            {isDebugging && myPlayer && `${myPlayer?.id} -`} {myPlayer?.name} {myPlayer?.surname}
            {myPlayer && <ArrowDropDownIcon />}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleCash}>
              <ListItemIcon>
                <AccountBalanceWalletIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Monedero" />
            </MenuItem>
            {isDebugging && <MenuItem onClick={handleToken}>
              <ListItemIcon>
                <VpnKeyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Token" />
            </MenuItem>}
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Editar perfil" />
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Salir" />
            </MenuItem>
          </Menu>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            >
            <Alert onClose={handleSnackbarClose} severity="success" sx={{ 
              width: '100%', 
              border: '2px solid #4caf50', 
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' 
          }}>
            Token copiado al portapapeles
            </Alert>
          </Snackbar>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          style={{ width: 250, height: 100 + '%'}}
          className="top-bar bg-blue-500 text-white"
        >
          <IconButton onClick={toggleDrawer(false)} style={{ position: 'absolute', top: 0, right: 0, color: 'white'}}>
            <CloseIcon />
          </IconButton>
         <List>
         <ListItem component="a" href="/home">
           <ListItemIcon>
             <HomeIcon className='text-white' />
           </ListItemIcon>
           <ListItemText primary="Inicio" />
         </ListItem>
         <ListItem component="a" href="/about">
           <ListItemIcon>
             <InfoIcon className='text-white' />
           </ListItemIcon>
           <ListItemText primary="Acerca de" />
         </ListItem>

         <ListItem component="a" href="/rules">
           <ListItemIcon>
             <ContactMailIcon className='text-white' />
           </ListItemIcon>
           <ListItemText primary="Normas de uso" />
            </ListItem>
            {
              myPlayer?.role === 'admin' && (
                <ListItem component="a" href="/admin">
                  <ListItemIcon>
                    <SettingsIcon className='text-white' />
                  </ListItemIcon>
                  <ListItemText primary="Administrar" />
                </ListItem>                
              )
            }
            {
              myPlayer?.role === 'admin' && (
                <ListItem component="a" href="/cash-manager">
                <ListItemIcon>
                  <AccountBalanceWalletIcon className='text-white' />
                </ListItemIcon>
                <ListItemText primary="Tesorería" />
                </ListItem>
              )}
         <ListItem component="a" href="/logout">
           <ListItemIcon>
             <ExitToAppIcon className='text-white' />
           </ListItemIcon>
           <ListItemText primary="Salir" />
         </ListItem>
       </List>

        </div>
      </Drawer>
    </div>
  );
};

export default TopBar;