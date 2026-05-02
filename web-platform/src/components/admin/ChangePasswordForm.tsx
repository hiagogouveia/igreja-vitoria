'use client';

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import { changePassword } from '@/app/actions/account-actions';

export default function ChangePasswordForm() {
    const [current, setCurrent] = useState('');
    const [next, setNext] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (next !== confirm) {
            setMessage({ type: 'error', text: 'As senhas novas não conferem' });
            return;
        }
        if (next.length < 8) {
            setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 8 caracteres' });
            return;
        }

        setLoading(true);
        try {
            const result = await changePassword(current, next);
            if (result.success) {
                setMessage({ type: 'success', text: 'Senha alterada com sucesso.' });
                setCurrent('');
                setNext('');
                setConfirm('');
            } else {
                setMessage({ type: 'error', text: result.error || 'Erro ao alterar senha' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm text-gray-400 mb-1">Senha atual</label>
                <input
                    required
                    type="password"
                    value={current}
                    onChange={e => setCurrent(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:ring-2 focus:ring-neon-blue outline-none"
                    autoComplete="current-password"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Nova senha</label>
                <input
                    required
                    type="password"
                    value={next}
                    onChange={e => setNext(e.target.value)}
                    minLength={8}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:ring-2 focus:ring-neon-blue outline-none"
                    autoComplete="new-password"
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres.</p>
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Confirmar nova senha</label>
                <input
                    required
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    minLength={8}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:ring-2 focus:ring-neon-blue outline-none"
                    autoComplete="new-password"
                />
            </div>

            {message && (
                <p className={`text-sm rounded px-3 py-2 ${
                    message.type === 'success'
                        ? 'text-green-400 bg-green-950/40 border border-green-500/30'
                        : 'text-red-400 bg-red-950/40 border border-red-500/30'
                }`}>
                    {message.text}
                </p>
            )}

            <Button
                type="submit"
                className="flex items-center gap-2"
                disabled={loading}
            >
                <Save size={18} />
                {loading ? 'Salvando...' : 'Alterar senha'}
            </Button>
        </form>
    );
}
