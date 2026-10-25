'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { reset } from '@/lib/api';
import Link from 'next/link';

export default function ForgotConfirm() {
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
            router.push('/forgot-confirm');
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
                <h1 className='font-display text-xl text-ink mb-8'>If the email is correct, we've sent a reset link</h1>
            </div>
        </main>
    );
}