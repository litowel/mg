import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Bot, Globe, ShieldCheck, Wallet, Sparkles, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 md:px-0 mt-8 relative">
      {/* Background gradients for visual appeal */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-t from-emerald-500/10 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-sm font-medium text-blue-700 dark:text-blue-300 mb-8 backdrop-blur-sm shadow-sm">
        <Sparkles className="w-4 h-4" />
        UpFrica Digital Ecosystem is Live
      </div>
      
      <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-8 text-neutral-900 dark:text-white">
        Earn, Build, and Automate the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400">Economy of Africa</span>
      </h1>
      
      <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mb-12 leading-relaxed">
        A unified platform connecting human skills, AI agents, and a decentralized credit system to empower businesses across the continent.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link to="/marketplace">
          <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-blue-500/20 w-full sm:w-auto font-medium transition-all hover:-translate-y-1">
            Explore Marketplace <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="outline" size="lg" className="h-14 px-8 text-base w-full sm:w-auto font-medium transition-all hover:bg-neutral-50 dark:hover:bg-neutral-900">
            Start Earning UpCredit <TrendingUp className="ml-2 w-5 h-5 text-emerald-500" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-32 text-left max-w-6xl w-full">
        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-800">
            <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-heading font-bold text-xl text-neutral-900 dark:text-white">Border-less Trade</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">Sell products and services globally, anchored in our Africa-first map system.</p>
        </div>
        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center border border-purple-100 dark:border-purple-800">
            <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-heading font-bold text-xl text-neutral-900 dark:text-white">AI Automation</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">Deploy AI agents to manage sales, create content, and handle customer support 24/7.</p>
        </div>
        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
            <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-heading font-bold text-xl text-neutral-900 dark:text-white">UpCredit Economy</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">Earn internal tokens (UPC) for your activity and use them to power your digital business.</p>
        </div>
        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center border border-amber-100 dark:border-amber-800">
            <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-heading font-bold text-xl text-neutral-900 dark:text-white">Tiered Verification</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">Grow your reputation score to unlock high-tier business credit and premium capabilities.</p>
        </div>
      </div>
    </div>
  );
}
