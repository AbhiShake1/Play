import { Show, createSignal } from 'solid-js';
import { KEY_MAPPINGS } from '~/lib/controls';
import { Dialog } from './dialog';

interface ControlTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ControlTutorial(props: ControlTutorialProps) {
  const [activeScheme, setActiveScheme] = createSignal<'arrows' | 'vim' | 'touch'>('arrows');
  const [direction, setDirection] = createSignal<'up' | 'down' | 'left' | 'right' | null>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key as keyof typeof KEY_MAPPINGS;
    const scheme = activeScheme();
    const direction = KEY_MAPPINGS[key];
    
    if (!direction) return;
    
    if (scheme === 'arrows' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      e.preventDefault();
      setDirection(direction);
    } else if (scheme === 'vim' && ['h', 'j', 'k', 'l'].includes(key)) {
      e.preventDefault();
      setDirection(direction);
    }
  };

  const handleKeyUp = () => setDirection(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (activeScheme() !== 'touch') return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const element = e.currentTarget as HTMLDivElement;
    const rect = element.getBoundingClientRect();
    
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    if (x < rect.width / 3) setDirection('left');
    else if (x > (rect.width * 2) / 3) setDirection('right');
    else if (y < rect.height / 2) setDirection('up');
    else setDirection('down');
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    setDirection(null);
  };

  return (
    <Dialog isOpen={props.isOpen} onClose={props.onClose} title="Game Controls">
      <div class="space-y-6">
        <div class="flex justify-center gap-4">
          <button
            class={`px-4 py-2 rounded ${activeScheme() === 'arrows' ? 'bg-primary text-white' : 'bg-[#2c3038]'}`}
            onClick={() => setActiveScheme('arrows')}
          >
            ↑↓←→
          </button>
          <button
            class={`px-4 py-2 rounded ${activeScheme() === 'vim' ? 'bg-primary text-white' : 'bg-[#2c3038]'}`}
            onClick={() => setActiveScheme('vim')}
          >
            hjkl
          </button>
          <button
            class={`px-4 py-2 rounded ${activeScheme() === 'touch' ? 'bg-primary text-white' : 'bg-[#2c3038]'}`}
            onClick={() => setActiveScheme('touch')}
          >
            📱
          </button>
        </div>

        <div 
          class="relative w-48 h-48 mx-auto bg-[#2c3038] rounded-lg"
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          tabIndex={0}
        >
          <div 
            class={`absolute inset-0 flex items-center justify-center text-4xl transition-transform duration-200 ${
              direction() === 'up' ? '-translate-y-2' :
              direction() === 'down' ? 'translate-y-2' :
              direction() === 'left' ? '-translate-x-2' :
              direction() === 'right' ? 'translate-x-2' : ''
            }`}
          >
            🔥
          </div>

          <Show when={activeScheme() === 'touch'}>
            <div class="absolute inset-0 grid grid-cols-3 grid-rows-2 opacity-30">
              <div class="border-r border-b border-white/20" />
              <div class="border-r border-b border-white/20" />
              <div class="border-b border-white/20" />
              <div class="border-r border-white/20" />
              <div class="border-r border-white/20" />
              <div class="border-white/20" />
            </div>
          </Show>
        </div>

        <div class="text-center text-sm text-gray-400">
          {activeScheme() === 'arrows' && 'Use arrow keys to move'}
          {activeScheme() === 'vim' && 'Use h, j, k, l keys to move'}
          {activeScheme() === 'touch' && 'Touch different zones to move'}
        </div>
      </div>
    </Dialog>
  );
}