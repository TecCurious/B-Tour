'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/auth/signIn';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store'
import { adduser } from '@/slices/counterSlice';


const SignInForm = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [message, setMessage] = useState('');
    const user = useSelector((state: RootState)=> state.userState.user);
    const dispatch = useDispatch()

    const handleSubmit = async () => {
        setMessage('Signing in...');
        
        try {
            const signInResponse = await signIn(email,password)

            if(String(signInResponse) === 'true') {
                dispatch(adduser(email));
                router.push('/home');
            } else {
                router.refresh();
            }

        } catch(err) {
            console.log(err);
        }

        setMessage(message);
    };

    return (
        <div className='flex flex-col gap-4 bg-gray-400 p-4'>
            <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />

            <button onClick={handleSubmit}>Sign in</button>

            <p>{message}</p>
        </div>
    );
};

export default SignInForm;
