"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import ProfileForm from '../../components/autoteam/profile-form';
import { usePlayer } from '../player.context';

const Register: React.FC = () => {
  const router = useRouter();
  const myPlayer = usePlayer();

  const handleSuccess = () => {
    router.push('/');
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4 bg-white">
        <ProfileForm mode="register" onSuccess={handleSuccess} token={myPlayer?.accessToken} />
      </div>
    </section>
  );
};

export default Register;