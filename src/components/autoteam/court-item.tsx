import React from 'react';
import PlayerList from './player-list';
import { Court } from '../../models/court';
import { Player } from '../../models/player';
import { CourtPlayer } from '../../models/courtPlayer';
import { Operation, OperationName } from '../generics/confirmationDialog';
import { useIsDebugging } from '../../app/debug.context';
import { Box, Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { CourtService } from '@/services/courtSevice';

interface CourtItemProps {
  court: Court;
  myPlayer: Player | null;
  openDialog: (dialogData: Operation) => void;
  openSetMeInDialog: (dialogData: Operation) => void;
  openSetMeOutDialog: (dialogData: Operation) => void;
}
const CourtItem: React.FC<CourtItemProps> = ({ court, myPlayer, openDialog, openSetMeInDialog, openSetMeOutDialog }) => {
  const isDebugging = useIsDebugging();
  let myCourtPlayer: CourtPlayer | null = court.players.find(player => {
    return player.id == Number(myPlayer?.id);
  }) ?? null;
  if (!myCourtPlayer) {
    myCourtPlayer = court.invitedPlayers.find(player => {
      return player.id == Number(myPlayer?.id);
    }) ?? null;
  }
  const getRowClass = () => {
    if (myCourtPlayer || myPlayer?.role === 'admin') {
      if (myCourtPlayer?.paid) {
        if (court.court_state === 'reserved') {
          return 'bg-green-100';
        } else if (court.court_state === 'closed') {
          return 'bg-orange-100';
        } else if (court.court_state === 'opened') {
          return 'bg-blue-200';
        }
      } else {
        if (court.court_state === 'opened') {
          return 'bg-white';
        } else {
          if (myPlayer?.role === 'admin') {
            if (court.court_state === 'reserved') {
              return '';
            } else {
              return 'bg-red-100';
            }
          } else {
            return 'bg-red-100';
          }
        }
      }
    } else {
      return 'bg-white';
    }
  };

  const renderCourtReserveButton = () => {
    if (myPlayer?.role === 'admin') {
      if (court.court_state === 'closed' || court.court_state === 'expired') {
        return (
          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
            {court.court_state === "closed" && (<Button variant="contained" fullWidth color="success" startIcon={<AddCircleOutlineIcon />}
              onClick={() => openDialog({ message: 'Reservar', data: court, name: OperationName.COURT_RESERVE })}>
            </Button>)}
          </td>
        );
      }
      if (court.court_state === 'reserved') {
        return (
          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
            <Button fullWidth variant="contained" color="warning" startIcon={<RemoveCircleOutlineIcon />}
              onClick={() => openDialog({ message: 'Quitar reserva', data: court, name: OperationName.COURT_UNRESERVE })}>
            </Button>
          </td>
        );
      }
    }
    return null;
  };

  const renderInOutButton = (court: Court) => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    const [dayNumber, month, year] = court.day_date.split('/').map(part => parseInt(part, 10));
    let courtDate = new Date(year, month - 1, dayNumber);
    
    const isCourtAvailable = !['reserved'].includes(court.court_state)
    if (!isCourtAvailable) {
      return null;
    }
    return (courtDate >= today) && (myCourtPlayer ? (
      <Button variant="contained" fullWidth color="error" startIcon={<RemoveCircleOutlineIcon />}
        onClick={() => {
          if (court.court_state === 'reserved') {
            openSetMeOutDialog({ message: 'Salir', data: court, name: OperationName.COURT_OUT })
          } else {
            openDialog({ message: 'Salir', data: court, name: OperationName.COURT_OUT })
          }
        }}/>
        ) : (
        <Button fullWidth variant="contained"
            onClick={() => openSetMeInDialog({ message: 'Entrar', data: court, name: OperationName.COURT_IN })}
            className="bg-green-500 hover:bg-green-200"
            startIcon={<AddCircleOutlineIcon />}
          />
        ))
  };
  
  return (
    <Card variant="outlined" sx={{ mb: 2, height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <CardHeader
          title={court.name}
          titleTypographyProps={{ variant: 'h6' }}
          sx={{ backgroundColor: '#f5f5f5', textAlign: 'center' }}
        />
        <Box sx={{ mb: 2 }}>
          
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            {court.day_name}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Fecha: {court.day_date}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Hora: {court.hour}
          </Typography>
          <Typography color="text.secondary">
            Jugadores: <PlayerList myPlayer={myPlayer} players={court.players} invitedPlayers={court.invitedPlayers} anonPlayers={court.anonPlayers} isDebugging={ isDebugging } />
          </Typography>
          <Typography color="text.secondary">
            Precio: {court.price}
          </Typography>
        </Box>
        <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {renderInOutButton(court)}
          {renderCourtReserveButton()}
        </Box>
      </CardContent>
    </Card>
  );
};
export default CourtItem;