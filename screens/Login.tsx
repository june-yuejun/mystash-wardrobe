
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/');
            }
        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-pop-grey-1 flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_black] max-w-sm w-full relative">
                <div className="absolute -top-6 -left-6 bg-pop-pink border-4 border-black px-4 py-2 -rotate-3 shadow-[4px_4px_0px_black]">
                    <h1 className="font-pop text-2xl uppercase italic">My Stash</h1>
                </div>

                <div className="mt-8">
                    <h2 className="font-pop text-3xl uppercase mb-6 text-center">{isSignUp ? 'Join the Club' : 'Welcome Back'}</h2>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <label className="block font-bold uppercase text-xs mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 border-4 border-black px-3 font-bold focus:outline-none focus:bg-pop-grey-2"
                            />
                        </div>

                        <div>
                            <label className="block font-bold uppercase text-xs mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 border-4 border-black px-3 font-bold focus:outline-none focus:bg-pop-grey-2"
                            />
                        </div>

                        {message && (
                            <div className="bg-pop-orange/20 border-2 border-pop-orange p-2 text-xs font-bold text-red-600">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-klein-blue text-white font-pop uppercase text-xl border-4 border-black shadow-[4px_4px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Log In')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-xs font-bold underline uppercase"
                        >
                            {isSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
