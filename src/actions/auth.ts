'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
// import { createSession, deleteSession } from "@/lib/session"

// Mock database - replace with your actual database
const users = new Map();
const otpStore = new Map();

export async function signup(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    return { error: 'All fields are required' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long' };
  }

  // Check if user already exists
  if (users.has(email)) {
    return { error: 'User already exists with this email' };
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store user data temporarily (in production, hash the password)
  const userData = { name, email, password, verified: false };
  users.set(email, userData);
  otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 }); // 10 minutes

  // In production, send OTP via email service
  console.log(`OTP for ${email}: ${otp}`);

  // Store email in session for OTP verification
  const cookieStore = await cookies();
  cookieStore.set('pending-verification', email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60, // 10 minutes
  });

  redirect('/auth/verify-otp');
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const user = users.get(email);
  if (!user || user.password !== password) {
    return { error: 'Invalid email or password' };
  }

  if (!user.verified) {
    return { error: 'Please verify your email before signing in' };
  }

  // Create session
  //   await createSession(user)
  redirect('/dashboard');
}

export async function verifyOTP(prevState: any, formData: FormData) {
  const otp = formData.get('otp') as string;
  const cookieStore = await cookies();
  const email = cookieStore.get('pending-verification')?.value;

  if (!email) {
    return { error: 'Verification session expired. Please sign up again.' };
  }

  if (!otp || otp.length !== 6) {
    return { error: 'Please enter a valid 6-digit code' };
  }

  const storedOTP = otpStore.get(email);
  if (!storedOTP) {
    return { error: 'OTP expired. Please request a new one.' };
  }

  if (Date.now() > storedOTP.expires) {
    otpStore.delete(email);
    return { error: 'OTP expired. Please request a new one.' };
  }

  if (storedOTP.otp !== otp) {
    return { error: 'Invalid verification code' };
  }

  // Mark user as verified
  const user = users.get(email);
  if (user) {
    user.verified = true;
    users.set(email, user);
  }

  // Clean up
  otpStore.delete(email);
  cookieStore.delete('pending-verification');

  // Create session
  //   await createSession(user)
  redirect('/dashboard');
}

export async function resendOTP(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const email = cookieStore.get('pending-verification')?.value;

  if (!email) {
    return { error: 'Verification session expired. Please sign up again.' };
  }

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });

  // In production, send OTP via email service
  console.log(`New OTP for ${email}: ${otp}`);

  return { success: 'New verification code sent to your email' };
}

export async function logout() {
  //   await deleteSession()
  redirect('/auth/login');
}
