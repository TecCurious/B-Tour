'use client';

import React, { useState } from 'react';
import { signUp } from '../../auth/signUp';
import { useDispatch } from 'react-redux';
import { adduser } from '@/slices/counterSlice';
import { useRouter } from 'next/navigation';

const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRePassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState<string | undefined>('');

    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async () => {
        if (password === repassword) {
            setMessage("Signing up...");
            const message = await signUp(email, name, phone, password);
            setMessage(message);
            dispatch(adduser(email));
            router.push('/home');
        }
        else {
            setMessage("both the passwords should be same");
        }
    };

    return (
        <div className='flex flex-col gap-4 bg-gray-400 p-4'>
            <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Email'/>
            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password'/>
            <input type='password' value={repassword} onChange={(e) => setRePassword(e.target.value)} placeholder='Retype password'/>
            <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Name'/>
            <input type='text' value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='Enter Phone'/>

            <button onClick={handleSubmit}>Sign up</button>

            <p>{message}</p>
        </div>
    );
};

export default SignUpForm;
