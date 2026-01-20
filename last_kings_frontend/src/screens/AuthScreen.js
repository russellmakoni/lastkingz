import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, signUp } = useAuth();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            if (isLogin) { await signIn(username, password); } 
            else { await signUp(username, password); alert("Sign up successful! Please log in."); setIsLogin(true); }
        } catch (err) { setError(err.response?.data?.message || (isLogin ? "Invalid credentials." : "Sign up failed.")); console.error(err); } 
        finally { setLoading(false); }
    };

    const togglePasswordVisibility = ()=>{
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className="min-h-screen  flex flex-col items-center justify-center p-4 ">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 m-4 backdrop-filter backdrop-blur-lg bg-opacity-30">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">{isLogin ? `Hi ${username}, Welcome Back ` : `Create Account`}</h2>
                <p className="text-center text-gray-900 mb-8">{isLogin ? "Sign in to manage your store " : "Get started in seconds"}</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="text" placeholder="Username"
                     value={username} onChange={e => setUsername(e.target.value)}
                      className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-white-500 transition"
                       required />

                   <div className='mb-4 relative '>
                   
                    <input type={isPasswordVisible ?"text":"password"}
                    placeholder="Password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}

                     className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition" required />
                     <button type='button'
                     onClick={togglePasswordVisibility}
                     className='absolute inset-y-6 right-0 pr-3 flex items-center text-sm leading-5 text-indigo-600 hover:text-indigo-800 font-semibold top-6' 
                     aria-label={isPasswordVisible ? "hide password":"show password"}
                     >
                      {isPasswordVisible? "hide":"show"}  
                     </button>
                 </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors shadow-lg">
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>
                <p className="text-center text-gray-900 mt-6">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-indigo-600 font-semibold ml-2 hover:underline">
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthScreen;