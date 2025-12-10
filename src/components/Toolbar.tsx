import { UserPlus, Shield, Trash2, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface ToolbarProps {
  onAddPlayer: (team: 'offense' | 'defense') => void;
  onClearAll: () => void;
  drawMode: boolean;
  onToggleDrawMode: () => void;
  selectedPlayerId: string | null;
}

export function Toolbar({
  onAddPlayer,
  onClearAll,
  drawMode,
  onToggleDrawMode,
  selectedPlayerId,
}: ToolbarProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-slate-300">Add Players</p>
          <Button
            variant="outline"
            className="w-full justify-start bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30 text-blue-200"
            onClick={() => onAddPlayer('offense')}
          >
            <UserPlus className="w-4 h-4" />
            <span className="ml-2">Offense</span>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-red-500/20 border-red-500/50 hover:bg-red-500/30 text-red-200"
            onClick={() => onAddPlayer('defense')}
          >
            <Shield className="w-4 h-4" />
            <span className="ml-2">Defense</span>
          </Button>
        </div>

        <Separator className="bg-slate-700" />

        <div className="space-y-2">
          <p className="text-slate-300">Draw Routes</p>
          <Button
            variant={drawMode ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={onToggleDrawMode}
            disabled={!selectedPlayerId}
          >
            <Pencil className="w-4 h-4" />
            <span className="ml-2">
              {drawMode ? 'Drawing...' : 'Draw Route'}
            </span>
          </Button>
          <p className="text-slate-400 text-xs">
            {selectedPlayerId
              ? 'Select a player, then click to draw'
              : 'Select a player first'}
          </p>
        </div>

        <Separator className="bg-slate-700" />

        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={onClearAll}
        >
          <Trash2 className="w-4 h-4" />
          <span className="ml-2">Clear All</span>
        </Button>
      </CardContent>
    </Card>
  );
}
