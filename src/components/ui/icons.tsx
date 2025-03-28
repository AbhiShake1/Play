export const FullscreenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3">
      <animate attributeName="stroke-dasharray" from="0 100" to="100 100" dur="0.8s" fill="freeze" />
    </path>
  </svg>
);

export const ExitFullscreenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3">
      <animate attributeName="stroke-dasharray" from="0 100" to="100 100" dur="0.8s" fill="freeze" />
    </path>
  </svg>
);

export const ControlsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
    <path d="M12 2v20M2 12h20">
      <animate attributeName="stroke-dasharray" from="0 100" to="100 100" dur="0.8s" fill="freeze" />
    </path>
    <circle cx="12" cy="12" r="4">
      <animate attributeName="r" values="0;4" dur="0.8s" fill="freeze" />
    </circle>
  </svg>
);