import { Card, CardContent, Link, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const ValidationPendingPage = () => {
  return (
    <section className="w-full h-screen flex items-center justify-center bg-gray-100">
      <Card style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Validación Pendiente
          </Typography>
          <div className="flex justify-center mt-6 mb-6">
            <Image
              src="/validation_message.webp"
              alt="Logo"
              width={100}
              height={100}
            />
          </div>
          <Typography variant="body1">
            Tu cuenta está en proceso de validación. Pasados unos días puedes contactar con los{' '}
            <Link href="/about" style={{ color: 'blue', textDecoration: 'underline' }}>
              administradores
            </Link>.
          </Typography>
        </CardContent>
      </Card>
    </section>
  );
};

export default ValidationPendingPage;