"use client";

import React, { useState, useEffect, use } from 'react';
import { Player } from '../../models/player';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, TextField, Box, IconButton, Typography, LinearProgress, useMediaQuery, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { PlayerService } from '../../services/playerService';
import { usePlayer } from '../../app/player.context';
import ErrorCard from '../generics/errorCard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { CashService } from '../../services/cashService';
import RechargeBalanceDialog from './recharge-balance';
import { PaginatedMovements } from '../../models/movement';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ConfirmationDialog, { Operation, OperationName } from '../generics/confirmationDialog';
import axios from 'axios';
import { useIsDebugging } from '@/app/debug.context';

interface CashList {
  player?: Player | null;
  forAdmin?: boolean;
  onSuccess: () => void;
}

const CashList: React.FC<CashList> = ({ onSuccess, forAdmin, player: initialData }) => {
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [paginatedMovements, setMovements] = useState<PaginatedMovements>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previousError, setPreviousError] = useState<boolean>(false);
  const [selectedOperation, setSelectedOperation] = useState<Operation>();
  const isDebugging = useIsDebugging();
  const [players, setPlayers] = useState<Player[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const playerService = new PlayerService();
  const cashService = new CashService();
  const myPlayer = usePlayer();

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
  }, [myPlayer, rechargeDialogOpen]);

  const fetchMovements = async () => {
    try {
      let response: PaginatedMovements;
      const formattedStartDate = startDate ? format(new Date(startDate), 'dd-MM-yyyy') : '';
      const formattedEndDate = endDate ? format(new Date(endDate), 'dd-MM-yyyy') : '';
      if (forAdmin) {
        response = await cashService.getAllMovements(myPlayer?.accessToken, formattedStartDate, formattedEndDate, page, rowsPerPage);
      } else {
        response = await cashService.getMovements(myPlayer?.accessToken, myPlayer!.id, formattedStartDate, formattedEndDate, page, rowsPerPage);
      }
      setMovements(response);
    } catch (error) {
      setError('Error al obtener los movimientos');
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    setIsRefreshing(true);
    if (!startDate)
      setStartDate(format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM-dd')); 
    if (!endDate)
      setEndDate(format(new Date(), 'yyyy-MM-dd'));

    fetchMovements();
  }, [page, rowsPerPage, rechargeDialogOpen, startDate, endDate, isDialogOpen]);

  const openDialog = (operation: Operation) => {
    setSelectedOperation(operation);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setRechargeDialogOpen(false);
    setSelectedOperation(undefined);
    setPreviousError(false);
    setIsRefreshing(false);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleReloadBalance = () => {
    setRechargeDialogOpen(true);
  }

  const onConfirmReloadBalance = async (playerId: number, amount: number, message?: string) => {
    setIsRefreshing(true);
    try {
      await cashService.createMovement(myPlayer!, playerId, amount, message, true);
    } catch (error) {
      setError('Error al crear el movimiento');
    }
    setRechargeDialogOpen(false);
    setIsRefreshing(false);
  }

  const handleConfirmOperation = async () => {
    if (!myPlayer || !myPlayer.accessToken || !selectedOperation) {
      return;
    }
    setIsRefreshing(true);
    try {
      if (selectedOperation) {
        switch (selectedOperation.name) {
          case OperationName.MOVEMENT_VALIDATE:
            await cashService.validateMovement(myPlayer.accessToken, selectedOperation.data);
            break;
          case OperationName.MOVEMENT_REMOVE:
            await cashService.removeMovement(myPlayer!.accessToken, selectedOperation.data.id);
            break;
        }
      }
      await fetchMovements();
    } catch (error) {
      setPreviousError(true);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          if (typeof errorMessage === 'string') {
            setError(`Error: ${errorMessage || 'Error obteniendo datos'}`);
          } else {
            setError('Error obteniendo datos');
          }
        } else if (error.request) {
          setError('No se recibió respuesta del servidor');
        } else {
          setError(`Error en la solicitud: ${error.message}`);
        }
      } else if (error instanceof Error) {
        setError(`Error: ${error.message}`);
      } else {
        setError('Error al realizar la operación');
      }
    }
    setIsDialogOpen(false);
    setIsRefreshing(false);
  }

  return (
    <section className={`cash-list-section ${forAdmin ? 'for-admin' : ''}`}>
      {isRefreshing && <LinearProgress className="absolute top-0 left-0 w-full" />}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl text-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-center">Monedero</h2>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={2}>
          <TextField
              label="Fecha de inicio"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Fecha de fin"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            {forAdmin && (
              <Button variant="contained" color="primary" onClick={handleReloadBalance} startIcon={<AddCircleOutlineIcon />}>
                Crear movimiento
              </Button>
            )}
          </Box>
          {!forAdmin && <Box display="flex" gap={2}>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                  <Typography>Saldo actual:</Typography>
                  <Typography variant="h6">{paginatedMovements?.balance?.toFixed(2)} €</Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="flex-end" mt={2}>
                  <Typography>Saldo previsto:</Typography>
                  <Typography variant="h6">{paginatedMovements?.futureBalance?.toFixed(2) ?? Number("0").toFixed(2)} €</Typography>
                </Box>
              </Box> 
            </Box>}
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {isDebugging && <TableCell>Id</TableCell>}
                <TableCell>Fecha</TableCell>
                {forAdmin && <TableCell align="center">Jugador</TableCell>}
                {forAdmin && <TableCell align="center">Saldo</TableCell>}
                <TableCell align="left">Entrada</TableCell>
                <TableCell align="right">Salida</TableCell>
                <TableCell align="center">Concepto</TableCell>
                {forAdmin && <TableCell align="center">Validar</TableCell>}
                <TableCell align="center">Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMovements && paginatedMovements.items && paginatedMovements.items.map((movement) => (
                <TableRow key={movement.id}>
                  {isDebugging && <TableCell>{movement.id}</TableCell>}
                  <TableCell>{format(new Date(movement.date), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                  {forAdmin && <TableCell align="center">{movement.player?.name} {movement.player?.surname}</TableCell>}
                  {forAdmin && <TableCell align="center">{movement.player?.balance}</TableCell>}
                  <TableCell align="right" className={movement.type === 'in' ? '' : 'empty'}>
                    {movement.type === 'in' ? movement.amount_abs : ''}
                  </TableCell>
                  <TableCell align="right" className={movement.type === 'out' ? '' : 'empty'}>
                    {movement.type === 'out' ? movement.amount_abs : ''}
                  </TableCell>
                  <TableCell align="center">{movement.name}</TableCell>
                  {forAdmin && <TableCell align="center">
                    <Button variant='contained' color={movement.validated ? 'error' : 'success'} onClick={() => {
                        openDialog({ message: movement.validated ? 'Anular' : 'Validar', data: movement, name: OperationName.MOVEMENT_VALIDATE });
                      }}>
                      <CheckCircleIcon />
                    </Button>
                  </TableCell>}
                  <TableCell align="center">
                    {((myPlayer?.role == "admin" && !movement.validated) || (!movement.validated && movement.type === 'in')) &&
                      <Button variant='contained' color='error' onClick={() => {
                        openDialog({ message: 'Eliminar', data: movement, name: OperationName.MOVEMENT_REMOVE });
                      }}>
                      <RemoveCircleOutlineIcon />
                    </Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={paginatedMovements?.totalCount || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
        {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <ErrorCard error={error} onClose={() => setError("")} />
        </div>
      )}
        <RechargeBalanceDialog
          isOpen={rechargeDialogOpen}
          players={players}
          onConfirm={onConfirmReloadBalance} onCancel={closeDialog}
        />
        <ConfirmationDialog
            isOpen={isDialogOpen}
            operation={selectedOperation}
            onConfirm={handleConfirmOperation}
            onCancel={closeDialog}
        />
      </div>
    </section>
  );
};

export default CashList;