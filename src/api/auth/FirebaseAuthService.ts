import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  UserCredential
} from 'firebase/auth';

import {
  auth,
  googleProvider,
  facebookProvider,
  githubProvider,
  twitterProvider
} from '../firebase';

export class FirebaseAuthService {
  // Sign in with Google
  static async signInWithGoogle(): Promise<UserCredential> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw new Error(error.message || 'Erro ao fazer login com Google');
    }
  }

  // Sign in with Facebook
  static async signInWithFacebook(): Promise<UserCredential> {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      return result;
    } catch (error) {
      console.error('Facebook sign in error:', error);
      throw new Error(error.message || 'Erro ao fazer login com Facebook');
    }
  }

  // Sign in with GitHub
  static async signInWithGithub(): Promise<UserCredential> {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      return result;
    } catch (error) {
      console.error('GitHub sign in error:', error);
      throw new Error(error.message || 'Erro ao fazer login com GitHub');
    }
  }

  // Sign in with Twitter
  static async signInWithTwitter(): Promise<UserCredential> {
    try {
      const result = await signInWithPopup(auth, twitterProvider);
      return result;
    } catch (error) {
      console.error('Twitter sign in error:', error);
      throw new Error(error.message || 'Erro ao fazer login com Twitter');
    }
  }

  // Sign in with email and password
  static async signInWithEmailPassword(
    email: string, 
    password: string
  ): Promise<UserCredential> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error('Email sign in error:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    }
  }

  // Sign up with email and password
  static async signUpWithEmailPassword(
    email: string, 
    password: string
  ): Promise<UserCredential> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error('Email sign up error:', error);
      throw new Error(error.message || 'Erro ao criar conta');
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Erro ao fazer logout');
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Erro ao enviar email de recuperação');
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Get ID token for backend authentication
  static async getIdToken(): Promise<string | null> {
    const user = this.getCurrentUser();
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }
}