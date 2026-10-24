'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { reset } from '@/lib/api';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const [form, setForm] = useState({
        email: '',
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
            await reset(form);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Couldn't send password reset link. Check your email and try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className='min-h-screen grid md:grid-cols-3'>
            <div className='p-12 flex flex-col justify-between'>
                <Link href="/" className="font-display text-2xl">Freetracker</Link>
                <p className="text-sm">&copy; 2026 Freetracker</p>
            </div>

            <div className='flex items-center justify-center p-12'>
                <form onSubmit={handleSubmit} className='w-full max-w-sm'>
                    <h1 className='font-display text-3xl text-ink mb-8'>Forgot password</h1>

                    <label className='block text-sm text-ink/70 mb-1'>Email</label>
                    <input className='w-full border border-ink/20 rounded-sm px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-moss' value={form.email} onChange={(e) => update('email', e.target.value)} required/>

                    {error && <p className='text-clay text-sm mb-4'>{error}</p>}

                    <button type='submit' disabled={loading} className='w-full bg-moss text-paper py-2 rounded-sm hover:bg-ink transition-colors disabled:opacity-60'>
                        {loading ? 'Sending...' : 'Send password reset link'}
                    </button>


                    <p className='text-sm text-ink/60 mt-6'>No account yet?{' '}<Link href='/signup' className='text-moss hover:underline'>Sign up</Link></p>
                </form>
            </div>
        </main>
    );
}