"use client";
import { useEffect, useState } from 'react';
import { Player } from '../../models/player';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React from 'react';
import { Card, CardContent, Typography, Grid, Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, CircularProgress, TableSortLabel, Alert, Snackbar, Switch, IconButton, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, Checkbox, DialogActions, DialogContent, FormControlLabel } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { PlayerService } from '../../services/playerService';
import { usePlayer } from '../player.context';
import { CourtService } from '../../services/courtSevice';
import { Reservation } from '../../models/reservation';
import { GroupedHour } from '../../models/grouped-hour';
import { HourService } from '../../services/hourService';
import { ClubService } from '../../services/clubService';
import { CheckableClub, Club } from '../../models/club';
import axios from 'axios';
import { useIsDebugging } from '../debug.context';
import { CashService } from '../../services/cashService';
import { format } from 'date-fns/format';
import { PaginatedMovements } from '../../models/movement';
import PlayerList from '@/components/autoteam/player-list';
import ProfileForm from '@/components/autoteam/profile-form';

const AdminHomePage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Player; direction: 'asc' | 'desc' } | null>({ key: 'id', direction: 'desc' });
  const [sortReservationConfig, setReservationSortConfig] = useState<{ key: keyof Reservation; direction: 'asc' | 'desc' } | null>({ key: 'id', direction: 'asc' });
  const myPlayer = usePlayer();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [reservationInProgress, setReservationInProgress] = useState<number | null>(null);
  const [editedReservationName, setEditedReservationName] = useState<string>('');
  const [groupedHours, setGroupedHours] = useState<GroupedHour[] | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubs, setSelectedClubs] = useState(clubs.map(club => ({ ...club, checked: false })));
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [editPlayerDialogOpen, setEditPlayerDialogOpen] = useState(false);
  const [allMoves, setAllMoves] = useState<PaginatedMovements | null>(null);
  
  const playerService = new PlayerService();
  const courtService = new CourtService();
  const hourService = new HourService();
  const clubService = new ClubService();
  const cashService = new CashService();
  const isDebugging = useIsDebugging();
  

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      if (!myPlayer || !myPlayer.accessToken) {
        setLoading(false);
        return;
      }
      await playerService.resetPassword(selectedPlayer!.id, myPlayer.accessToken);
    } catch (error) {
      manageMessageError(error);
    }
    setLoading(false);
    handleClosePopup();
  }

  const handleResetDialogOpenPopup = async (player: Player) => {
    setSelectedPlayer(player);
    setResetDialogOpen(true);
  };

  const handleEditPlayerDialogOpenPopup = async (player: Player) => {
    setSelectedPlayer(player);
    setEditPlayerDialogOpen(true);
  };

  const handleClosePopup = () => {
    setDialogOpen(false);
    setResetDialogOpen(false);
    setEditPlayerDialogOpen(false);
  };

  const handleDialogClubChange = (checkableClub: CheckableClub) => {
    setSelectedClubs((prevClubs: CheckableClub[]) =>
      prevClubs.map(club =>
        club.id === checkableClub.id ? { ...club, checked: !club.checked } : club
      )
    );
  };
    
  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      if (!myPlayer || !myPlayer.accessToken) {
        setLoading(false);
        return;
      }
      try {
        const data = await clubService.getClubs(myPlayer.accessToken);
        setClubs(data);
      } catch (error) {
        manageMessageError(error);
      }
      setLoading(false);
    };

    fetchClubs();
  }, [myPlayer]);

  const fetchAllMoves = async () => {
    try {
      let startDate = '',
        endDate = '',
        page = 0,
        pageSize = 10;
      
      const response = await cashService.getAllMovements(myPlayer?.accessToken || '', startDate, endDate, page, pageSize);
      setAllMoves(response);
    } catch (error) {
      manageMessageError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    if (!myPlayer || !myPlayer.accessToken) {
      setLoading(false);
      return;
    }
    fetchAllMoves();
    setLoading(false);
  }, [myPlayer]);


  const handleCancelReservation = (reservationId: number) => {
    setReservationInProgress(null);
  };

  const handleStartReservation = (reservationId: number) => {
    setReservationInProgress(reservationId);
  };
  
  const fetchPlayers = async () => {
    setLoading(true);
    try {
      if (!myPlayer || !myPlayer.accessToken) {
        setLoading(false);
        return;
      }
      const data = await playerService.getData(myPlayer.accessToken);
      setPlayers(data);
    } catch (error) {
      manageMessageError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlayers();
  }, [myPlayer, reservations]);

  const fetchGroupedHours = async () => {
    setLoading(true);
    try {
      if (!myPlayer || !myPlayer.accessToken) {
        setLoading(false);
        return;
      }
      const data = await hourService.getAllGroupedHours(myPlayer.accessToken);
      setGroupedHours(data);
    } catch (error) {
      manageMessageError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGroupedHours();
  }, [myPlayer]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      if (!myPlayer || !myPlayer.accessToken) {
        setLoading(false);
        return;
      }
      const data = await courtService.getPendingReservations(myPlayer.accessToken);
      let reservations: Reservation[] = [];
      for (let i = 0; i < data.length; i++) {
        reservations.push({
          id: data[i].id,
          name: data[i].name,
          day_date: format(new Date(data[i].date), 'dd-MM-yyyy'),
          players: data[i].players,
          day_name: data[i].day_name,
          hour: data[i].hour,
          price: data[i].price,
          court_state: data[i].court_state,
          invitedPlayers: data[i].invitedPlayers,
          anonPlayers: data[i].anonPlayers,
        });
      }
      setReservations(reservations);
    } catch (error) {
      manageMessageError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, [myPlayer]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const handleToggleActive = async (groupId: number, active: boolean) => {
    setLoading(true);
    try {
      if (!myPlayer || !myPlayer.accessToken) {
        setLoading(false);
        return;
      }
      await hourService.toggleActive(groupId, active, myPlayer.accessToken);
      await fetchGroupedHours();
    } catch (error) {
      manageMessageError(error);
    }
    setLoading(false);
  }

  const handleReservation = async (courtId: number) => {
    setLoading(true);
    try {
      if (!myPlayer || !myPlayer.accessToken) {
        setLoading(false);
        return;
      }
      await courtService.reserve(Number(myPlayer?.id), courtId, editedReservationName, myPlayer.accessToken);
      await fetchReservations();
    } catch (error) {
      manageMessageError(error);
    }
    setLoading(false);
  }

  const handleOpenWeek = async (date: string, clubId: string, hour: string) => {
    setLoading(true);
    try {
      if (!myPlayer || !myPlayer.accessToken) {
        setLoading(false);
        return;
      }
      const [year, month, day] = date.split('-');
      await courtService.openWeek({
        date: `${day}-${month}-${year}`,
        clubId,
        hour,
      }, myPlayer.accessToken);
      setErrorMessage('Semana abierta correctamente');
      setSnackbarOpen(true);
    } catch (error) {
      manageMessageError(error);
    }
    setLoading(false);
  }

  function manageMessageError(error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data && typeof error.response.data.message === 'string') {
        setErrorMessage(`Error: ${error.response.data.message}`);
      } else if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage('No se pudo completar la acción');
      } else if (error.request) {
        setErrorMessage('No se recibió respuesta del servidor');
      } else {
        setErrorMessage(`Error en la solicitud: ${error.message}`);
      }
    } else if (error instanceof Error) {
      setErrorMessage(`Error: ${error.message}`);
    } else {
      setErrorMessage('Error al realizar la operación');
    }
    setSnackbarOpen(true);
  }

  const sortedPlayers = React.useMemo(() => {
    let sortablePlayers = [...players];
    if (sortConfig !== null) {
      sortablePlayers.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
        if (bValue === null || bValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePlayers;
  }, [players, sortConfig]);

  const sortedReservations = React.useMemo(() => {
    let sortableReservations = [...reservations];
    if (sortReservationConfig !== null) {
      sortableReservations.sort((rA, rB) => {
        const aValue = rA[sortReservationConfig.key];
        const bValue = rB[sortReservationConfig.key];

        if (aValue === null || aValue === undefined) return sortReservationConfig.direction === 'asc' ? 1 : -1;
        if (bValue === null || bValue === undefined) return sortReservationConfig.direction === 'asc' ? -1 : 1;

        if (aValue < bValue) {
          return sortReservationConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortReservationConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableReservations;
  }, [reservations, sortReservationConfig]);

  const filteredPlayers = sortedPlayers.filter(player =>
    player.name.toLowerCase().includes(filter.toLowerCase()) ||
    (player.surname && player.surname.toLowerCase().includes(filter.toLowerCase())) ||
    player.phone?.includes(filter)
  );

  const requestSort = (key: keyof Player) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const requestSortReservation = (key: keyof Reservation) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortReservationConfig && sortReservationConfig.key === key && sortReservationConfig.direction === 'asc') {
      direction = 'desc';
    }
    setReservationSortConfig({ key, direction });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleReservationNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedReservationName(event.target.value);
  };

  const [formData, setFormData] = useState({
    date: '',
    clubId: '',
    hour: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { date, clubId, hour } = formData;
    handleOpenWeek(date, clubId, hour);
  };

  
  return (
    <section className="w-full flex items-center justify-center bg-gray-100 px-10 pt-6">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <CircularProgress />
        </div>
      )}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
          <CardContent className="flex flex-col items-center">
            <div className="flex items-center mb-4">
                <PeopleIcon fontSize="large" className="mr-4" />
                <Typography variant="h5" component="div">
                  Usuarios
                </Typography>
              </div>
              <TextField
                  label="Filtrar"
                  variant="outlined"
                  value={filter}
                onChange={handleFilterChange}
                fullWidth
                  className="my-4"
              />
              <div className="w-full"  style={{ height: '400px', overflow: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                    {isDebugging && (
                        <TableCell>
                          <TableSortLabel
                            active={sortConfig?.key === 'id'}
                            direction={sortConfig?.key === 'id' ? sortConfig.direction : 'asc'}
                            onClick={() => requestSort('id')}
                          >
                            ID
                          </TableSortLabel>
                        </TableCell>
                      )}
                      <TableCell><TableSortLabel
                          active={sortConfig?.key === 'name'}
                          direction={sortConfig?.key === 'name' ? sortConfig.direction : 'asc'}
                          onClick={() => requestSort('name')}
                        >
                          Nombre
                        </TableSortLabel></TableCell>
                      <TableCell><TableSortLabel
                          active={sortConfig?.key === 'surname'}
                          direction={sortConfig?.key === 'surname' ? sortConfig.direction : 'asc'}
                          onClick={() => requestSort('surname')}
                        >
                          Apellido
                        </TableSortLabel></TableCell>
                      <TableCell><TableSortLabel
                          active={sortConfig?.key === 'phone'}
                          direction={sortConfig?.key === 'phone' ? sortConfig.direction : 'asc'}
                          onClick={() => requestSort('phone')}
                        >
                          Teléfono
                      </TableSortLabel></TableCell>
                      <TableCell><TableSortLabel
                          active={sortConfig?.key === 'email'}
                          direction={sortConfig?.key === 'email' ? sortConfig.direction : 'asc'}
                          onClick={() => requestSort('email')}
                        >
                          EMail
                        </TableSortLabel></TableCell>

                        <TableCell><TableSortLabel
                          active={sortConfig?.key === 'balance'}
                          direction={sortConfig?.key === 'balance' ? sortConfig.direction : 'asc'}
                          onClick={() => requestSort('balance')}
                        >
                          Saldo
                        </TableSortLabel></TableCell>
                        <TableCell><TableSortLabel
                          active={sortConfig?.key === 'balance'}
                          direction={sortConfig?.key === 'balance' ? sortConfig.direction : 'asc'}
                          onClick={() => requestSort('balance')}
                        >
                          Saldo futuro
                        </TableSortLabel></TableCell>
                      <TableCell>
                          Resetear clave
                      </TableCell>
                      <TableCell>
                          Editar jugador
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPlayers.map(player => (
                      <TableRow key={player.id}>
                        {isDebugging && (<TableCell>{player.id}</TableCell>)}
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.surname}</TableCell>
                        <TableCell>{player.phone}</TableCell>
                        <TableCell>{player.email}</TableCell>
                        <TableCell>{player.balance}</TableCell>
                        <TableCell>{player.futureBalance}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color={"error"}
                            onClick={() => handleResetDialogOpenPopup(player)}
                          >
                            Resetear clave
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color={"success"}
                            onClick={() => handleEditPlayerDialogOpenPopup(player)}
                          >
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent className="flex flex-col items-center">
              <div className="flex items-center mb-4">
                <EventIcon fontSize="large" className="mr-4" />
                <Typography variant="h5" component="div">
                  Reservas
                </Typography>
              </div>
              <div className="w-full" style={{ height: '400px', overflow: 'auto' }}>
              <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                    <TableCell><TableSortLabel
                          active={sortReservationConfig?.key === 'id'}
                          direction={sortReservationConfig?.key === 'id' ? sortReservationConfig.direction : 'asc'}
                          onClick={() => requestSortReservation('id')}
                        >
                          Id
                        </TableSortLabel></TableCell>
                      <TableCell><TableSortLabel
                          active={sortReservationConfig?.key === 'name'}
                          direction={sortReservationConfig?.key === 'name' ? sortReservationConfig.direction : 'asc'}
                          onClick={() => requestSortReservation('name')}
                        >
                          Nombre
                        </TableSortLabel></TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortReservationConfig?.key === 'day_date'}
                          direction={sortReservationConfig?.key === 'day_date' ? sortReservationConfig.direction : 'asc'}
                          onClick={() => requestSortReservation('day_date')}
                        >
                        Fecha
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortReservationConfig?.key === 'hour'}
                          direction={sortReservationConfig?.key === 'hour' ? sortReservationConfig.direction : 'asc'}
                          onClick={() => requestSortReservation('hour')}
                        >
                          Hora
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        Jugadores
                      </TableCell>
                      <TableCell style={{ width: '250px' }}>Acción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedReservations.map(reservation => (
                      <TableRow key={reservation.id}>
                        <TableCell>{reservation.id}</TableCell>
                        <TableCell>{reservationInProgress === reservation.id ? (
                            <TextField
                              value={editedReservationName}
                              onChange={handleReservationNameChange}
                              variant="outlined"
                              placeholder={reservation.name}
                              size="small"
                            />
                          ) : (
                            reservation.name
                          )}</TableCell>
                        <TableCell>{reservation.day_date}</TableCell>
                        <TableCell>{reservation.hour}</TableCell>
                        <TableCell>
                          <PlayerList myPlayer={myPlayer} players={reservation.players} invitedPlayers={reservation.invitedPlayers} anonPlayers={reservation.anonPlayers} isDebugging={ isDebugging } />
                        </TableCell>
                        <TableCell>
                        {reservationInProgress === reservation.id ? (
                            <>
                              <Button color="error" onClick={() => handleCancelReservation(reservation.id)} startIcon={<CancelIcon />}>
                                Ko
                              </Button>
                              <Button color="success" onClick={() => handleReservation(reservation.id)} startIcon={<CheckCircleIcon />}>
                                Ok
                              </Button>
                            </>
                          ) : (
                            <Button variant="contained" color="primary" onClick={() => handleStartReservation(reservation.id)}>
                              Reservar
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent className="flex flex-col items-center">
              <div className="flex items-center mb-4">
                <AccessTimeIcon fontSize="large" className="mr-4" />
                <Typography variant="h5" component="div">
                  Horarios
                </Typography>
              </div>
              <div className="w-full" style={{ height: '200px', overflow: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Lunes</TableCell>
                    <TableCell>Martes</TableCell>
                    <TableCell>Miércoles</TableCell>
                    <TableCell>Jueves</TableCell>
                    <TableCell>Viernes</TableCell>
                    <TableCell>Sábado</TableCell>
                    <TableCell>Domingo</TableCell>
                    <TableCell>Activo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedHours && groupedHours.map(group => (
                    <TableRow key={group.id}>
                      <TableCell>{group.group_name}</TableCell>
                      {group.days.map(day => (
                        <TableCell key={day.day_name}>
                          {day.hours.sort((a, b) => a.index - b.index).map(hour => (
                            <div key={hour.id}>
                              {hour.name} - {hour.price}€
                            </div>
                          ))}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Switch
                          checked={group.active}
                          onChange={() => handleToggleActive(group.id, group.active)}
                          color="primary"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent className="flex flex-col items-center">
              <div className="flex items-center mb-4">
                <EventAvailableIcon fontSize="large" className="mr-4" />
                <Typography variant="h5" component="div">
                  Abrir semana
                </Typography>
              </div>
              <div className="w-full text-center p-10" style={{ height: '400px', overflow: 'auto' }}>
              <form onSubmit={handleSubmit} className="w-full">
              <TextField
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="clubId-label">Club ID</InputLabel>
                <Select
                  labelId="clubId-label"
                  name="clubId"
                  value={formData.clubId}
                  onChange={handleChange}
                  label="Club ID"
                >
                  {clubs.map((club) => (
                    <MenuItem key={club.id} value={club.id}>
                      {club.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Hora (HH:MM)"
                name="hour"
                value={formData.hour}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<EventAvailableIcon />}
                fullWidth
              >
                Abrir semana
              </Button>
            </form>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ 
      width: '100%', 
      border: '2px solid #4caf50', 
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' 
    }}>
          {errorMessage}
        </Alert>
      </Snackbar>


      <Dialog open={resetDialogOpen} onClose={handleClosePopup}>
        <DialogTitle>Resetear clave</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Estás seguro de que quieres resetear la clave de {selectedPlayer?.name + " " + selectedPlayer?.surname}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleResetPassword} color="primary">
            Validar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editPlayerDialogOpen} onClose={handleClosePopup} maxWidth="sm"
        fullWidth>
        <ProfileForm token={myPlayer?.accessToken} formRole='admin' player={selectedPlayer} mode={'edit'} onSuccess={async function (): Promise<void> {
          await fetchPlayers();
          setEditPlayerDialogOpen(false);
        } } />
      </Dialog>
      
    </section>
  );
};

export default AdminHomePage;