import React from 'react';
import CourtItem from './court-item';
import { Court } from '../../models/court';
import { Player } from '../../models/player';
import { Operation } from '../generics/confirmationDialog';
import { Box, CircularProgress, Grid } from '@mui/material';


const CourtList: React.FC<{
  courts: Court[];
  myPlayer: Player | null;
  openDialog: (dialogData: Operation) => void;
  openSetMeInDialog: (dialogData: Operation) => void;
  openSetMeOutDialog: (dialogData: Operation) => void;
}> = ({ courts, myPlayer, openDialog, openSetMeInDialog, openSetMeOutDialog }) => {
  if (!myPlayer) {
    return (
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <CircularProgress />
      </div>
    );
  }
  return (
    <Box>
      <Grid container spacing={2}>
        {courts.map((court) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={court.id} sx={{ display: 'flex' }}>
            <CourtItem
              court={court}
              myPlayer={myPlayer}
              openDialog={openDialog}
              openSetMeInDialog={openSetMeInDialog}
              openSetMeOutDialog={openSetMeOutDialog}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CourtList;