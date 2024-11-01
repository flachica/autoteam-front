import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Player } from '../../models/player';
import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { Clear } from '@mui/icons-material';

interface SetMeOutDialogProps {
    isOpen: boolean;
    players: Player[];
    onConfirm: (playerId: number, amount: number, movementName: string) => void;
    onCancel: () => void;
}

const RECHARGE_AMOUNT = 20;

const RechargeBalanceDialog: React.FC<SetMeOutDialogProps> = ({ isOpen, players, onConfirm, onCancel }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [playerId, setPlayerId] = useState<number | null>(null);
    const [movementAmount, setMovementAmount] = useState<number>(RECHARGE_AMOUNT);
    const [movementName, setMovementName] = useState<string>("Recarga de saldo");
    
    if (!isOpen) return null;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleConfirm = () => {
        setPlayerId(null);
        setMovementName("");
        onConfirm(playerId!, movementAmount, movementName);
    };

    const filteredPlayers = players.filter(player =>
        (player.name.toLowerCase() + ' ' + (player.surname)?.toLowerCase()).includes(searchTerm.toLowerCase())
    );

    const playerSelected = players.find(p => p.id === playerId);

    return (
        <Dialog open={isOpen} onClose={onCancel}>
            <DialogTitle>Creación de movimientos</DialogTitle>
            {!playerId && (<DialogContent>
                Seleccione el jugador:
                <Box>
                    <TextField
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Buscar jugador"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setSearchTerm('')}
                                        edge="end"
                                    >
                                        <Clear />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        />
                        <Box style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {filteredPlayers.length > 0 ? (
                                <ul className="mb-4">
                                    {filteredPlayers.map(player => (
                                        <li key={player.id} className="flex justify-between items-center mb-2">
                                            <span className="text-black">{player.name} {player.surname}</span>
                                            <button
                                                onClick={() => setPlayerId(player.id)}
                                                className="bg-blue-500 text-white p-2 rounded"
                                            >
                                                Seleccionar
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="mb-4">
                                    <p className="text-black mb-2">No se encontraron jugadores.</p>
                                </div>
                                    )}
                        </Box>
                </Box>                
            </DialogContent>)}
            {playerId && (<DialogContent>
                <Box>
                    <Box mb={4}>
                        <Typography variant="h6">Jugador seleccionado</Typography>
                        <Typography variant="body1">{playerSelected?.name} {playerSelected?.surname}</Typography>
                        <Typography variant="body1">Saldo actual: {playerSelected?.balance}</Typography>
                    </Box>
                    <Box>
                        <TextField
                        label="Importe del movimiento"
                        type="number"
                        value={movementAmount}
                        onChange={(e) => setMovementAmount(parseFloat(e.target.value))}
                        placeholder="Importe"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        inputProps={{ step: '0.01' }}
                        />
                    </Box>
                    <Box>
                        <TextField
                        label="Concepto"
                        value={movementName}
                        onChange={(e) => setMovementName(e.target.value)}
                        placeholder="Concepto"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        />
                    </Box>
                </Box>
            </DialogContent>
            )}
            <DialogActions>
                <Button onClick={onCancel} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleConfirm} color="primary">
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RechargeBalanceDialog;