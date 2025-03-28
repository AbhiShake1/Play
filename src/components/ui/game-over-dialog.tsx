import type { ComponentProps } from 'solid-js';
import { Button } from './button';
import { Dialog } from './dialog';

interface GameOverDialogProps extends ComponentProps<'div'> {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  score: number;
  title?: string;
  message?: string;
  downloadEnabled?: boolean;
  gameName?: string;
  scoreLabel?: string;
}

export function GameOverDialog(props: GameOverDialogProps) {
  const downloadSnapshot = () => {
    const gameName = props.gameName || 'Game';
    const snapshotData = `${gameName} Score: ${props.score}`;
    const blob = new Blob([snapshotData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gameName.toLowerCase()}-score-${props.score}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog
      title={props.title || 'Game Over!'}
      {...props}
    >
      <div class="space-y-6">
        <div class="text-center">
          <p class="text-2xl font-bold mb-2">{props.scoreLabel || 'Score'}: {props.score}</p>
          <p class="text-gray-400">{props.message || 'Better luck next time!'}</p>
        </div>
        
        <div class="flex justify-center gap-4">
          <Button onClick={props.onRestart}>Play Again</Button>
          {props.downloadEnabled && (
            <Button variant="outline" onClick={downloadSnapshot}>
              Download Score
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}