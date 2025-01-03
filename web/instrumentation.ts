import { Setup } from '@/setup/serverSetup';

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const os = await import('os');
        console.log('i am running server side. ' + os.hostname);
        Setup();
    }
}