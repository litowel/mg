import { Store } from 'lucide-react';
import { Card } from '../components/ui/card';

export default function MapPage() {
  return (
    <div className="flex flex-col h-[80vh] gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Africa Business Map</h1>
        <p className="text-neutral-500 mt-1">Explore services, digital goods, and businesses geographically.</p>
      </div>
      
      <Card className="flex-1 overflow-hidden relative bg-neutral-100 dark:bg-neutral-900 flex flex-col items-center justify-center p-8 border-2 border-neutral-200 dark:border-neutral-800 border-dashed">
         <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
           <Store className="w-8 h-8 text-neutral-400" />
         </div>
         <h2 className="text-2xl font-bold mb-2 text-neutral-900 dark:text-white">Map View Coming Soon</h2>
         <p className="text-neutral-500 max-w-md text-center">
           We are currently building an interactive map of Africa to help you discover businesses, services, and digital goods across the continent. Check back later!
         </p>
      </Card>
    </div>
  );
}
