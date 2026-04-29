import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Wallet, Bot, FileText, Settings, UserCircle, Star, ArrowUpRight, Package } from 'lucide-react';
import { query, collection, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [agents, setAgents] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any | null>(null);

  // New agent state
  const [agentName, setAgentName] = useState('');
  const [agentType, setAgentType] = useState('seller');
  const [agentPrompt, setAgentPrompt] = useState('You are a helpful selling assistant.');

  useEffect(() => {
    if (!user) return;
    
    async function fetchData() {
      try {
        // Fetch wallet
        const wDoc = await getDoc(doc(db, 'wallets', user!.uid));
        if (wDoc.exists()) setWallet(wDoc.data());

        // Fetch agents
        const qAgents = query(collection(db, 'agents'), where('ownerId', '==', user!.uid));
        const resAgents = await getDocs(qAgents);
        const a: any[] = [];
        resAgents.forEach(d => a.push({ id: d.id, ...d.data() }));
        setAgents(a);

        // Fetch user products
        const qProducts = query(collection(db, 'products'), where('sellerId', '==', user!.uid));
        const resProducts = await getDocs(qProducts);
        const p: any[] = [];
        resProducts.forEach(d => p.push({ id: d.id, ...d.data() }));
        setProducts(p);

      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'multiple');
      }
    }
    fetchData();
  }, [user]);

  const handleCreateAgent = async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'agents'), {
        ownerId: user.uid,
        name: agentName,
        type: agentType,
        prompt: agentPrompt,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      alert('AI Agent Created!');
      window.location.reload();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'agents');
    }
  };

  if (!user) {
    return <div className="text-center py-20 font-medium text-neutral-500">Please sign in to access your dashboard.</div>;
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
            {profile?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold tracking-tight text-neutral-900 dark:text-white">Welcome back, {profile?.name || 'User'}</h1>
            <p className="text-neutral-500 text-sm mt-1">Manage your UpFrica business, credit, and AI agents.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium pr-4">
            <Star className="w-4 h-4 mr-1.5 text-amber-500 fill-amber-500" />
            Score: {profile?.reputationScore || 0}
          </Badge>
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 h-auto flex-wrap">
          <TabsTrigger value="overview" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="agents" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm">AI Agents ({agents.length})</TabsTrigger>
          <TabsTrigger value="products" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm">Products / Services ({products.length})</TabsTrigger>
          <TabsTrigger value="wallet" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm">Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white border-0 shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <CardHeader className="relative z-10 pb-2">
                <CardDescription className="text-neutral-300 font-medium">Available UpCredit</CardDescription>
                <CardTitle className="text-4xl lg:text-5xl flex items-center gap-3 font-heading">
                  <Wallet className="w-8 h-8 opacity-50" />
                  {wallet ? wallet.balanceUpc : 0} <span className="text-xl font-normal opacity-50">UPC</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-sm text-neutral-400 mt-2 mb-6">UpCredit enables trade, AI tool subscriptions, and promotion.</p>
                <Button className="w-full bg-white text-black hover:bg-neutral-200">
                  Manage Wallet <ArrowUpRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between font-heading">
                  Active Agents <Bot className="w-5 h-5 text-purple-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold font-heading text-neutral-900 dark:text-white mb-2">{agents.filter(a => a.status === 'active').length}</div>
                <p className="text-sm text-neutral-500 mb-6">Total active agents managing your interactions and sales.</p>
                <Button variant="outline" className="w-full">View Activity</Button>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between font-heading">
                  Business Tier <UserCircle className="w-5 h-5 text-blue-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold font-heading text-neutral-900 dark:text-white mb-2">Level 1</div>
                <p className="text-sm text-neutral-500 mb-6">Eligible for up to 500 UPC credit line based on activity.</p>
                <Button variant="secondary" className="w-full text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50">Request Upgrade</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <h2 className="text-xl font-heading font-semibold text-neutral-900 dark:text-white">AI Automation Hub</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                  <Bot className="w-4 h-4" /> Deploy New Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Deploy AI Agent</DialogTitle>
                  <DialogDescription>Automate workflow with a specialized assistant.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                   <div className="grid gap-2">
                     <Label>Agent Name</Label>
                     <Input placeholder="e.g. Sales Bot Alpha" value={agentName} onChange={e => setAgentName(e.target.value)} />
                   </div>
                   <div className="grid gap-2">
                     <Label>Type</Label>
                     <Select value={agentType} onValueChange={setAgentType}>
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="seller">Seller / Sales Rep</SelectItem>
                         <SelectItem value="freelancer">Freelancer Assistant</SelectItem>
                         <SelectItem value="content_creator">Content Creator</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="grid gap-2">
                     <Label>System Prompt</Label>
                     <Input placeholder="Provide explicit rules and tone..." value={agentPrompt} onChange={e => setAgentPrompt(e.target.value)} />
                   </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateAgent} className="w-full">Launch Agent</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {agents.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 border-dashed">
               <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Bot className="w-8 h-8 text-purple-400" />
               </div>
               <h3 className="text-lg font-heading font-medium text-neutral-900 dark:text-white">No active agents</h3>
               <p className="text-neutral-500 max-w-sm mx-auto mt-2">Deploy a seller, freelancer, or content agent to scale your business operations automatically.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Card key={agent.id} className="border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-2 w-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-heading">{agent.name}</CardTitle>
                        <CardDescription className="capitalize mt-1 shadow-none inline-flex bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-xs">
                          {agent.type.replace('_', ' ')}
                        </CardDescription>
                      </div>
                      <Badge variant={agent.status === 'active' ? 'default' : 'secondary'} className={agent.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100' : ''}>
                        {agent.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
                      <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold block mb-1">Prompt</span>
                      "{agent.prompt}"
                    </p>
                  </CardContent>
                  <CardFooter className="gap-2 bg-neutral-50 dark:bg-neutral-900/30 pt-4">
                    <Button variant="outline" size="sm" className="w-full">Configure Strategy</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
             <h2 className="text-xl font-heading font-semibold text-neutral-900 dark:text-white">Your Listed Inventory</h2>
             {/* We can reuse the Dialog from Marketplace here if we extract it to a component, but for now just link or show msg */}
             <Button variant="outline" className="gap-2">
               <Package className="w-4 h-4" /> Manage Listings
             </Button>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 border-dashed">
               <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Package className="w-8 h-8 text-emerald-400" />
               </div>
               <h3 className="text-lg font-heading font-medium text-neutral-900 dark:text-white">No products listed</h3>
               <p className="text-neutral-500 max-w-sm mx-auto mt-2">Go to the marketplace to add your first product or service.</p>
               <Button className="mt-4" onClick={() => window.location.href='/marketplace'}>Go to Marketplace</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {products.map(p => (
                  <Card key={p.id} className="border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-heading">{p.title}</CardTitle>
                        <Badge variant="outline">{p.type}</Badge>
                      </div>
                      <CardDescription className="mt-2 text-xl font-bold text-neutral-900 dark:text-white">${p.price}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">Edit Listing</Button>
                    </CardFooter>
                  </Card>
               ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
           <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm">
             <CardHeader>
               <CardTitle className="font-heading">Transaction History</CardTitle>
               <CardDescription>Recent activity on your UpCredit account</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="text-center py-12 text-neutral-500">
                 No recent transactions found.
               </div>
             </CardContent>
           </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
