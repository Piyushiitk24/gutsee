// Enhanced Auth Configuration for Supabase
// This makes authentication as simple as Clerk while keeping Supabase

import { createClient } from '@/lib/supabase';

export class SimpleAuth {
  private supabase = createClient();

  // Email + Password (always works, no setup needed)
  async signUpWithEmail(email: string, password: string, metadata?: any) {
    return await this.supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
  }

  async signInWithEmail(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  // Magic Links (passwordless, no OAuth setup needed)
  async signInWithMagicLink(email: string) {
    return await this.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
  }

  // Google OAuth (setup once, add to environment)
  async signInWithGoogle() {
    return await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  }

  // Phone Auth (works in many countries without setup)
  async signInWithPhone(phone: string) {
    return await this.supabase.auth.signInWithOtp({
      phone,
      options: {
        // Optional: customize SMS
      }
    });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  // Get current user
  async getCurrentUser() {
    return await this.supabase.auth.getUser();
  }

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }
}

// Usage Examples:
/*
const auth = new SimpleAuth();

// Email signup (works immediately)
await auth.signUpWithEmail('user@example.com', 'password123');

// Magic link (no password needed)
await auth.signInWithMagicLink('user@example.com');

// Google OAuth (requires 5-min setup)
await auth.signInWithGoogle();

// Phone (works in most countries)
await auth.signInWithPhone('+1234567890');
*/

export const simpleAuth = new SimpleAuth();

// Pre-configured auth methods that work without OAuth setup
export const NO_SETUP_AUTH_METHODS = [
  'email_password',
  'magic_link', 
  'phone_otp'
];

// OAuth methods that need platform setup
export const OAUTH_METHODS = [
  'google',     // 5 min setup
  'github',     // 3 min setup  
  'apple',      // 15 min setup
  'discord',    // 5 min setup
  'facebook',   // 10 min setup
];

export default SimpleAuth;
