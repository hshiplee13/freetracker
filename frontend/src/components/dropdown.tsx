'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

type Client = { id: string; name: string; email: string };

type DropdownProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function Dropdown({ value, onChange }: DropdownProps) {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const clientData = await apiFetch('/clients/');
                setClients(clientData.results ?? clientData);
            } catch {
                console.error('Failed to load clients');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const toggleDropdown = () => setIsOpen((o) => !o);

    const handleOptionClick = (clientId: string) => {
        onChange(clientId);
        setIsOpen(false);
    }

    const selectedLabel = clients.find((c) => c.id === value)?.name || 'Select a client';

    return (
        <div className='relative w-full'>
            <button type='button' className='w-full border border-ink/20 rounded-sm px-3 py-2 mb-4 text-left focus:outline-none focus:ring-2 focus:ring-moss' onClick={toggleDropdown}>
                {loading ? 'Loading...' : selectedLabel}
            </button>
            {isOpen && (
                <ul className='absolute z-10 w-full bg-white border border-ink/20 rounded-sm mt-1 max-h-60 overflow-y-auto'>
                    {clients.map((client) => (
                        <li key={client.id} className='px-3 py-2 hover:bg-ink/10 cursor-pointer' onClick={() => handleOptionClick(client.id)}>{client.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}