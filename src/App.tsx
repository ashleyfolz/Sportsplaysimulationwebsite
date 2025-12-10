import { useState } from 'react';
import { PlayCanvas } from './components/PlayCanvas';
import { Toolbar } from './components/Toolbar';
import { SportSelector } from './components/SportSelector';

export type Sport = 'football' | 'basketball' | 'soccer';

export interface Player {
  id: string;
  x: number;
  y: number;
  label: string;
  team: 'offense' | 'defense';
}

export interface Route {
  playerId: string;
  points: { x: number; y: number }[];
}

export default function App() {
  const [sport, setSport] = useState<Sport>('football');
  const [players, setPlayers] = useState<Player[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [drawMode, setDrawMode] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const addPlayer = (team: 'offense' | 'defense') => {
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      x: 400,
      y: team === 'offense' ? 500 : 200,
      label: team === 'offense' ? 'O' : 'D',
      team,
    };
    setPlayers([...players, newPlayer]);
  };

  const updatePlayerPosition = (id: string, x: number, y: number) => {
    setPlayers(players.map(p => p.id === id ? { ...p, x, y } : p));
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
    setRoutes(routes.filter(r => r.playerId !== id));
    if (selectedPlayerId === id) {
      setSelectedPlayerId(null);
    }
  };

  const clearAll = () => {
    setPlayers([]);
    setRoutes([]);
    setSelectedPlayerId(null);
    setDrawMode(false);
  };

  const addRoute = (route: Route) => {
    const existingRouteIndex = routes.findIndex(r => r.playerId === route.playerId);
    if (existingRouteIndex >= 0) {
      const newRoutes = [...routes];
      newRoutes[existingRouteIndex] = route;
      setRoutes(newRoutes);
    } else {
      setRoutes([...routes, route]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-white mb-2">Sports Play Simulator</h1>
          <p className="text-slate-300">Design and visualize your plays</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <SportSelector sport={sport} onSportChange={setSport} />
            <Toolbar
              onAddPlayer={addPlayer}
              onClearAll={clearAll}
              drawMode={drawMode}
              onToggleDrawMode={() => setDrawMode(!drawMode)}
              selectedPlayerId={selectedPlayerId}
            />
          </div>

          <div className="lg:col-span-3">
            <PlayCanvas
              sport={sport}
              players={players}
              routes={routes}
              drawMode={drawMode}
              selectedPlayerId={selectedPlayerId}
              onPlayerMove={updatePlayerPosition}
              onPlayerSelect={setSelectedPlayerId}
              onPlayerRemove={removePlayer}
              onRouteAdd={addRoute}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
