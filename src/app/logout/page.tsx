'use client';

import LoadingSpinner from '@/components/generics/loadingSpinner';

import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

const Logout = () => {
    useEffect(() => {
        const performSignOut = async () => {
            await signOut({ callbackUrl: '/login' });
        };
    
        performSignOut();
      }, []);
      
    return <LoadingSpinner message='Saliendo' />;
};

export default Logout;