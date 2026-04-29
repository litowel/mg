import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function Marketplace() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New product state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [type, setType] = useState('physical');

  useEffect(() => {
    async function fetchProducts() {
      try {
        // According to our rules, list reads are allowed if isSignedIn() and (status == 'active' || sellerId == req.uid)
        // Wait, the rules say `allow list: if isSignedIn() && (resource.data.status == 'active' || resource.data.sellerId == request.auth.uid);`
        // To query, we must limit to active if we are not passing our uid. We can just query `status == 'active'`
        if (!user) {
           setLoading(false);
           return;
        }
        
        const q = query(collection(db, 'products'), where('status', '==', 'active'));
        const querySnapshot = await getDocs(q);
        const prods: any[] = [];
        querySnapshot.forEach((doc) => {
          prods.push({ id: doc.id, ...doc.data() });
        });
        setProducts(prods);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'products');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [user]);

  const handleCreateProduct = async () => {
    if (!user) return;
    try {
      // Create product with a specific ID format or let Firebase generate one? Let's use generic addDoc which creates a doc. Wait, our rules allow: allow create: if isValidId(productId)
      // addDoc creates a valid random ID.
      await addDoc(collection(db, 'products'), {
        sellerId: user.uid,
        title,
        description,
        price: Number(price),
        type,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      alert('Product Listed Successfully!');
      window.location.reload(); // simple refresh to see new product
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'products');
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Marketplace</h2>
        <p className="text-neutral-500 mb-8">Please sign in to view and interact with the marketplace.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-neutral-500 mt-1">Discover products, services, and digital goods.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>List a Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>List a New Product</DialogTitle>
              <DialogDescription>Start selling to the UpFrica community.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input id="price" type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Product Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Physical Product</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="digital">Digital Good</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateProduct}>List Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-20 animate-pulse">Loading marketplace...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border border-neutral-200 dark:border-neutral-800 rounded-xl border-dashed">
          <p className="text-neutral-500">No active products found. Be the first to list one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Card key={p.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{p.title}</CardTitle>
                  <Badge variant="secondary">{p.type}</Badge>
                </div>
                <CardDescription className="line-clamp-2 mt-2">{p.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-2xl font-bold">${p.price}</div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Contact Seller</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
