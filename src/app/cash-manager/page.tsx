"use client";

import React, { useEffect, useState } from 'react';
import { usePlayer } from '../player.context';
import { Player } from '../../models/player';
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import CashList from '../../components/autoteam/cash-list';

const CashManager = () => {
  const [initialData, setInitialData] = useState<Player | null>(null);
  const myPlayer = usePlayer();
  const router = useRouter();
  
  useEffect(() => {
    if (myPlayer) {
      setInitialData(myPlayer);
    }
  }, [myPlayer]);

  if (!initialData) {
    return <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
    <CircularProgress />
  </div>;
  }

  return <CashList forAdmin={true} player={myPlayer} onSuccess={function (): void {
    router.replace('/home');
  } } />;
};

export default CashManager;