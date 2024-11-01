"use client";

import { FormEvent, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePlayer } from '@/app/player.context';
import GoogleIcon from '@mui/icons-material/Google';
import { MailOutline } from "@mui/icons-material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Image from 'next/image';
import { CircularProgress, LinearProgress } from '@mui/material';
import { PlayerService } from "@/services/playerService";
import { AxiosError, isAxiosError } from "axios";

const Login = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const myPlayer = usePlayer();
  const playerService = new PlayerService();

  useEffect(() => {
    if (myPlayer) {
      router.push("/");
    }
  }, [myPlayer, router]);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsRefreshing(true);
    try {
      const formData = new FormData(event.currentTarget as HTMLFormElement);
      const res = await signIn('credentials', {
          email: formData.get("username"),
          phone: formData.get("username"),
          password: formData.get("password"),
          redirect: false,
        });
      if (res?.error) {
        setError("Usuario o contraseña incorrectos. Recuerda que debes esperar a que tu cuenta sea validada");
      };

      if (!res?.error) {
        await router.push("/home")
      };
    } catch (error) {
      setError("Error al iniciar sesión");
    }
    setIsRefreshing(false);
  };

  const handleRegisterRedirect = async () => {
    try {
      await router.push('/register');
    } catch (error) {
      setError("Error al redirigir a la página de registro");
    }
  };

  const handleGoogleSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsRefreshing(true);
    try {
      await signIn('google', { callbackUrl: '/home' });
    } catch (error) {
      setError("Error al iniciar sesión con Google");      
    }
    setIsRefreshing(false);
  };

  const handleEmailSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
      setIsRefreshing(true);
      try {
        if (!email) {
          setError("Debes introducir un correo electrónico");
          setMessage("");
          setIsRefreshing(false);
          return;
        } else {
          await playerService.sendMagicLink(email as string);
          setError("");
          setMessage("Revise su bandeja de entrada para iniciar sesión"); 
        }
      } catch (error: any) {
        if (isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response && axiosError.response.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
            if (typeof axiosError.response.data.message === 'string') {
              setError(axiosError.response.data.message as string);
            } else {
              const errorMessage = axiosError.response.data.message || '';
              if (typeof errorMessage === 'object' && 'message' in errorMessage) {
                setError((errorMessage.message as string[])[0]);
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
        setMessage("");
      }      
      setIsRefreshing(false);
      return;
    };

  return (
    <section className="w-full h-screen flex items-center justify-center bg-gray-100">
      {isRefreshing && <LinearProgress className="absolute top-0 left-0 w-full" />}
      <form
        className="text-gray-700 bg-white p-8 rounded-lg shadow-lg w-full max-w-md border rounded"
        onSubmit={handleSignIn}
      >
        {isRefreshing && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <CircularProgress />
          </div>
        )}
        {
          error && 
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center justify-between" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>        
        }

        {
          message && 
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center justify-between" role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
        }
        <div className="flex justify-center mt-6">
          <Image
            src="/logo.webp"
            alt="Logo"
            width={100}
            height={100}
          />
        </div>
        <input
          placeholder='Teléfono o correo'
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="username"
        />

        <div className="relative mt-4 w-full">
            <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                name="password"
            />
            <button
            className="absolute right-0 top-0 mt-2 mr-2 flex items-center justify-center"
            type="button"
                onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
                }}
            >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
        </div>
        <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="submit"
        >
          Entrar
        </button>

        <div className="w-full h-10 relative flex items-center justify-center">
          <div className="absolute h-px w-full top-2/4 bg-[#242424]"></div>
          <p className="w-8 h-6 z-10 flex items-center justify-center bg-white px-2">o</p>
        </div>
        <div className="flex justify-center mt-4">
            <button
                className="flex py-2 px-4 mr-4 text-sm align-middle items-center rounded text-999 
                border border-solid transition duration-150 ease hover:bg-blue-600 hover:text-white gap-3"
                onClick={handleGoogleSignIn}
              >
              <GoogleIcon className="text-2xl" /> Entra con Google
            </button>
        </div>
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleRegisterRedirect}
            className="text-sm text-[#888] transition duration-150 ease hover:text-gray-800"
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </div>
      </form>
    </section>
  );
}

export default Login;