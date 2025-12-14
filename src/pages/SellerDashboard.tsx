import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ShoppingBag, Wallet, AlertTriangle, Share2, Settings, HelpCircle,
  MessageSquare, TrendingUp, Phone, Mail, Plus,
  ChevronRight, Bell, Menu, X, CheckCircle, Clock,
  ArrowUpRight, ArrowDownLeft, Camera
} from 'lucide-react';
import { DisputesManagement } from '@/components/DisputesManagement';

// Types
interface Order {
  id: string;
  buyer: string;
  amount: number;
  item: string;
  status: 'pending' | 'shipped' | 'completed' | 'dispute';
  timeLeft: string;
  rating: number;
  reviews: number;
}

interface Transaction {
  type: 'deposit' | 'withdrawal';
  amount: number;
  desc: string;
  date: string;
}

interface SocialLink {
  icon: string;
  name: string;
  handle: string;
  followers: string;
  connected: boolean;
}

interface WalletData {
  available: number;
  pending: number;
  total: number;
}

interface SellerProfile {
  name: string;
  verified: boolean;
  memberSince: string;
  isActive: boolean;
}

export function SellerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [withdrawalModal, setWithdrawalModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');

  // Empty data states - ready for API integration
  const [orders] = useState<Order[]>([]);
  const [transactions] = useState<Transaction[]>([]);
  const [socialLinks] = useState<SocialLink[]>([
    { icon: '📸', name: 'Instagram', handle: '', followers: '', connected: false },
    { icon: '💬', name: 'WhatsApp Business', handle: '', followers: '', connected: false },
    { icon: '👍', name: 'Facebook Marketplace', handle: '', followers: '', connected: false },
    { icon: '📌', name: 'TikTok Shop', handle: 'Coming Soon', followers: '', connected: false },
  ]);
  const [wallet] = useState<WalletData>({ available: 0, pending: 0, total: 0 });
  const [profile] = useState<SellerProfile>({ name: 'Seller', verified: false, memberSince: '', isActive: false });

  // Payment link form state
  const [paymentLinkForm, setPaymentLinkForm] = useState({
    itemName: '',
    description: '',
    price: ''
  });

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
    { id: 'social', label: 'Social Links', icon: Share2 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-600 border-yellow-200';
      case 'shipped': return 'bg-blue-500/20 text-blue-600 border-blue-200';
      case 'completed': return 'bg-green-500/20 text-green-600 border-green-200';
      case 'dispute': return 'bg-red-500/20 text-red-600 border-red-200';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: '🟡 Awaiting Acceptance',
      shipped: '🚚 In Transit',
      completed: '✅ Completed',
      dispute: '🚨 Dispute Opened'
    };
    return labels[status] || status;
  };

  const handleCreatePaymentLink = () => {
    if (!paymentLinkForm.itemName || !paymentLinkForm.price) {
      alert('Please fill in item name and price');
      return;
    }
    // TODO: API integration to create payment link
    alert('Payment link functionality coming soon!');
    setPaymentLinkForm({ itemName: '', description: '', price: '' });
  };

  const handleWithdraw = () => {
    if (!withdrawalAmount || Number(withdrawalAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (Number(withdrawalAmount) > wallet.available) {
      alert('Insufficient funds');
      return;
    }
    // TODO: API integration for withdrawal
    alert('Withdrawal functionality coming soon!');
    setWithdrawalModal(false);
    setWithdrawalAmount('');
  };

  // HOME TAB
  const renderHome = () => (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {profile.name}! 👋</h1>
            <p className="text-blue-100">
              {profile.verified ? '✅ Verified Seller' : '⏳ Pending Verification'} 
              {profile.memberSince && ` • Member since ${profile.memberSince}`}
              {profile.isActive && ' • 🟢 Active Now'}
            </p>
          </div>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition">
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'New Orders', value: orders.filter(o => o.status === 'pending').length, color: 'from-green-500 to-emerald-600' },
          { label: 'Active Orders', value: orders.filter(o => o.status === 'shipped').length, color: 'from-blue-500 to-cyan-600' },
          { label: 'Completed', value: orders.filter(o => o.status === 'completed').length, color: 'from-purple-500 to-pink-600' },
          { label: 'Total Revenue', value: `KES ${wallet.total.toLocaleString()}`, color: 'from-orange-500 to-red-600' },
        ].map((stat, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg`}>
            <p className="text-sm opacity-90 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-green-200 rounded-xl p-6">
          <p className="text-gray-600 text-sm mb-2">Available to Withdraw</p>
          <p className="text-3xl font-bold text-green-600 mb-4">KES {wallet.available.toLocaleString()}</p>
          <button 
            onClick={() => setWithdrawalModal(true)} 
            disabled={wallet.available <= 0}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Withdraw Now
          </button>
        </div>

        <div className="bg-white border border-yellow-200 rounded-xl p-6">
          <p className="text-gray-600 text-sm mb-2">Pending Escrow</p>
          <p className="text-3xl font-bold text-yellow-600 mb-4">KES {wallet.pending.toLocaleString()}</p>
          <p className="text-xs text-gray-500">({orders.filter(o => o.status === 'pending' || o.status === 'shipped').length} orders pending confirmation)</p>
        </div>

        <div className="bg-white border border-blue-200 rounded-xl p-6">
          <p className="text-gray-600 text-sm mb-2">Total Earnings</p>
          <p className="text-3xl font-bold text-blue-600 mb-2">KES {wallet.total.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <TrendingUp size={16} /> All time earnings
          </div>
        </div>
      </div>

      {/* Action Board */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-red-800 mb-4">🔴 Awaiting Your Action</h3>
        {orders.filter(o => o.status === 'pending').length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <p>No pending actions! You're all caught up.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.filter(o => o.status === 'pending').map((order) => (
              <div key={order.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-red-300 transition cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">{order.buyer}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-3">{order.item} • KES {order.amount.toLocaleString()}</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-green-600 text-white py-1 rounded text-sm hover:bg-green-700 transition">Accept</button>
                  <button className="flex-1 bg-red-600 text-white py-1 rounded text-sm hover:bg-red-700 transition">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold mb-4">📊 Recent Activity</h3>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No recent activity yet.</p>
            <p className="text-sm">Your transactions will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-0">
                {tx.type === 'deposit' ? (
                  <ArrowDownLeft className="text-green-600 flex-shrink-0 mt-1" size={20} />
                ) : (
                  <ArrowUpRight className="text-red-600 flex-shrink-0 mt-1" size={20} />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{tx.desc}</p>
                  <p className="text-sm text-gray-600">{tx.date}</p>
                </div>
                <p className={`font-bold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'deposit' ? '+' : '-'}KES {tx.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ORDERS TAB
  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">📦 Orders</h2>
        <div className="flex gap-2">
          <input type="text" placeholder="Search order..." className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500" />
          <select className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500">
            <option>All Orders</option>
            <option>Pending</option>
            <option>Active</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">Share your payment links to start receiving orders!</p>
          <button 
            onClick={() => setActiveTab('social')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Create Payment Link
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-lg">Order #{order.id}</p>
                  <p className="text-gray-600">Buyer: {order.buyer} • ⭐ {order.rating} ({order.reviews} reviews)</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 font-semibold mb-2">{order.item}</p>
                <p className="text-2xl font-bold text-green-600">KES {order.amount.toLocaleString()}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <p>⏰ {order.status === 'completed' ? 'Completed' : `${order.timeLeft} remaining`}</p>
                </div>
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold">Accept</button>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold">Reject</button>
                    </>
                  )}
                  {order.status === 'shipped' && (
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">Update Tracking</button>
                  )}
                  {order.status === 'completed' && (
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition font-semibold">View Details</button>
                  )}
                  <button className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition">
                    <MessageSquare size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // WALLET TAB
  const renderWallet = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">💼 Wallet & Balance</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-8 text-white">
          <p className="text-green-100 mb-2">Available to Withdraw</p>
          <p className="text-4xl font-bold mb-4">KES {wallet.available.toLocaleString()}</p>
          <button 
            onClick={() => setWithdrawalModal(true)} 
            disabled={wallet.available <= 0}
            className="w-full bg-white text-green-600 py-3 rounded-lg hover:bg-gray-100 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💸 Withdraw
          </button>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-8 text-white">
          <p className="text-yellow-100 mb-2">Pending Escrow</p>
          <p className="text-4xl font-bold mb-2">KES {wallet.pending.toLocaleString()}</p>
          <p className="text-sm text-yellow-100">({orders.filter(o => o.status !== 'completed').length} orders pending)</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-8 text-white">
          <p className="text-blue-100 mb-2">Total Earnings</p>
          <p className="text-4xl font-bold mb-2">KES {wallet.total.toLocaleString()}</p>
          <p className="text-sm text-blue-100">All time</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold mb-6">📝 Transaction History</h3>
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No transactions yet</p>
            <p className="text-sm">Your transaction history will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${tx.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {tx.type === 'deposit' ? (
                      <ArrowDownLeft className="text-green-600" size={20} />
                    ) : (
                      <ArrowUpRight className="text-red-600" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{tx.desc}</p>
                    <p className="text-sm text-gray-600">{tx.date}</p>
                  </div>
                </div>
                <p className={`text-xl font-bold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'deposit' ? '+' : '-'}KES {tx.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // DISPUTES TAB
  const renderDisputes = () => <DisputesManagement />;

  // SOCIAL TAB
  const renderSocial = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📱 Social Media Links</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {socialLinks.map((social, idx) => (
          <div key={idx} className={`rounded-xl p-6 border-2 ${social.connected ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-3xl mb-2">{social.icon}</p>
                <p className="font-bold text-lg">{social.name}</p>
                <p className="text-sm text-gray-600">{social.handle || 'Not Connected'}</p>
              </div>
              {social.connected && <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold">✓ Connected</span>}
            </div>
            <div className="flex gap-2">
              {social.connected ? (
                <>
                  <button onClick={() => setShareModal(true)} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold">
                    Share Link
                  </button>
                  <button className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition text-sm font-semibold">
                    Manage
                  </button>
                </>
              ) : social.handle !== 'Coming Soon' ? (
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                  Connect
                </button>
              ) : (
                <button disabled className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg font-semibold cursor-not-allowed">
                  Coming Soon
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Payment Link */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h3 className="text-2xl font-bold mb-6">🔗 Create Payment Link</h3>
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Item Name" 
            value={paymentLinkForm.itemName}
            onChange={(e) => setPaymentLinkForm(prev => ({ ...prev, itemName: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500" 
          />
          <textarea 
            placeholder="Item Description (optional)" 
            value={paymentLinkForm.description}
            onChange={(e) => setPaymentLinkForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500" 
            rows={3}
          />
          <input 
            type="number" 
            placeholder="Price (KES)" 
            value={paymentLinkForm.price}
            onChange={(e) => setPaymentLinkForm(prev => ({ ...prev, price: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500" 
          />
          <button 
            onClick={handleCreatePaymentLink}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:shadow-lg transition font-bold text-lg"
          >
            <Plus className="inline mr-2" size={20} />
            Generate Payment Link
          </button>
        </div>
      </div>
    </div>
  );

  // SETTINGS TAB
  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">⚙️ Settings</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-2">Profile Picture</p>
          <div className="w-24 h-24 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <Camera size={32} className="text-gray-400" />
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm">
            Change Photo
          </button>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <p className="font-bold text-lg mb-4">Verification Status</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="font-semibold">ID Verification</span>
              <span className="text-yellow-600 font-bold">⏳ Pending</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="font-semibold">Phone</span>
              <span className="text-yellow-600 font-bold">⏳ Pending</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="font-semibold">M-Pesa</span>
              <span className="text-yellow-600 font-bold">⏳ Pending</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="font-bold text-lg mb-4">Quick Settings</p>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Push Notifications</span>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">SMS Alerts</span>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Email Updates</span>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </div>
      </div>

      <button 
        onClick={() => navigate('/')}
        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-bold text-lg"
      >
        🚪 Log Out
      </button>
    </div>
  );

  // SUPPORT TAB
  const renderSupport = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">❓ Help & Support</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition cursor-pointer">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <p className="font-bold mb-2">Live Chat</p>
          <p className="text-sm text-gray-600 mb-4">Available 9 AM - 6 PM</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
            Start Chat
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition cursor-pointer">
          <Mail className="w-12 h-12 mx-auto mb-4 text-green-600" />
          <p className="font-bold mb-2">Email Support</p>
          <p className="text-sm text-gray-600 mb-4">support@paying-zee.com</p>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold">
            Send Email
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition cursor-pointer">
          <Phone className="w-12 h-12 mx-auto mb-4 text-orange-600" />
          <p className="font-bold mb-2">Call Us</p>
          <p className="text-sm text-gray-600 mb-4">+254 701 234 567</p>
          <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition font-semibold">
            Call Now
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="font-bold text-lg mb-4">Common Questions</p>
        <div className="space-y-3">
          {[
            'How do orders work?',
            'What if buyer doesn\'t confirm?',
            'How to withdraw funds?',
            'How to handle disputes?',
            'How to connect social media?',
          ].map((q, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer flex justify-between items-center">
              <span>{q}</span>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-gray-700">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div 
              className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent cursor-pointer"
              onClick={() => navigate('/')}
            >
              paying-zee
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
              <Bell size={24} />
            </button>
            <button className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-bold flex items-center justify-center">
              S
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} md:w-64 bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden md:overflow-visible fixed md:sticky top-16 h-[calc(100vh-64px)] z-30`}>
          <div className="p-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 md:ml-0">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'wallet' && renderWallet()}
          {activeTab === 'disputes' && renderDisputes()}
          {activeTab === 'social' && renderSocial()}
          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'support' && renderSupport()}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {withdrawalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">💸 Withdraw Funds</h3>
              <button onClick={() => setWithdrawalModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300 cursor-pointer hover:bg-green-100 transition">
                <p className="font-bold">📱 M-Pesa (Recommended)</p>
                <p className="text-sm text-gray-600 mt-2">Link your M-Pesa number</p>
                <p className="text-xs text-green-600 mt-1">Instant • No fee</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300 cursor-pointer hover:bg-gray-100 transition">
                <p className="font-bold">🏦 Bank Account</p>
                <p className="text-sm text-gray-600 mt-2">Link your bank account</p>
                <p className="text-xs text-gray-600 mt-1">24-48 hours • No fee</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <input 
                type="number" 
                placeholder="Amount (KES)" 
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500" 
              />
              {withdrawalAmount && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>You'll receive:</strong> KES {(Number(withdrawalAmount) * 0.98).toLocaleString()} (after 2% fee)
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setWithdrawalModal(false)} className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-semibold">
                Cancel
              </button>
              <button 
                onClick={handleWithdraw}
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition font-bold"
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">🔗 Share on Social</h3>
              <button onClick={() => setShareModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
              <p className="text-sm font-mono text-blue-900 break-all">Create a payment link first to share</p>
            </div>

            <div className="space-y-3 mb-6">
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition font-semibold">
                📸 Share on Instagram
              </button>
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-semibold">
                💬 Share on WhatsApp
              </button>
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold">
                👍 Share on Facebook
              </button>
            </div>

            <button onClick={() => setShareModal(false)} className="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-semibold">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
