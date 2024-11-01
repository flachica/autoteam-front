"use client"

import React, { useEffect, useState } from 'react';
import ConfirmationDialog, { Operation, OperationName } from '../../components/generics/confirmationDialog';
import { HomeData } from '../../models/homeData';
import { Player } from '../../models/player';
import { ClubService } from '../../services/clubService';
import { Court } from '../../models/court';
import LoadingSpinner from '../../components/generics/loadingSpinner';
import CourtList from '../../components/autoteam/court-list';
import NoDataCard from '../../components/generics/NoDataCard';
import ErrorCard from '../../components/generics/errorCard';
import { CourtService } from '../../services/courtSevice';
import { Club } from '../../models/club';
import { IconButton, LinearProgress, Box, Button} from '@mui/material';
import { ArrowBack, ArrowForward, Refresh } from '@mui/icons-material';
import NewCourtDialog from '../../components/autoteam/newCourtDialog';
import { GroupedHour } from '../../models/grouped-hour';
import { HourService } from '../../services/hourService';
import { PlayerService } from '../../services/playerService';
import axios, { AxiosError, isAxiosError } from 'axios';
import { usePlayer } from '../player.context';
import { useRouter } from 'next/navigation';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SetMeInDialog from '../../components/autoteam/setMeInDialog';


export default function Home() {
  const myPlayer = usePlayer();
  const [homeData, setHomeData] = useState<HomeData>({ clubs: [], week: '', currentBalance: 0 });
  const [groupedHour, setGroupedHour] = useState<GroupedHour>({ id:0, group_name: '', days: [], active: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previousError, setPreviousError] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSetMeInDialogOpen, setIsSetMeInDialogOpen] = useState(false);
  const [isNewCourtOpen, setIsNewCourtOpen] = useState(false);
  const [isSetMeOutOpen, setIsSetMeOutOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<Operation>();
  const [selectedClub, setSelectedClub] = useState<Club>();
  const [selectedCourt, setSelectedCourt] = useState<Court>();
  const [week, setWeek] = useState(0);
  const [monday, setMonday] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [futureBalance, setFutureBalance] = useState<number>(0);
  const [confirmMessage, setConfirmMessage] = useState<string>('');
  const router = useRouter();

  const courtService = new CourtService();
  const playerService = new PlayerService();
  const clubService = new ClubService();
  const hourService = new HourService();    

  const handleWallet = async () => {
    await router.push('/cash');
  }

  const handlePreviousWeek = () => {
    setWeek(week - 1);
  };

  const handleNextWeek = () => {
    setWeek(week + 1);
  };

  const fetchGroupedHours = async () => {
    if (!myPlayer || !myPlayer.accessToken) return;
    const groupedHours = await hourService.getData(myPlayer.accessToken);
    if (groupedHours) {
      setGroupedHour(groupedHours);
    }
  }

  useEffect(() => {
    fetchGroupedHours(); 
  }, [myPlayer]);

  const fetchData = async () => {
    setPreviousError(false);
    setIsRefreshing(true);
    try {
      if (!myPlayer || !myPlayer.accessToken) {
        setIsRefreshing(false);
        return;
      }
      const today = new Date();
      const dayWeek = today.getDay();
      const diff = dayWeek === 0 ? -6 : 1 - dayWeek;
      const monday = new Date(today.setDate(today.getDate() + diff));

      const mondayWithWeeks = new Date(monday);
      mondayWithWeeks.setDate(monday.getDate() + (week * 7));
      const weekDay = mondayWithWeeks.toLocaleDateString('es-ES').replace(/\//g, '-');
      setMonday(weekDay);
      const homeData: HomeData = await clubService.getData(weekDay, myPlayer.accessToken);
      
      setHomeData(homeData);
      const myPlayerData = await playerService.getMyPlayerData(myPlayer.accessToken, myPlayer.id);
      if (myPlayerData) {
        setCurrentBalance(myPlayerData.balance);
        setFutureBalance(myPlayerData.futureBalance);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          const errorMessage = (axiosError.response.data as { message: any }).message;
          if (errorMessage.name === 'TokenExpiredError') {
            router.push('/login');
          } else {
            setPreviousError(true);
            console.error(`Error al actualizar: ${JSON.stringify(axiosError.response.data) || axiosError.message}`);
          }
        } else {
          setPreviousError(true);
          console.error(`Error al actualizar: ${axiosError.message}`);
        }
      } else {
        setPreviousError(true);
        console.error(`Error al actualizar: ${error}`);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (myPlayer && myPlayer.accessToken) fetchData();
  }, [myPlayer, week, isSetMeInDialogOpen, isSetMeOutOpen]);

  const fetchPlayers = async () => {
    if (!myPlayer || !myPlayer.accessToken) return;
    const players = await playerService.getData(myPlayer.accessToken);
    if (!players) {
      throw new Error('Error al cargar los datos de jugadores');
    }
    setPlayers(players);
  }

  useEffect(() => {
    fetchPlayers();
  }, [myPlayer, isSetMeOutOpen]);

  const openDialog = (operation: Operation) => {
    setSelectedOperation(operation);
    setIsDialogOpen(true);
  };

  const openSetMeInDialog = (operation: Operation) => {
    setIsSetMeInDialogOpen(true);
    setSelectedOperation(operation);
  };

  const openNewCourtDialog = (club: Club) => {
    setSelectedClub(club);
    setIsNewCourtOpen(true);
  }

  const openSetMeOutDialog = (operation: Operation) => {
    setSelectedOperation(operation);
    setSelectedCourt(operation.data);
    setIsSetMeOutOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsSetMeInDialogOpen(false);
    setSelectedOperation(undefined);
    setPreviousError(false);
    setIsRefreshing(false);
  };

  const closeNewCourtDialog = () => {
    setIsNewCourtOpen(false);
    setSelectedClub(undefined);
    setPreviousError(false);
    setIsRefreshing(false);
  };

  const closeSetMeOutDialog = () => {
    setIsSetMeOutOpen(false);
    setSelectedCourt(undefined);
    setPreviousError(false);
    setIsRefreshing(false);
  };

  const handleNewCourtConfirmOperation = async (selectedDay: string, selectedTime: string) => {
    setIsRefreshing(true);
    try {
      if (!myPlayer || !myPlayer.accessToken) {
        setIsRefreshing(false);
        return;
      }
        
      await courtService.newCourt(myPlayer!.id, selectedClub!.id, selectedDay, selectedTime, myPlayer.accessToken);
      await fetchData();
    } catch (error) {
      closeNewCourtDialog();
      handleServiceError(error);
    } finally {
      setIsRefreshing(false);
      closeNewCourtDialog();
    }
  }

  const handleSetMeOutConfirmOperation = async (toPlayerId: number | undefined) => {
    setIsRefreshing(true);
    try {
      if (!myPlayer || !myPlayer.accessToken) {
        setIsRefreshing(false);
        return;
      }
      await courtService.setMeOut(myPlayer!.id, selectedCourt!.id, toPlayerId, myPlayer.accessToken);
      await fetchData();
    } catch (error) {
      handleServiceError(error);
    } finally {
      setIsRefreshing(false);
      closeSetMeOutDialog();
    }
  }

  const handleSetMeOut = async (courtId: number, toPlayerId: number | undefined) => {
    setIsRefreshing(true);
    try {
      if (!myPlayer || !myPlayer.accessToken) {
        setIsRefreshing(false);
        return;
      }
      await courtService.setMeOut(myPlayer!.id, courtId, toPlayerId, myPlayer.accessToken);
      await fetchData();
    } catch (error) {
      handleServiceError(error);
    } finally {
      setIsRefreshing(false);
      closeSetMeOutDialog();
    }
  }

  const handleUnReserve = async (courtId: number) => {
    setIsRefreshing(true);
    try {
      if (!myPlayer || !myPlayer.accessToken) {
        setIsRefreshing(false);
        return;
      }
      await courtService.unReserve(myPlayer!.id, courtId, myPlayer.accessToken);
      await fetchData();
    } catch (error) {
      handleServiceError(error);
    } finally {
      setIsRefreshing(false);
      closeDialog();
    }
  }

  const handleDelete = async (courtId: number) => {
    setIsRefreshing(true);
    try {
      if (!myPlayer || !myPlayer.accessToken) {
        setIsRefreshing(false);
        return;
      }
      await courtService.deleteCourt(courtId, myPlayer.accessToken);
      await fetchData();
    } catch (error) {
      handleServiceError(error);
    } finally {
      setIsRefreshing(false);
      closeDialog();
    }
  }

  const handleConfirmSetMeInOperation = async (courtId: number, invitedPlayerIds: number[], invitedAnonPlayers: string[]) => {
    setIsRefreshing(true);
    try {
      if (!myPlayer || !myPlayer.accessToken) {
        setIsRefreshing(false);
        return;
      }
      await courtService.setMeIn(myPlayer!.id, courtId, myPlayer.accessToken, invitedPlayerIds, invitedAnonPlayers);
      await fetchData();
    } catch (error) {
      handleServiceError(error);
    } finally {
      setIsRefreshing(false);
      setIsSetMeInDialogOpen(false);
    }
  }

  const handleConfirmOperation = async () => {
    setIsRefreshing(true);
    if (selectedOperation) {
      if (selectedOperation.name === OperationName.COURT_OUT) {
        await handleSetMeOut(selectedOperation.data.id, selectedOperation.data.toPlayerId);
      } else if (selectedOperation.name === OperationName.COURT_RESERVE) {
        router.push('/admin')
      } else if (selectedOperation.name === OperationName.COURT_UNRESERVE) {
        await handleUnReserve(selectedOperation.data.id);
      } else if (selectedOperation.name === OperationName.COURT_DELETE) {
        await handleDelete(selectedOperation.data.id);
      } else {
        throw new Error(`Operación no soportada: ${selectedOperation.name}`);
      }
    }
    closeDialog();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return <LoadingSpinner message='Cargando' />;
  }

  if (!homeData) {
    return <NoDataCard message="No hay datos" />;
  }
  if (!homeData.clubs) {
    let message = 'No hay datos';
    if (homeData.week) {
      message = `No hay datos para la semana ${homeData.week}`;
    }
    return <NoDataCard message={message} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-start justify-center">
      <NewCourtDialog
          isOpen={isNewCourtOpen}
          firstDayOfWeek={monday}
          club={selectedClub || { id: 0, name: '', courts: [] }}
          hours={groupedHour}
          onConfirm={handleNewCourtConfirmOperation}
          onCancel={closeNewCourtDialog}
      />
      {isRefreshing && <LinearProgress className="absolute top-0 left-0 w-full" />}
      <div className="w-full max-w-5xl">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          { !homeData.week && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center justify-between" role="alert">
              <span className="block sm:inline">Hubo un error al obtener datos</span>
              <IconButton color="primary" onClick={fetchData}>
                <Refresh />
              </IconButton>
            </div>
          )}
          { !previousError && !isLoading && (
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" justifyContent="center" flexGrow={1}>
                {(myPlayer?.role === "admin" || (week > -1 && week <= 1)) && (
                  <IconButton color="primary" onClick={handlePreviousWeek}>
                    <ArrowBack />
                  </IconButton>
                )}
                <Box mx={2} sx={{ color: 'black' }}>{homeData.week}</Box>
                {(myPlayer?.role === "admin" || (week >= -1 && week <= 0)) && (
                  <IconButton color="primary" onClick={handleNextWeek}>
                    <ArrowForward />
                  </IconButton>
                )}
              </Box>
              <Box display="flex" flexDirection="column" alignItems="flex-end" ml="auto">
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                  <span style={{ color: currentBalance < 3 ? 'red' : currentBalance < 10 ? 'orange' : 'black' }}>
                    Saldo actual: {currentBalance} €
                  </span>
                  <span style={{ color: futureBalance < 3 ? 'red' : futureBalance < 10 ? 'orange' : 'black' }}>
                    Saldo previsto: {futureBalance} €
                  </span>
                </Box>
              </Box>
            </Box>
        )}
          {
            homeData.week && !homeData.clubs.length && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center justify-between" role="alert">
                <span className="block sm:inline">Aún no se ha abierto la semana</span>
              </div>
            )
          }
          {homeData.clubs.map((club, index) => (
            <div key={index} className="mb-6">
              {homeData.clubs.length > 1 && (<h2 className="text-2xl font-bold mb-4 text-gray-800">{club.name}</h2>)}
              <div className="mt-2 mb-5">                
              {(myPlayer?.role === "admin" || (week == 0 || (week == 1 && club.courts.length > 0))) && (<Button variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />}
                    onClick={() => openNewCourtDialog(club)}>
                Abrir pista en {club.name}
              </Button>)}
              </div>
              <div className="overflow-x-auto">
                {
                CourtList({ courts: club.courts, myPlayer: myPlayer!, openDialog: openDialog, openSetMeInDialog: openSetMeInDialog, openSetMeOutDialog: openSetMeOutDialog })
                }
                {
                    <div className="mt-5">    
                      {(myPlayer?.role === "admin" || (week == 0 || (week == 1 && club.courts.length > 0))) && (<Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => openNewCourtDialog(club)}
                      >
                        Abrir pista en {club.name}
                      </Button>)}
                    </div>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
      {errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <ErrorCard error={errorMessage} onClose={() => setErrorMessage("")} />
        </div>
      )}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        operation={selectedOperation || { message: '', name: OperationName.COURT_IN, data: {} }}
        message={selectedOperation?.name === OperationName.COURT_OUT ? 'Va a eliminar a sus invitados' : confirmMessage}
        onConfirm={handleConfirmOperation}
        onCancel={closeDialog}
      />
      <SetMeInDialog
        isOpen={isSetMeInDialogOpen && myPlayer != null}
        courtId={selectedOperation?.data.id || 0}
        players={players.filter(player => player.id !== Number(myPlayer?.id))}
        onConfirm={handleConfirmSetMeInOperation}
        onCancel={closeDialog}
      />
    </div>
  );

  function handleServiceError(error: unknown) {
    setPreviousError(true);
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
  }
}
