import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import { Inter as FontSans } from 'next/font/google';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { api } from '@/utils/api';
import '@/styles/globals.css';
import 'animate.css';
import { Toaster } from '@/components/Toaster';
import { useToast } from '@/components/Toaster/hooks/useToast';
import { useKeyPress } from '@/hooks/useKeyPress';
import { getSelectionText } from '@/utils/common';

export const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
});

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
    const { toast } = useToast();

    useKeyPress(['ctrl', 'c'], () => {
        const selectionText = getSelectionText();
        toast({
            title: 'Текст скопійований',
            description: `${selectionText.length > 50 ? 'Текст' : `"${selectionText.trim()}"`} в буфері обміну`,
        });
    });
    useKeyPress(['ctrl', 'v'], () => {
        navigator.clipboard
            .readText()
            .then((text) => {
                toast({
                    title: 'Текст вставлений',
                    description: `${text.length > 50 ? 'Текст' : `"${text.trim()}"`} вставлений з буферу обміну`,
                });
            })
            .catch((err) => {
                console.error('Failed to read clipboard contents: ', err);
            });
    });

    return (
        <SessionProvider session={session}>
            <style jsx global>{`
                html {
                    font-family: ${fontSans.style.fontFamily};
                }
            `}</style>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <Component {...pageProps} />
                <Toaster />
            </ThemeProvider>
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
