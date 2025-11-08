declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL?: string;
    DATABASE_URL?: string;
    API_KEY?: string;
  }
}