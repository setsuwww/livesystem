'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthForm from '@/app/auth/AuthForm';
import AuthLink from '../AuthLink';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsSubmitting(true);

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    setIsSubmitting(false);

    if (response.ok) {
      router.push('/auth/login');
    } else {
      setError(data.message || 'Registration failed');
    }
  };

  return (
    <AuthForm headers='Register'>
      <form onSubmit={handleSubmit} className="space-y-4">

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

        <Input label="Confirm Password" type="password" value={confirmPassword} error={error && !confirmPassword ? 'Confirm password is required' : ''}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          className="w-full"
        />

        <Button onClick={handleSubmit} variant="custom" loading={isSubmitting} className='text-md text-white font-semibold w-full bg-indigo-600 py-2 rounded-md'>
          {isSubmitting ? 'Registering...' : 'Register'}
        </Button>
      </form>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      <AuthLink question='Already have an Account?' link='Login' href='/auth/login' className='mt-4' />
    </AuthForm>
  );
};

export default RegisterPage;