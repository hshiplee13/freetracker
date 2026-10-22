'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import Navigation from '@/components/navigation';

type Client = { id: string, name: string, email: string };
type Project = { id: string, title: string, status: string, client: string };

export default function Workspace() {
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [clientData, projectData] = await Promise.all([
                    apiFetch('/clients/'),
                    apiFetch('/projects/'),
                ]);
                setClients(clientData.results ?? clientData);
                setProjects(projectData.results ?? projectData);
            } catch {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [router]);

    async function handleDelete(type: string, id: string) {
        try {
            await apiFetch('/' + type + '/' + id + '/delete/', {
                method: 'DELETE',
            })

            setClients((prev) => prev.filter((c) => c.id !== id));
            setProjects((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error('Failed to delete: ', err);
        }
    };

    return (
        <main className='min-h-screen'>
            <Navigation />

            <div className='max-w-6xl mx-auto px-8 py-10'>
                <h1 className='font-display text-3xl text-ink mb-8'>Dashboard</h1>

                {loading ? (
                    <p className='text-ink/50'>Loading your workspace...</p>
                ) : (
                    <div className='grid md:grid-cols-2 gap-10'>
                        <section id='clients'>
                            <div className='flex items-center justify-between mb-4'>
                                <h2 className='font-display text-xl text-ink'>Clients</h2>
                                <Link href='/onboard' className='text-sm text-moss hover:underline'>+ Add client</Link>
                            </div>
                            {clients.length === 0 ? (
                                <p className='text-ink/50 text-sm'>No clients yet. Add your first client to start tracking.</p>   
                            ) : (
                                <ul className='space-y-3'>
                                    {clients.map((c) => (
                                        <li key={c.id} className='border border-ink/10 rounded-sm p-4 flex justify-between'>
                                            <p className='font-medium text-ink'>{c.name}</p>
                                            <p className='text-sm text-ink/50'>{c.email}</p>
                                            <button onClick={() => handleDelete('clients', c.id)} className='text-sm text-red-600 font-bold hover:underline cursor-pointer'>Delete client</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        <section id='projects'>
                            <div className='flex items-center justify-between mb-4'>
                                <h2 className='font-display text-xl text-ink'>Projects</h2>
                                <Link href='/create' className='text-sm text-moss hover:underline'>+ Add project</Link>
                            </div>
                            {projects.length === 0 ? (
                                <p className='text-ink/50 text-sm'>No projects yet. Create one once you have added a client.</p>
                            ) : (
                                <ul className='space-y-3'>
                                    {projects.map((p) => (
                                        <li key={p.id} className='border border-ink/10 rounded-sm p-4 flex justify-between'>
                                            <Link href={`/project/${p.id}`} className='font-medium text-ink'>{p.title}</Link>
                                            <span className='text-sm text-ink/50 capitalize'>{p.status}</span>
                                            <button onClick={() => handleDelete('projects', p.id)} className='text-sm text-red-600 font-bold hover:underline cursor-pointer'>Delete project</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>
                )}
            </div>

            <footer className='max-w-6xl mx-auto px-8 py-12 text-sm text-ink/40'>&copy; 2026 Freetracker</footer>
        </main>
    );
}