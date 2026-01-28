import { Head } from '@inertiajs/react';
import Game from '../components/Game';

export default function GamePage() {
    return (
        <>
            <Head title="The Big Adventure" />
            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
                <Game />
            </div>
        </>
    );
}
