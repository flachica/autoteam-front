"use client";

import { Inter } from "next/font/google";
import TopBar from '../components/generics/topbar';
import "./globals.css";

import React from 'react';
import { Provider } from './Provider';
import { PlayerProvider } from './player.context';
import { DebugProvider } from './debug.context';

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children, pathname }: { children: React.ReactNode, pathname: string }) => {
  return (
    <html lang="es">
      <body>
        <Provider>
          <PlayerProvider>
            <DebugProvider>
              <div className={`${inter.className} main-container`}>
                <TopBar />
                <div className="scrollable-content">
                  {children}
                </div>
              </div>
            </DebugProvider>
          </PlayerProvider>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;