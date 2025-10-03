'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import AuthForm from '../AuthForm';
import AuthLink from '../AuthLink';

import { api } from '@/lib/api';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try { await api.post('/auth/register', {
        name,
        email,
        password,
      });
      router.push('/auth/login');
    } 
    catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } 
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm headers="Register">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <Button type="submit" className="w-full text-base font-semibold inset-shadow-sky-200 from-sky-600 to-sky-500 hover:inset-shadow-sky-300 hover:from-sky-700 hover:to-sky-600" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>

      {error && (
        <p className="text-rose-500 mt-2 text-center text-sm">{error}</p>
      )}

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
