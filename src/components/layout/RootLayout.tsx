import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Map, Store, Wallet, Bot, LayoutDashboard, UserCircle, LogOut } from 'lucide-react';

export default function RootLayout() {
  const { user, profile, signInWithGoogle, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 flex flex-col font-sans">
      <header className="bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-heading font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2 group">
              <span className="bg-gradient-to-br from-blue-600 to-emerald-500 text-white px-2 py-1 rounded-md text-sm shadow-md group-hover:scale-105 transition-transform">UP</span>
              UpFrica
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link to="/marketplace" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-2 transition-colors">
                <Store className="w-4 h-4" /> Marketplace
              </Link>
              <Link to="/map" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-2 transition-colors">
                <Map className="w-4 h-4" /> Map
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
                <Button onClick={signOut} variant="outline" size="sm" className="gap-2 border-neutral-200 dark:border-neutral-800 hidden sm:flex">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={signInWithGoogle} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                Sign In / Join
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col p-4 sm:p-6 lg:p-8 relative">
        <Outlet />
      </main>
    </div>
  );
}
