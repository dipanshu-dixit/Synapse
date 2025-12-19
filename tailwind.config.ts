import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      zIndex: {
        '0': '0', // Background
        '1': '1', // Canvas
        '2': '2', // HUD
        '3': '100', // Overlay
        '4': '101', // Modal content
      },
    },
  },
  plugins: [],
};

export default config;