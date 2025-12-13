import React, { useState } from 'react';
import { User, ViewState } from '../../types';
import { LogIn, ArrowRight, UserPlus } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: User) => void;
  currentView: ViewState;
  switchView: (view: ViewState) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, currentView, switchView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (currentView === ViewState.REGISTER && !name) {
      setError('Please enter your name');
      return;
    }

    // Simulate auth
    setTimeout(() => {
      const mockUser: User = {
        email,
        name: name || email.split('@')[0] || 'User',
        school: 'N/A',
        studentClass: 'N/A',
      };
      onLogin(mockUser);
    }, 500);
  };

  const isLogin = currentView === ViewState.LOGIN;

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-navy">
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="relative z-10 flex flex-col justify-between p-16 text-white h-full">
            <div>
                <div className="flex flex-col mb-8">
                    <h1 className="text-4xl font-bold text-brand-gold leading-none tracking-tight">IACG</h1>
                    <p className="text-sm text-gray-300 uppercase tracking-widest font-semibold">Multimedia College</p>
                </div>
                <h2 className="text-4xl font-bold mb-6 leading-tight">Discover Your <br/>True Potential</h2>
                <p className="text-lg text-gray-200 max-w-md leading-relaxed">
                    Our scientific psychometric assessments help you uncover your strengths, interests, and ideal career paths.
                </p>
            </div>
            <div className="flex gap-2 opacity-70">
                <div className="w-2 h-2 rounded-full bg-brand-gold"></div>
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-navy text-brand-gold mb-6 shadow-lg shadow-brand-navy/20 lg:hidden">
                    <LogIn className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="mt-2 text-gray-600">
                    {isLogin 
                        ? 'Please enter your details to sign in.' 
                        : 'Start your journey with us today.'}
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border-l-4 border-red-500 text-sm font-medium shadow-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 outline-none transition-all"
                            placeholder="John Doe"
                        />
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 outline-none transition-all"
                        placeholder="name@example.com"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-brand-navy text-white py-4 rounded-lg font-bold hover:bg-brand-navyLight transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-navy/30 hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={20} />
                </button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">Or</span>
                </div>
            </div>

            <div className="text-center">
                <p className="text-gray-600 text-sm mb-3">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p>
                <button
                    onClick={() => switchView(isLogin ? ViewState.REGISTER : ViewState.LOGIN)}
                    className="inline-flex items-center justify-center px-6 py-2 border border-brand-navy text-brand-navy font-bold rounded-lg hover:bg-brand-navy/5 transition-colors text-sm uppercase tracking-wide"
                >
                    {isLogin ? 'Register Now' : 'Login Here'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;