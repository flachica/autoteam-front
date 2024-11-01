import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Player } from '../models/player';

interface PlayerContextType {
  myPlayer: Player | null;
}
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      const player: Player = {
        ...session.user,
        token: session.user.accessToken,
      };
      setMyPlayer(session.user);
    } else {
      setMyPlayer(null);
    }
  }, [session, status]);

  return (
    <PlayerContext.Provider value={{ myPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): Player | null => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context.myPlayer;
};