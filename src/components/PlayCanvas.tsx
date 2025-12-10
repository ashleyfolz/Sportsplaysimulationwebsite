import { useRef, useEffect, useState } from 'react';
import { Player, Route, Sport } from '../App';
import { Card } from './ui/card';
import { X } from 'lucide-react';

interface PlayCanvasProps {
  sport: Sport;
  players: Player[];
  routes: Route[];
  drawMode: boolean;
  selectedPlayerId: string | null;
  onPlayerMove: (id: string, x: number, y: number) => void;
  onPlayerSelect: (id: string | null) => void;
  onPlayerRemove: (id: string) => void;
  onRouteAdd: (route: Route) => void;
}

export function PlayCanvas({
  sport,
  players,
  routes,
  drawMode,
  selectedPlayerId,
  onPlayerMove,
  onPlayerSelect,
  onPlayerRemove,
  onRouteAdd,
}: PlayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggingPlayer, setDraggingPlayer] = useState<string | null>(null);
  const [currentRoute, setCurrentRoute] = useState<{ x: number; y: number }[]>([]);
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 900;
  const PLAYER_RADIUS = 20;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw field based on sport
    drawField(ctx, sport);

    // Draw routes
    routes.forEach(route => {
      const player = players.find(p => p.id === route.playerId);
      if (!player || route.points.length < 2) return;

      ctx.strokeStyle = player.team === 'offense' ? '#3b82f6' : '#ef4444';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(player.x, player.y);
      route.points.forEach((point, idx) => {
        if (idx === 0) {
          ctx.lineTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw arrow at end
      if (route.points.length > 0) {
        const lastPoint = route.points[route.points.length - 1];
        const secondLast = route.points.length > 1 
          ? route.points[route.points.length - 2] 
          : { x: player.x, y: player.y };
        drawArrow(ctx, secondLast.x, secondLast.y, lastPoint.x, lastPoint.y, player.team === 'offense' ? '#3b82f6' : '#ef4444');
      }
    });

    // Draw current route being drawn
    if (drawMode && selectedPlayerId && currentRoute.length > 0) {
      const player = players.find(p => p.id === selectedPlayerId);
      if (player) {
        ctx.strokeStyle = player.team === 'offense' ? '#60a5fa' : '#f87171';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        currentRoute.forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw players
    players.forEach(player => {
      const isSelected = player.id === selectedPlayerId;
      const isHovered = player.id === hoveredPlayer;
      
      ctx.fillStyle = player.team === 'offense' ? '#3b82f6' : '#ef4444';
      ctx.strokeStyle = isSelected ? '#fbbf24' : '#ffffff';
      ctx.lineWidth = isSelected ? 4 : 2;

      ctx.beginPath();
      ctx.arc(player.x, player.y, PLAYER_RADIUS + (isHovered ? 3 : 0), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(player.label, player.x, player.y);
    });
  }, [sport, players, routes, selectedPlayerId, currentRoute, drawMode, hoveredPlayer]);

  const drawField = (ctx: CanvasRenderingContext2D, sport: Sport) => {
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

    if (sport === 'football') {
      const sectionHeight = CANVAS_HEIGHT / 12; // 12 sections: 2 end zones + 10 yard lines
      const endZoneHeight = sectionHeight;
      
      // Draw end zones
      ctx.fillStyle = '#0c7a3a'; // Darker green for end zones
      ctx.fillRect(50, 0, CANVAS_WIDTH - 100, endZoneHeight);
      ctx.fillRect(50, CANVAS_HEIGHT - endZoneHeight, CANVAS_WIDTH - 100, endZoneHeight);
      
      // End zone text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('END ZONE', CANVAS_WIDTH / 2, endZoneHeight / 2);
      ctx.fillText('END ZONE', CANVAS_WIDTH / 2, CANVAS_HEIGHT - endZoneHeight / 2);
      
      // Draw yard lines (goal line through opposite goal line)
      const yardNumbers = [0, 10, 20, 30, 40, 50, 40, 30, 20, 10, 0];
      
      for (let i = 0; i <= 10; i++) {
        const y = endZoneHeight + (sectionHeight * i);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(CANVAS_WIDTH - 50, y);
        ctx.stroke();
        
        // Add yard markers (numbers) - skip the goal lines (0 yard lines)
        if (i > 0 && i < 10) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Left side number
          ctx.fillText(yardNumbers[i].toString(), 80, y);
          // Right side number
          ctx.fillText(yardNumbers[i].toString(), CANVAS_WIDTH - 80, y);
        }
      }
      
      // Sidelines
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(50, 0, CANVAS_WIDTH - 100, CANVAS_HEIGHT);
    } else if (sport === 'basketball') {
      ctx.fillStyle = '#d97706';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      
      // Court outline
      ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Half court line
      ctx.beginPath();
      ctx.moveTo(0, CANVAS_HEIGHT / 2);
      ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
      ctx.stroke();
      
      // Center circle
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 50, 0, Math.PI * 2);
      ctx.stroke();
      
      // Paint/Key areas (the lane)
      const paintWidth = 120;
      const paintHeight = 150;
      
      // Top paint
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(CANVAS_WIDTH / 2 - paintWidth / 2, 0, paintWidth, paintHeight);
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(CANVAS_WIDTH / 2 - paintWidth / 2, 0, paintWidth, paintHeight);
      
      // Bottom paint
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(CANVAS_WIDTH / 2 - paintWidth / 2, CANVAS_HEIGHT - paintHeight, paintWidth, paintHeight);
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(CANVAS_WIDTH / 2 - paintWidth / 2, CANVAS_HEIGHT - paintHeight, paintWidth, paintHeight);
      
      // Free throw line (top)
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH / 2 - paintWidth / 2, paintHeight);
      ctx.lineTo(CANVAS_WIDTH / 2 + paintWidth / 2, paintHeight);
      ctx.stroke();
      
      // Free throw line (bottom)
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH / 2 - paintWidth / 2, CANVAS_HEIGHT - paintHeight);
      ctx.lineTo(CANVAS_WIDTH / 2 + paintWidth / 2, CANVAS_HEIGHT - paintHeight);
      ctx.stroke();
      
      // Free throw circles
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH / 2, paintHeight, 50, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT - paintHeight, 50, 0, Math.PI * 2);
      ctx.stroke();
      
      // Three-point line (top)
      const threePointRadius = 200;
      const basketY = 20; // Distance from baseline to basket
      
      // Top three-point arc - extends from baseline to baseline
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH / 2, basketY, threePointRadius, 0, Math.PI);
      ctx.stroke();
      
      // Bottom three-point arc - extends from baseline to baseline
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT - basketY, threePointRadius, Math.PI, 2 * Math.PI);
      ctx.stroke();
    } else if (sport === 'soccer') {
      // Field outline
      ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Center line
      ctx.beginPath();
      ctx.moveTo(0, CANVAS_HEIGHT / 2);
      ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
      ctx.stroke();
      
      // Center circle
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 70, 0, Math.PI * 2);
      ctx.stroke();
      
      // Penalty boxes
      ctx.strokeRect(CANVAS_WIDTH / 2 - 100, 0, 200, 100);
      ctx.strokeRect(CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT - 100, 200, 100);
      
      // Goal boxes
      ctx.strokeRect(CANVAS_WIDTH / 2 - 50, 0, 100, 40);
      ctx.strokeRect(CANVAS_WIDTH / 2 - 50, CANVAS_HEIGHT - 40, 100, 40);
    }
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) => {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowLength = 15;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - arrowLength * Math.cos(angle - Math.PI / 6),
      y2 - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      x2 - arrowLength * Math.cos(angle + Math.PI / 6),
      y2 - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a player
    const clickedPlayer = players.find(p => {
      const distance = Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2);
      return distance <= PLAYER_RADIUS;
    });

    if (clickedPlayer) {
      // If in draw mode and clicking a different player, finish current route and switch to new player
      if (drawMode && clickedPlayer.id !== selectedPlayerId) {
        if (selectedPlayerId && currentRoute.length > 0) {
          onRouteAdd({
            playerId: selectedPlayerId,
            points: currentRoute,
          });
        }
        setCurrentRoute([]);
        onPlayerSelect(clickedPlayer.id);
      } else if (!drawMode) {
        // Normal selection toggle when not in draw mode
        onPlayerSelect(clickedPlayer.id === selectedPlayerId ? null : clickedPlayer.id);
      }
    } else if (drawMode && selectedPlayerId) {
      // Add point to route when clicking on empty space
      setCurrentRoute([...currentRoute, { x, y }]);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedPlayer = players.find(p => {
      const distance = Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2);
      return distance <= PLAYER_RADIUS;
    });

    if (clickedPlayer) {
      setDraggingPlayer(clickedPlayer.id);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update hovered player
    const hoveredPlayer = players.find(p => {
      const distance = Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2);
      return distance <= PLAYER_RADIUS;
    });
    setHoveredPlayer(hoveredPlayer?.id || null);

    if (draggingPlayer) {
      onPlayerMove(draggingPlayer, x, y);
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggingPlayer(null);
  };

  const handleFinishRoute = () => {
    if (selectedPlayerId && currentRoute.length > 0) {
      onRouteAdd({
        playerId: selectedPlayerId,
        points: currentRoute,
      });
      setCurrentRoute([]);
      onPlayerSelect(null); // Deselect player after finishing route
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-white">Play Field</h3>
            <p className="text-slate-400 text-xs">
              {drawMode 
                ? 'Click on the field to draw route points' 
                : 'Drag players to position them, click to select'}
            </p>
          </div>
          {drawMode && currentRoute.length > 0 && (
            <button
              onClick={handleFinishRoute}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Finish Route
            </button>
          )}
        </div>

        <div className="relative inline-block">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-2 border-slate-600 rounded-lg cursor-pointer"
            onClick={handleCanvasClick}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          />
        </div>

        {players.length > 0 && (
          <div className="space-y-2">
            <p className="text-slate-300">Players</p>
            <div className="flex flex-wrap gap-2">
              {players.map(player => (
                <div
                  key={player.id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                    player.id === selectedPlayerId
                      ? 'bg-amber-500/20 border-amber-500'
                      : 'bg-slate-700/50 border-slate-600'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      player.team === 'offense' ? 'bg-blue-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-slate-200 text-xs">
                    {player.team === 'offense' ? 'Offense' : 'Defense'} {player.label}
                  </span>
                  <button
                    onClick={() => onPlayerRemove(player.id)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
