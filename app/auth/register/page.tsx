'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import AuthForm from '@/app/auth/AuthForm';
import AuthLink from '../AuthLink';
import { api } from '@/lib/api'; // Axios instance

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
      });

      router.push('/auth/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm headers="Register">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          type="text"
          value={name}
          error={error && !name ? 'Name is required' : ''}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full"
        />

        <Input
          label="Email"
          type="email"
          value={email}
          error={error && !email ? 'Email is required' : ''}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          error={error && !password ? 'Password is required' : ''}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full"
        />

        <Button
          variant="custom"
          loading={isSubmitting}
          className="text-md text-white font-semibold w-full bg-indigo-600 py-2 rounded-md"
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </Button>
      </form>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      <AuthLink
        question="Already have an Account?"
        link="Login"
        href="/auth/login"
        className="mt-4"
      />
    </AuthForm>
  );
};

export default RegisterPage;
