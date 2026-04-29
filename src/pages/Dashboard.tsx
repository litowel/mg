import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Wallet, Bot, FileText, Settings, UserCircle, Star, ArrowUpRight } from 'lucide-react';
import { query, collection, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [agents, setAgents] = useState<any[]>([]);
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
        const q = query(collection(db, 'agents'), where('ownerId', '==', user!.uid));
        const res = await getDocs(q);
        const a: any[] = [];
        res.forEach(d => a.push({ id: d.id, ...d.data() }));
        setAgents(a);
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
    return <div className="text-center py-20">Please sign in to access your dashboard.</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {profile?.name || 'User'}</h1>
          <p className="text-neutral-500 mt-1">Manage your business, credit, and AI agents.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm py-1 px-3">
            <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
            Reputation: {profile?.reputationScore || 0}
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" /> Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
          <CardHeader>
            <CardDescription className="text-neutral-300">Wallet Balance</CardDescription>
            <CardTitle className="text-4xl flex items-center gap-2">
              <Wallet className="w-8 h-8 opacity-50" />
              {wallet ? wallet.balanceUpc : 0} <span className="text-xl font-normal opacity-50">UPC</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-400">UpCredit enables trade and AI tools.</p>
            <Button variant="secondary" className="w-full mt-4 dark:bg-white dark:text-black">
              Transfer Funds <ArrowUpRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              Active Agents <Bot className="w-5 h-5 text-neutral-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{agents.filter(a => a.status === 'active').length}</div>
            <p className="text-sm text-neutral-500 mt-1">Automating your tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              Business Tier <UserCircle className="w-5 h-5 text-neutral-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white">Level 1</div>
            <p className="text-sm text-neutral-500 mt-1">Eligible for up to 500 UPC credit</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your AI Agents</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Bot className="w-4 h-4" /> Deploy Agent
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deploy New AI Agent</DialogTitle>
                <DialogDescription>Automate your workflow with a specialized AI assistant.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                 <div className="grid gap-2">
                   <Label>Agent Name</Label>
                   <Input value={agentName} onChange={e => setAgentName(e.target.value)} />
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
                   <Label>System Prompt / Instructions</Label>
                   <Input value={agentPrompt} onChange={e => setAgentPrompt(e.target.value)} />
                 </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateAgent}>Launch Agent</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {agents.length === 0 ? (
          <div className="text-center py-16 border rounded-xl border-dashed">
             <Bot className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
             <h3 className="text-lg font-medium text-neutral-900 dark:text-white">No agents active</h3>
             <p className="text-neutral-500 max-w-sm mx-auto mt-2">Deploy a seller, freelancer, or content agent to scale your business.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                      {agent.status}
                    </Badge>
                  </div>
                  <CardDescription className="capitalize">{agent.type.replace('_', ' ')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    "{agent.prompt}"
                  </p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm" className="w-full">Configure</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
