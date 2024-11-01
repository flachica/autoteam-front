import React from 'react';
import { CourtPlayer } from '../../models/courtPlayer';
import { Player } from '@/models/player';

interface PlayerListProps {
  myPlayer?: Player | null;
  players: CourtPlayer[];
  invitedPlayers: CourtPlayer[];
  anonPlayers: any[];
  isDebugging: boolean;
}

const PlayerList: React.FC<PlayerListProps> = ({ myPlayer, players, invitedPlayers, anonPlayers, isDebugging }) => {
  return (
  <ol className="list-decimal list-inside">
    {players.map((player, index) => (
      <li key={index} className={myPlayer?.id == player.id ? 'my-player' : ''}>
        { isDebugging && `${player.id} -`}
        {player.name || 'Invitado'} {player.surname}
      </li>
    ))}
    {invitedPlayers.map((player, index) => (
      <li className={myPlayer?.id == player.payerPlayerId ? 'invited' : ''} key={`invited_${index}`}>
        { isDebugging && `${player.id} -`}
        {player.name || 'Invitado'} {player.surname}
      </li>
    ))}
    {anonPlayers.map((anonPlayer, index) => (
      <li className={myPlayer?.id == anonPlayer.payerPlayerId ? 'anonInvited' : ''} key={`anon_${index}`}>
        { isDebugging && `${anonPlayer.id} -`}
        {anonPlayer.nameAnonPlayer}
      </li>
    ))}
  </ol>
  );
};

export default PlayerList;