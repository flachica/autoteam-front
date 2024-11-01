import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import { Player } from '../../models/player';
import { Autocomplete, TextField } from '@mui/material';
import { Court } from '../../models/court';

interface SetMeOutDialogProps {
    isOpen: boolean;
    players: Player[],
    court: Court | undefined,
    onConfirm: (toPlayerId: number | undefined) => void;
    onCancel: () => void;
}

const SetMeOutDialog: React.FC<SetMeOutDialogProps> = ({ isOpen, players, court, onConfirm, onCancel }) => {
    const [toPlayerId, setSustitute] = useState<number | undefined>();
    const [filter, setFilter] = useState<string>('');
    const handleConfirm = () => {
        onConfirm(toPlayerId);
    };
    const filteredPlayers = players
        .filter(player => (court && !court.players.some(courtPlayer => courtPlayer.id === player.id)) || !court)
        .filter(player => `${player.name} ${player.surname}`.toLowerCase().includes(filter.toLowerCase()));

    return (
        <Dialog open={isOpen} onClose={onCancel}>
            <DialogTitle>Seleccione el sustituto</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <Autocomplete
                        options={filteredPlayers}
                        getOptionLabel={(player) => `${player.name} ${player.surname}`}
                        onChange={(event, newValue) => {
                            setSustitute(newValue ? newValue.id : undefined);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Filtrar jugadores"
                                margin="normal"
                                onChange={(e) => setFilter(e.target.value)}
                            />
                        )}
                    />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleConfirm} color="primary" disabled={!toPlayerId}>
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SetMeOutDialog;