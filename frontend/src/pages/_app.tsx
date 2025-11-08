import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from 'next/dynamic';

const ReduxProvider = dynamic(() => import('../components/ReduxProvider'), {
  ssr: false
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
      <Component {...pageProps} />
    </ReduxProvider>
  );
}