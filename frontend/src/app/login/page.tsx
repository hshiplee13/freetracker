'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const [form, setForm] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function update(field: string, value: string) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form);
            router.push('/workspace');
        } catch (err) {
            setError(err instanceof Error ? err.message : "Couldn't log in. Check your details and try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className='min-h-screen grid md:grid-cols-2'>
            <div className='bg-ink text-paper p-12 flex flex-col justify-between'>
                <Link href="/" className="font-display text-2xl">Freetracker</Link>
                <div>
                    <p className="font-display text-3xl leading-snug">Pick up right where your last call left off.</p>
                    <p className="mt-4 text-paper/60 max-w-sm">Your clients, projects, and scope of truth are all waiting.</p>
                </div>
                <p className="text-sm text-paper/40">&copy; 2026 Freetracker</p>
            </div>

            <div className='flex items-center justify-center p-12'>
                <form onSubmit={handleSubmit} className='w-full max-w-sm'>
                    <h1 className='font-display text-3xl text-ink mb-8'>Log in</h1>

                    <label className='block text-sm text-ink/70 mb-1'>Username</label>
                    <input className='w-full border border-ink/20 rounded-sm px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-moss' value={form.username} onChange={(e) => update('username', e.target.value)} required/>

                    <label className='block text-sm text-ink/70 mb-1'>Password</label>
                    <input className='w-full border border-ink/20 rounded-sm px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-moss' type='password' value={form.password} onChange={(e) => update('password', e.target.value)} required/>

                    {error && <p className='text-clay text-sm mb-4'>{error}</p>}

                    <button type='submit' disabled={loading} className='w-full bg-moss text-paper py-2 rounded-sm hover:bg-ink transition-colors disabled:opacity-60'>
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>


                    {error ? <p className='text-sm text-ink/60 mt-6'>Forgotten your password? <Link href='/forgot' className='text-moss hover:underline'>Change password</Link></p> : <p className='text-sm text-ink/60 mt-6'>No account yet?{' '}<Link href='/signup' className='text-moss hover:underline'>Sign up</Link></p>}
                </form>
            </div>
        </main>
    );
}