"use client";

import React, { useEffect, useState } from 'react';
import { usePlayer } from '../player.context';
import ProfileForm from '../../components/autoteam/profile-form';
import { Player } from '../../models/player';
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';

const Profile = () => {
  const [initialData, setInitialData] = useState<Player | null>(null);
  const myPlayer = usePlayer();
  const router = useRouter();
  
  useEffect(() => {
    if (myPlayer) {
      setInitialData(myPlayer);
    }
  }, [myPlayer]);

  if (!initialData || !myPlayer) {
    return <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
    <CircularProgress />
  </div>;
  }

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4 bg-white">
        <ProfileForm
          mode="edit"
          token={myPlayer.accessToken}
          formRole={myPlayer.role}
          player={myPlayer}
          onSuccess={() => {
            router.replace('/home');
          }}
        />
      </div>
    </section>
  );
};

export default Profile;