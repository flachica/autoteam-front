"use client"
import React, { use, useState } from "react";
import { Player } from "../../models/player";
import { IconButton, Box, Button, TextField, InputAdornment, Chip, Typography } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Clear, Close } from "@mui/icons-material";

interface SetMeInDialogProps {
    isOpen: boolean;
    courtId: number;
    players: Player[];
    onConfirm: (courtId: number, invitedPlayerIds: number[], invitedAnonPlayers: string[]) => void;
    onCancel: () => void;
}

const SetMeInDialog: React.FC<SetMeInDialogProps> = ({
    isOpen,
    courtId,
    players,
    onConfirm,
    onCancel,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [invitedPlayerIds, setInvitedPlayerIds] = useState<number[]>([]);
    const [invitedAnonPlayers, setInvitedAnonPlayers] = useState<string[]>([]);
    const [invitePlayers, setInvitePlayers] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    if (!isOpen) return null;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleAddPlayer = (playerId: number) => {
        if ((invitedAnonPlayers.length + invitedPlayerIds.length) > 2) {
            setError('No puedes invitar a más de 3 jugadores');
            return
        }
        setInvitedPlayerIds([...invitedPlayerIds, playerId]);
    };

    const handleAddAnonPlayer = (anonPlayer: string) => {
        if ((invitedAnonPlayers.length + invitedPlayerIds.length) > 2) {
            setError('No puedes invitar a más de 3 jugadores');
            return
        }
        if (invitedAnonPlayers.includes(anonPlayer)) {
            setError(`Ya has invitado a ${anonPlayer}`);
            return
        }
        setInvitedAnonPlayers([...invitedAnonPlayers, anonPlayer]);
        setSearchTerm('');
    };

    const handleConfirm = () => {
        setSearchTerm('');
        setInvitedPlayerIds([]);
        setInvitedAnonPlayers([]);
        setInvitePlayers(false);
        onConfirm(courtId, invitedPlayerIds, invitedAnonPlayers);
    };

    const filteredPlayers = players.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !invitedPlayerIds.includes(player.id)
    );

    const handleRemovePlayer = (id: number) => {
        setError(null);
        setInvitedPlayerIds(invitedPlayerIds.filter(playerId => playerId !== id));
    };
    
    const handleRemoveAnonPlayer = (index: number) => {
        setError(null);
        setInvitedAnonPlayers(invitedAnonPlayers.filter((_, i) => i !== index));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4 text-black">
                    Confirmar la inscripción
                </h2>
                {error && (
                    <Box
                        className="mb-4"
                        style={{
                            backgroundColor: '#fdecea',
                            border: '1px solid #f5c6cb',
                            color: '#721c24',
                            padding: '8px',
                            borderRadius: '4px',
                            position: 'relative'
                        }}
                    >
                        {error}
                        <IconButton
                            onClick={() => setError(null)}
                            style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                padding: '4px'
                            }}
                        >
                            <Close style={{ color: '#721c24' }} />
                        </IconButton>
                    </Box>
                )}
                <p className="text-black mb-4">
                    ¿Estás seguro de que deseas inscribirte?
                </p>
                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Button
                        onClick={() => setInvitePlayers(!invitePlayers)}
                        color="primary"
                        startIcon={<PersonAddIcon />}
                    >
                        Invitar
                    </Button>
                </Box>
                {invitePlayers && (
                <Box>
                    <TextField
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Buscar / añadir"
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
                        <Typography variant="caption" className="text-black mb-2">
                            Para jugadores no registrados rellene el nombre completo
                        </Typography>
                    {filteredPlayers.length > 0 ? (
                        <ul className="mb-4">
                            {filteredPlayers.map(player => (
                                <li key={player.id} className="flex justify-between items-center mb-2">
                                    <span className="text-black">{player.name} {player.surname}</span>
                                    <button
                                        onClick={() => handleAddPlayer(player.id)}
                                        className="bg-blue-500 text-white p-2 rounded"
                                    >
                                        Añadir
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="mb-4">
                            <p className="text-black mb-2">No se encontraron jugadores.</p>
                            <button
                                onClick={() => handleAddAnonPlayer(searchTerm)}
                                className="bg-orange-500 text-white p-2 rounded"
                            >
                                Añadir como anónimo
                            </button>
                        </div>
                            )}
                        </Box>
                    </Box>
                )}
        <div className="mb-4">
        {(invitedPlayerIds.length > 0 || invitedAnonPlayers.length > 0) && (
            <h3 className="text-lg font-bold mb-2 text-black">Invitados</h3>
        )}
            <Box display="flex" flexWrap="wrap" gap={1}>
                {invitedPlayerIds.map(id => {
                    const player = players.find(p => p.id === id);
                    return (
                        <Chip
                            key={id}
                            label={player?.name}
                            onDelete={() => handleRemovePlayer(id)}
                            color="primary"
                        />
                    );
                })}
                {invitedAnonPlayers.map((anon, index) => (
                    <Chip
                        key={index}
                        label={anon}
                        onDelete={() => handleRemoveAnonPlayer(index)}
                        color="secondary"
                    />
                ))}
            </Box>
        </div>
        <div className="mt-4 flex justify-end">
            <Button
                color="secondary"
                onClick={onCancel}
            >
                Cancelar
            </Button>
            <Button
                        color="primary"
                        variant="contained"
                onClick={handleConfirm}
            >
                Confirmar
            </Button>
        </div>
    </div>
</div>);
};

export default SetMeInDialog;
