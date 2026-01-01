'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function AuthForm() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
            setSent(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="w-full max-w-md p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#E6E0D8] shadow-2xl text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#7AA7A1]/10 flex items-center justify-center">
                        <CheckCircle className="text-[#7AA7A1]" size={32} />
                    </div>
                </div>
                <h1 className="serif text-3xl text-[#0E1B33] mb-4">Check your Email</h1>
                <p className="text-sm text-[#5A6477] mb-8 leading-relaxed">
                    We sent a magic link to <span className="font-bold text-[#0E1B33]">{email}</span>.<br/>
                    Click the link to enter your cosmic dashboard.
                </p>
                <button 
                    onClick={() => setSent(false)}
                    className="text-[10px] uppercase tracking-widest text-[#A1A1AA] hover:text-[#0E1B33] transition-colors"
                >
                    Use a different email
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#E6E0D8] shadow-2xl">
            <div className="text-center mb-8">
                <h1 className="serif text-4xl text-[#0E1B33] mb-2">
                    Enter the Matrix
                </h1>
                <p className="mono text-[10px] text-[#5A6477] uppercase tracking-[0.2em]">
                    Authentication Required
                </p>
            </div>

            <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="space-y-2">
                    <label className="mono text-[10px] uppercase tracking-widest text-[#5A6477] font-bold">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] group-focus-within:text-[#C9A46A] transition-colors" size={16} />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-[#E6E0D8] rounded-xl focus:outline-none focus:border-[#C9A46A] text-[#0E1B33] transition-all"
                            placeholder="traveler@example.com"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 mt-4 bg-[#0E1B33] hover:bg-[#1a2c4e] text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em]">
                        {loading ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <>
                                Send Magic Link
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </span>
                </button>
                
                <div className="text-center mt-6">
                    <p className="text-[10px] text-[#A1A1AA]">
                        Passwordless & Secure.
                    </p>
                </div>
            </form>
        </div>
    );
}
