import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Club } from '../../models/club';
import { GroupedHour, Hour } from '../../models/grouped-hour';

interface NewCourtDialogProps {
    isOpen: boolean;
    club: Club;
    hours: GroupedHour,
    firstDayOfWeek: string;
    onConfirm: (day: string, time: string) => void;
    onCancel: () => void;
}

const NewCourtDialog: React.FC<NewCourtDialogProps> = ({ isOpen, hours, firstDayOfWeek, onConfirm, onCancel }) => {
    const [selectedDay, setSelectedDay] = useState<string>('Lunes');
    const [selectedTime, setSelectedTime] = useState<string>('');
    let daysOfWeek: string[] = [];
    let times: Hour[] = [];
    if (!hours || !hours.days) {
        return (
            <Dialog open={isOpen} onClose={onCancel}>
                <DialogTitle>Contacte con el admin</DialogTitle>
                <DialogContent>
                    <p>No hay horas disponibles</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel} color="secondary">
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
                
    for (let day of hours.days) {
        if (!daysOfWeek.includes(day.day_name)) {
            daysOfWeek.push(day.day_name);
        }
        for (let hour of day.hours) {
            const timeIncluded = times.find((time) => time.name === hour.name);
            if (!timeIncluded) {
                times.push(hour);
            }
        }
    }

    const handleConfirm = () => {
        const dayIndex = daysOfWeek.indexOf(selectedDay);
        const [dayNumber, month, year] = firstDayOfWeek.split('-').map(part => parseInt(part, 10));
        let monday = new Date(year, month - 1, dayNumber);
        let dayOfWeek = monday.getDay();
        monday.setDate(monday.getDate() - ((dayOfWeek + 6) % 7));
        let day = new Date(monday);
        day.setDate(day.getDate() + dayIndex);
        onConfirm(day.toLocaleDateString('es-ES'), selectedTime);
    };
    return (
        <Dialog open={isOpen} onClose={onCancel}>
            <DialogTitle>Seleccione el día y la hora</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel shrink>Día de la semana</InputLabel>
                    <Select
                        value={selectedDay}
                        label="Día de la semana"
                        onChange={(e) => setSelectedDay(e.target.value as string)}
                    >
                        {daysOfWeek.map((day) => (
                            <MenuItem key={day} value={day}>
                                {day}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <div className="mt-4">
                    <p className="text-black mb-2">Seleccione la hora</p>
                    <div className="flex flex-wrap space-x-4">
                        {times.map((time) => (
                            <Button
                            key={time.name}
                            variant={selectedTime === time.name ? 'contained' : 'outlined'}
                            color="primary"
                            onClick={() => setSelectedTime(time.name)}
                            style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                margin: '0 10px 10px 0',
                                width: 'calc(25% - 10px)',
                            }}
                        >
                                <span>{time.name}</span>
                                <div style={{ width: '100%', borderTop: '1px solid', margin: '5px 0' }}></div>
                            <span>{time.price} €</span>
                        </Button>
                        ))}
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleConfirm} color="primary" disabled={!selectedDay || !selectedTime}>
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewCourtDialog;