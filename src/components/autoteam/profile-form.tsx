"use client";

import React, { useState } from 'react';
import { PlayerService } from '../../services/playerService';
import { AxiosError, isAxiosError } from 'axios';
import { Player } from '../../models/player';
import { debug } from 'console';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { title } from 'process';

interface ProfileFormProps {
  mode: 'register' | 'edit';
  player?: Player | null;
  token?: string;
  formRole?: string;
  onSuccess: () => void; // Nueva prop para manejar el éxito
}

const ProfileForm: React.FC<ProfileFormProps> = ({ mode, onSuccess, player, token, formRole }) => {
  const [formData, setFormData] = useState({
    name: player?.name || '',
    surname: player?.surname || '',
    email: player?.email || '',
    phone: player?.phone || '',
    password: '',
    confirmPassword: '',
    role: player?.role || 'player',
  });
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRefreshing(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsRefreshing(false);
      return;
    }

    const playerService = new PlayerService();
    try {
      let result;
      if (mode === 'register') {
        result = await playerService.registerPlayer(formData);
      } else {
        result = await playerService.updatePlayer(formData, token!, player!.id);
      }

      if (result) {
        onSuccess();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
          if (typeof axiosError.response.data.message === 'string') {
            setError(axiosError.response.data.message as string);
          } else {
            const errorMessage = axiosError.response.data.message || '';
            if (typeof errorMessage === 'object' && 'message' in errorMessage && typeof errorMessage.message === 'string') {
              setError(errorMessage.message);
            } else if (typeof errorMessage === 'object' && 'message' in errorMessage && Array.isArray(errorMessage.message)) {
              setError(errorMessage.message.join(', '));
            } else {
              setError("Ocurrió un error inesperado");
            }
          }
        } else if (axiosError.response) {
          setError(`${JSON.stringify(axiosError.response.data) || axiosError.message}`);
        } else {
          setError(axiosError.message as unknown as string);
        }
      } else {
        setError("Ocurrió un error inesperado");
      }
      setIsRefreshing(false);
    }
  };
  return (
      <div className="w-full p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Jugador</h2>
        <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center justify-between">
            {Array.isArray(error) ? (
              error.length > 1 ? (
                <ul className="list-disc pl-5">
                  {error.map((errMsg, index) => (
                    <li key={index}>{errMsg}</li>
                  ))}
                </ul>
              ) : (
                <p>{error[0]}</p>
              )
            ) : (
              <p>{error}</p>
            )}
          </div>
        )}
          <label className="block text-sm font-medium mb-2 mt-2 text-gray-700" htmlFor="name">Nombre</label>
          <input
              type="text"
            name="name"
            className="w-full px-3 py-2 border rounded"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre"
          />
          
          <label className="block text-sm font-medium mb-2 mt-2 text-gray-700" htmlFor="surname">Apellido</label>
          <input
            className="w-full px-3 py-2 border rounded"
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Apellido"
          />
          <label className="block text-sm font-medium mb-2 mt-2 text-gray-700" htmlFor="email">EMail</label>
          <input
            className="w-full px-3 py-2 border rounded"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo Electrónico"
            />
           <label className="block text-sm font-medium mb-2 mt-2 text-gray-700" htmlFor="phone">
             Teléfono
           </label>
           <input
             type="text"
             id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder='Teléfono'
             className="w-full px-3 py-2 border rounded"
          />
          <label className="block text-sm font-medium mb-2 mt-2 text-gray-700" htmlFor="password">Contraseña</label>
          <input
            className="w-full px-3 py-2 border rounded"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
          />
          <label className="block text-sm font-medium mb-2 mt-2 text-gray-700" htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            className="w-full px-3 py-2 border rounded"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar Contraseña"
            />
          {
            formRole === 'admin' && (
              <>
                <label className="block text-sm font-medium mb-2 mt-2 text-gray-700" htmlFor="role">Rol</label>
                <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Rol" className="w-full px-3 py-2 border rounded" />
              </>

            )
          }
          <div className='mt-5 flex justify-between'>
            <button type="button" onClick={onSuccess} disabled={isRefreshing} className='w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500' >
              Cancelar
            </button>
            <button type="submit" disabled={isRefreshing} className='w-full ml-2 mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500' >
              {mode === 'register' ? 'Registrarse' : 'Actualizar Perfil'}
            </button>
          </div>
        </form>
      </div>
    
  );
};

export default ProfileForm;