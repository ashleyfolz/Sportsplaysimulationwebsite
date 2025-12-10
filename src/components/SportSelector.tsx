import { Activity, Trophy, Target } from 'lucide-react';
import { Sport } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface SportSelectorProps {
  sport: Sport;
  onSportChange: (sport: Sport) => void;
}

export function SportSelector({ sport, onSportChange }: SportSelectorProps) {
  const sports: { value: Sport; label: string; icon: React.ReactNode }[] = [
    { value: 'football', label: 'Football', icon: <Trophy className="w-4 h-4" /> },
    { value: 'basketball', label: 'Basketball', icon: <Activity className="w-4 h-4" /> },
    { value: 'soccer', label: 'Soccer', icon: <Target className="w-4 h-4" /> },
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Select Sport</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sports.map(s => (
          <Button
            key={s.value}
            variant={sport === s.value ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => onSportChange(s.value)}
          >
            {s.icon}
            <span className="ml-2">{s.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}