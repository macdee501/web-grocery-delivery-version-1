import { account } from './appwrite';

export async function clearAllSessions() {
  try {
    // Delete all sessions
    await account.deleteSessions();
    console.log('✅ All sessions cleared');
    
    // Clear localStorage
    localStorage.clear();
    
    // Reload page
    window.location.href = '/';
  } catch (error) {
    console.error('Error clearing sessions:', error);
    // Even if it fails, clear local storage and reload
    localStorage.clear();
    window.location.href = '/';
  }
}