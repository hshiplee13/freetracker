'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'
import { apiFetch, getMe } from '@/lib/api';
import Navigation from '@/components/navigation';

type Project = { id: string; title: string; status: string; client: string };
type Transcript = { id: string; file: string; filename: string };

export default function ProjectPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const me = await getMe();
                setUser(me);
                const [projectData, transcriptData] = await Promise.all([
                    apiFetch(`/projects/?project=${id}`),
                    apiFetch(`/transcripts/?project=${id}`),
                ])
                setProject(projectData);
                setTranscripts(transcriptData.results ?? transcriptData);
            } catch {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    async function handleUpload(e: React.SubmitEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('project', id);

            const response = await apiFetch('/transcripts/upload/', {
                method: 'POST',
                body: formData,
            });

            const result = await response
            const fresh = await apiFetch(`/transcripts/?project=${id}`);
            setTranscripts(fresh);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Couldn't upload file. Try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        try {
            await apiFetch('/transcripts/' + id + '/delete/', {
                method: 'DELETE',
            })
            setTranscripts((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            console.error('Failed to delete: ', err);
        }
    };

    return (
        <main className='min-h-screen'>
            <Navigation />
            
            {project ? (
                <div key={project.id} className='max-w-6xl mx-auto px-8 py-10'>
                    <h1 className='font-display text-3xl text-ink mb-8'>{project.title}</h1>

                    <section>
                        <div className='max-w-6xl mx-auto px-8 py-10'>
                            <h2 className='text-ink mb-8'>Transcripts</h2>
                        </div>
                        {transcripts.length === 0 ? (
                            <p className='text-ink/50 text-sm'>No transcripts yet.</p>
                            
                        ) : (
                            <ul className='space-y-3'>
                                {transcripts.map((t) => (
                                    <li key={t.id} className='border border-ink/10 rounded-sm p-4 flex justify-between'>
                                        <p className='font-medium text-ink'>{t.filename}</p>
                                        <button onClick={() => handleDelete(t.id)} className='text-sm text-red-600 font-bold hover:underline cursor-pointer'>Delete transcript</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <form onSubmit={handleUpload} className='w-full max-w-sm'>
                        <h3 className='text-ink mb-8'>Upload transcript</h3>
                        <input type='file' name='file' className='py-2 mb-8' onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

                        {error && <p className='text-clay text-sm mb-4'>{error}</p>}

                        <button type='submit' disabled={loading} className='w-full bg-moss text-paper py-2 rounded-sm hover:bg-ink transition-colors disabled:opacity-60'>
                            {loading ? 'Loading...' : 'Upload'}
                        </button>
                    </form>
                </div>
            ) : 'Loading'}
        </main>
    );
}