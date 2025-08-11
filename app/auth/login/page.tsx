// /app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthForm from '@/app/auth/AuthForm';
import AuthLink from '../AuthLink';
import Checkbox from '@/components/ui/Checkbox';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Both fields are required');
      return;
    }
    setIsSubmitting(true);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    setIsSubmitting(false);

    if (response.ok) {
      router.push('/admin/dashboard');
    } else {
      setError(data.message || 'Login failed');
    }
  };

  return (
    <AuthForm headers='Login'>
      <form onSubmit={handleSubmit} className="space-y-4" >
        <Input label="Email" type="email" value={email} error={error && !email ? 'Email is required' : ''}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full"
        />

        <Input label="Password" type="password" value={password} error={error && !password ? 'Password is required' : ''}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full"
        />

        <div className="flex items-center justify-between w-full text-sm">
          <Checkbox label="Remember Me" checked={rememberMe} onChange={handleCheckboxChange} className="!mb-0 !w-auto"/>

          <AuthLink href="/forgot-password" link="Forgot Password?" question=""/>
        </div>

        <Button onClick={handleSubmit} variant="custom" loading={isSubmitting} className='text-md text-white font-semibold w-full bg-indigo-600 py-2 rounded-md'>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      <AuthLink question="Don't have an account?" link='Register' href='/auth/register' className='mt-4' />
    </AuthForm>
  );
};

export default LoginPage;