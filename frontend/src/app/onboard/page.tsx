'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, getMe } from '@/lib/api';
import Navigation from '@/components/navigation';

export default function Onboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    function update(field: string, value: string) {
        setForm((f) => ({ ...f, [field]: value}));
    }

    useEffect(() => {
        async function load() {
            try {
                const me = await getMe();
                setUser(me);
            } catch {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [router]);

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await apiFetch('/clients/onboard/', {
                method: 'POST',
                body: JSON.stringify(form)
            });
            router.push('/workspace');
        } catch (err) {
            setError(err instanceof Error ? err.message: "Couldn't create client. Try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className='min-h-screen'>
            <Navigation />

            <div className='max-w-6xl mx-auto px-8 py-10 flex justify-center'>
                <form onSubmit={handleSubmit} className='w-full max-w-sm'>
                    <h1 className='font-display text-3xl text-ink mb-8'>Onboard client</h1>

                    <label className='block text-sm text-ink/70 mb-1'>Name</label>
                    <input className='w-full border border border-ink/20 rounded-sm px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-moss' value={form.name} onChange={(e) => update('name', e.target.value)} required />

                    <label className='block text-sm text-ink/70 mb-1'>Email</label>
                    <input className='w-full border border border-ink/20 rounded-sm px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-moss' type='email' value={form.email} onChange={(e) => update('email', e.target.value)} pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$" required />

                    <label className='block text-sm text-ink/70 mb-1'>Phone</label>
                    <input className='w-full border border border-ink/20 rounded-sm px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-moss placeholder:text-body' type='phone' value={form.phone} onChange={(e) => update('phone', e.target.value)} maxLength={11} />

                    {error && <p className='text-clay text-sm mb-4'>{error}</p>}

                    <button type='submit' disabled={loading} className='w-full bg-moss text-paper py-2 rounded-sm hover:bg-ink transition-colors disabled:opacity-60'>
                        {loading ? 'Loading...' : 'Create client'}
                    </button>
                </form>
            </div>
        </main>
    );
}