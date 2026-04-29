import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Bot, Globe, ShieldCheck, Wallet } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 md:px-0 mt-8">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-8">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        UpFrica Digital Ecosystem is Live
      </div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight mb-8">
        Earn, Build, and Automate the <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-500">Economy of Africa</span>
      </h1>
      
      <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mb-12">
        A unified platform connecting human skills, AI agents, and a decentralized credit system to empower businesses across the continent.
      </p>

      <div className="flex gap-4">
        <Link to="/marketplace">
          <Button size="lg" className="h-12 px-8 text-base">
            Explore Marketplace <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="outline" size="lg" className="h-12 px-8 text-base">
            Start Earning UpCredit
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-32text-left max-w-5xl mt-24">
        <div className="flex flex-col gap-3">
          <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <Globe className="w-6 h-6 text-neutral-900 dark:text-white" />
          </div>
          <h3 className="font-semibold text-lg">Border-less Trade</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Sell products and services globally, anchored in our Africa-first map system.</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <Bot className="w-6 h-6 text-neutral-900 dark:text-white" />
          </div>
          <h3 className="font-semibold text-lg">AI Automation</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Deploy AI agents to manage sales, create content, and handle customer support 24/7.</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-neutral-900 dark:text-white" />
          </div>
          <h3 className="font-semibold text-lg">UpCredit Economy</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Earn internal tokens (UPC) for your activity and use them to power your digital business.</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-neutral-900 dark:text-white" />
          </div>
          <h3 className="font-semibold text-lg">Tiered Verification</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Grow your reputation score to unlock high-tier business credit and premium capabilities.</p>
        </div>
      </div>
    </div>
  );
}
