/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Add additional VITE_* env types here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
