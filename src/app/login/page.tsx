"use client";

import React, { useState , useEffect} from 'react';
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { loginUser } from '@/action/actions';

const SignInForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [user, setUser] = useState(null); // State for user data


  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Signing in...');

   

    try {
      const signInResponse = await loginUser(email, password);
          console.log(email);
          console.log(password);
          console.log(signInResponse);
      
      if (signInResponse) {
        // setUser(email); // Store user data in state
        localStorage.setItem("email", signInResponse.user.email);
        localStorage.setItem("id", signInResponse.user.id);
        router.push('/dashboard');
      } else {
        setMessage('Invalid credentials. Please try again.');
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      setMessage('An error occurred. Please try again.');
      console.log(error)
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex p-8 bg-gray-100 min-h-screen">
      {/* Left side with background image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" style={{backgroundImage: "url('/image/bt.jpg')"}}></div>

      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-24">
        <div className="max-w-md w-full mx-auto bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
            Sign in to your account
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          {message && (
            <div className={`mt-4 text-center text-sm ${message.includes("error") ? "text-red-600" : "text-green-600"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
