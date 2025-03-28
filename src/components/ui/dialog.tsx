import { type JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
  title?: string;
}

export function Dialog(props: DialogProps) {
  return (
    <Show when={props.isOpen}>
      <Portal>
        <div class="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with enhanced blur and subtle animation */}
          <div 
            class="fixed inset-0 bg-black/60 backdrop-blur-lg transition-all duration-300"
            onKeyDown={props.onClose}
          />
          
          {/* Dialog content with improved aesthetics */}
          <div class="relative bg-[#1a1d21]/95 backdrop-blur-sm rounded-lg shadow-2xl shadow-orange-900/10 w-full max-w-md p-6 z-10 border border-orange-500/10 transition-transform duration-300 scale-100 hover:scale-[1.02]">
            <button
              onClick={props.onClose}
              class="absolute right-4 top-4 text-gray-400 hover:text-orange-400 transition-colors duration-200"
            >
              ✕
            </button>
            
            {props.title && (
              <h2 class="text-xl font-semibold mb-4 text-orange-50">{props.title}</h2>
            )}
            
            <div class="mt-2 text-gray-200">
              {props.children}
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
}