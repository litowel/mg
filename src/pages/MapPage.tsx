import { useEffect, useState } from 'react';
import { Card } from '../components/ui/card';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Store } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';

export default function MapPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMapData() {
      try {
        const q = query(collection(db, 'products'), where('status', '==', 'active'));
        const querySnapshot = await getDocs(q);
        const data: any[] = [];
        querySnapshot.forEach(doc => {
           const p = doc.data();
           data.push({
             id: doc.id,
             // Random relative position for the placeholder map (0 to 100%)
             top: 20 + Math.random() * 60,
             left: 20 + Math.random() * 60,
             ...p
           });
        });
        setProducts(data);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'products');
      }
    }
    fetchMapData();
  }, []);

  return (
    <div className="flex flex-col h-[80vh] gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Africa Business Map</h1>
        <p className="text-neutral-500 mt-1">Explore services, digital goods, and businesses geographically.</p>
      </div>
      
      <Card className="flex-1 overflow-hidden relative bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center p-8 border-2 border-neutral-200 dark:border-neutral-800">
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:16px_16px]" />
         
         <div className="absolute inset-0">
           {products.map(prod => (
              <div 
                key={prod.id} 
                className="absolute group"
                style={{ top: `${prod.top}%`, left: `${prod.left}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className="relative w-8 h-8 flex items-center justify-center bg-white dark:bg-neutral-800 rounded-full shadow-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer hover:scale-110 hover:-translate-y-1 transition duration-200 z-10">
                  <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="w-10 h-10 absolute bg-emerald-500/20 rounded-full animate-ping pointer-events-none" />
                </div>
                
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none bg-neutral-900 border border-neutral-800 text-white text-sm px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-20 flex flex-col items-center">
                   <span className="font-medium">{prod.title}</span>
                   <span className="text-emerald-400 font-bold">\${prod.price}</span>
                   <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
                </div>
              </div>
            ))}
         </div>

         {!products.length && (
           <div className="relative z-10 text-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-6 py-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
             <h3 className="font-semibold mb-1">Map is Empty</h3>
             <p className="text-sm text-neutral-500 max-w-xs">There are currently no active products in the region to display.</p>
           </div>
         )}
      </Card>
    </div>
  );
}
