'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, clearTokens } from '@/lib/api';

export default function Navigation() {
    const router = useRouter();
    const [logged, setLogged] = useState('');
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const me = await getMe();
                setUser(me);
                setLogged('user');
            } catch {
                setLogged('guest') 
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [router]);

    function handleSignOut() {
        clearTokens();
        router.push('/');
    }

    return (
        <div>
            {logged === 'user' && (
                <nav className='flex items-center justify-between px-8 py-6 border-b border-ink/10'>
                    <Link href='/workspace' className='font-display text-2xl text-ink'>Freetracker</Link>
                    <div className='flex gap-6 items-center text-sm text-ink/70'>
                        <a href='#calendar' className='hover:text-moss'>Calendar</a>
                        <a href='#clients' className='hover:text-moss'>Clients</a>
                        <a href='#projects' className='hover:text-moss'>Projects</a>
                        <span>{user?.username}</span>
                        <button onClick={handleSignOut} className='hover:text-clay cursor-pointer'>Sign out</button>
                    </div>
                </nav>
            )}
            {logged === 'guest' && (
                <nav className='flex items-center justify-between px-8 py-6 border-b border-ink/10'>
                    <Link href='/' className='font-display text-2xl text-ink'>Freetracker</Link>
                    <div className='flex gap-6 items-center text-sm'>
                        <a href='#who' className='hover:text-moss'>Who we are</a>
                        <a href='#what' className='hover:text-moss'>What we do</a>
                        <a href='#contact' className='hover:text-moss'>Contact</a>
                        <Link href='/login' className='hover:text-moss'>Log in</Link>
                        <Link href='/signup' className='bg-moss text-paper px-4 py-2 rounded-sm hover:bg-ink transition-colors'>Sign up</Link>
                    </div>
                </nav>
            )}
        </div>
    );
}