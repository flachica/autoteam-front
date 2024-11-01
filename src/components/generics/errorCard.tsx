import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

interface ErrorCardProps {
  error: string;
  onClose: () => void; // Añadir la función de cierre como prop
}

const ErrorCard: React.FC<ErrorCardProps> = ({ error, onClose }) => {
  return (
      <Card className="max-w-md p-5 text-center">
        <CardContent>
          <ErrorIcon color="error" style={{ fontSize: 50 }} />
          <Typography variant="h5" component="h2" className="mt-2">
            Ocurrió un error
          </Typography>
          <Typography color="textSecondary" className="mt-2">
            {error}
          </Typography>
          <Button variant="contained" color="primary" className="mt-5" onClick={onClose} >
            Volver
          </Button>
        </CardContent>
      </Card>
  );
};

export default ErrorCard;