import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronRight, AlertCircle, X, Download, Eye, MessageSquare, CheckCircle,
  Clock, MapPin, Truck, Phone, Mail, Search, Filter, Plus, Upload, Camera,
  TrendingUp, Award, ShoppingBag, Zap
} from 'lucide-react';

interface OrderShipping {
  courierName: string;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  notes?: string;
  proofImages?: string[];
}

interface TimelineEvent {
  title: string;
  completed: boolean;
  completedAt?: string;
}

interface Order {
  id: string;
  buyerName: string;
  buyerPhone: string;
  buyerLocation: string;
  buyerMemberSince?: string;
  buyerRating?: number;
  buyerPurchases?: number;
  itemName: string;
  quantity: number;
  amount: number;
  status: 'pending' | 'accepted' | 'shipped' | 'completed' | 'dispute' | 'cancelled';
  createdAt: string;
  deadline: string;
  buyerMessage?: string;
  messageCreatedAt?: string;
  shipping?: OrderShipping;
  timeline?: TimelineEvent[];
}

interface PerformanceMetrics {
  acceptanceRate: number;
  averageDeliveryTime: string;
  disputeRate: number;
  totalOrders: number;
}

interface UIState {
  loading: boolean;
  orderDetailOpen: boolean;
  shippingModalOpen: boolean;
  proofUploadOpen: boolean;
  messageModalOpen: boolean;
  errorNotification: string | null;
  successNotification: string | null;
}

interface ShippingFormState {
  courierName: string;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  notes: string;
  proofImages: File[];
}

interface OrdersTabProps {
  onCreatePaymentLink?: () => void;
}

export function OrdersTab({ onCreatePaymentLink }: OrdersTabProps) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const [ui, setUi] = useState<UIState>({
    loading: true,
    orderDetailOpen: false,
    shippingModalOpen: false,
    proofUploadOpen: false,
    messageModalOpen: false,
    errorNotification: null,
    successNotification: null,
  });

  const [shippingForm, setShippingForm] = useState<ShippingFormState>({
    courierName: '',
    trackingNumber: '',
    estimatedDeliveryDate: '',
    notes: '',
    proofImages: [],
  });

  const [messageInput, setMessageInput] = useState('');
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);

  const getAuthToken = () => localStorage.getItem('authToken');

  const fetchOrders = useCallback(async () => {
    try {
      setUi(prev => ({ ...prev, loading: true, errorNotification: null }));

      const response = await fetch('/api/v1/seller/orders', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.data || []);
    } catch (error) {
      console.error('Fetch orders error:', error);
      setUi(prev => ({
        ...prev,
        errorNotification: (error as Error).message || 'Failed to load orders. Please try again.',
      }));
      setOrders([]);
    } finally {
      setUi(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const fetchOrderDetails = useCallback(async (orderId: string) => {
    try {
      const response = await fetch(`/api/v1/seller/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setSelectedOrder(data.data);
      setUi(prev => ({ ...prev, orderDetailOpen: true }));
    } catch (error) {
      console.error('Fetch order details error:', error);
      setUi(prev => ({
        ...prev,
        errorNotification: 'Failed to load order details',
      }));
    }
  }, []);

  const fetchPerformanceMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/seller/performance', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const data = await response.json();
      setPerformanceMetrics(data.data);
    } catch (error) {
      console.error('Fetch metrics error:', error);
    }
  }, []);

  const acceptOrder = useCallback(async (orderId: string) => {
    try {
      const response = await fetch(`/api/v1/seller/orders/${orderId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to accept order');
      }

      setUi(prev => ({
        ...prev,
        successNotification: 'Order accepted successfully!',
      }));
      fetchOrders();
      fetchOrderDetails(orderId);
    } catch (error) {
      console.error('Accept order error:', error);
      setUi(prev => ({
        ...prev,
        errorNotification: (error as Error).message || 'Failed to accept order',
      }));
    }
  }, [fetchOrders, fetchOrderDetails]);

  const rejectOrder = useCallback(async (orderId: string) => {
    try {
      const response = await fetch(`/api/v1/seller/orders/${orderId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject order');
      }

      setUi(prev => ({
        ...prev,
        successNotification: 'Order rejected',
        orderDetailOpen: false,
      }));
      fetchOrders();
    } catch (error) {
      console.error('Reject order error:', error);
      setUi(prev => ({
        ...prev,
        errorNotification: (error as Error).message || 'Failed to reject order',
      }));
    }
  }, [fetchOrders]);

  const submitShippingInfo = useCallback(async (orderId: string) => {
    try {
      if (!shippingForm.courierName || !shippingForm.trackingNumber || !shippingForm.estimatedDeliveryDate) {
        setUi(prev => ({
          ...prev,
          errorNotification: 'Please fill in all required fields',
        }));
        return;
      }

      const formData = new FormData();
      formData.append('courierName', shippingForm.courierName);
      formData.append('trackingNumber', shippingForm.trackingNumber);
      formData.append('estimatedDeliveryDate', shippingForm.estimatedDeliveryDate);
      formData.append('notes', shippingForm.notes);
      
      shippingForm.proofImages.forEach((image, idx) => {
        formData.append(`proofImages[${idx}]`, image);
      });

      const response = await fetch(`/api/v1/seller/orders/${orderId}/shipping`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit shipping info');
      }

      setUi(prev => ({
        ...prev,
        successNotification: 'Shipping information added successfully!',
        shippingModalOpen: false,
      }));
      
      setShippingForm({
        courierName: '',
        trackingNumber: '',
        estimatedDeliveryDate: '',
        notes: '',
        proofImages: [],
      });

      fetchOrders();
      fetchOrderDetails(orderId);
    } catch (error) {
      console.error('Submit shipping error:', error);
      setUi(prev => ({
        ...prev,
        errorNotification: (error as Error).message || 'Failed to submit shipping info',
      }));
    }
  }, [shippingForm, fetchOrders, fetchOrderDetails]);

  const sendMessage = useCallback(async (orderId: string) => {
    try {
      if (!messageInput.trim()) {
        setUi(prev => ({
          ...prev,
          errorNotification: 'Message cannot be empty',
        }));
        return;
      }

      const response = await fetch(`/api/v1/seller/orders/${orderId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setMessageInput('');
      setUi(prev => ({
        ...prev,
        successNotification: 'Message sent!',
      }));
      fetchOrderDetails(orderId);
    } catch (error) {
      console.error('Send message error:', error);
      setUi(prev => ({
        ...prev,
        errorNotification: (error as Error).message || 'Failed to send message',
      }));
    }
  }, [messageInput, fetchOrderDetails]);

  useEffect(() => {
    fetchOrders();
    fetchPerformanceMetrics();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders, fetchPerformanceMetrics]);

  // Auto-dismiss notifications
  useEffect(() => {
    if (ui.successNotification) {
      const timer = setTimeout(() => {
        setUi(prev => ({ ...prev, successNotification: null }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [ui.successNotification]);

  useEffect(() => {
    if (ui.errorNotification) {
      const timer = setTimeout(() => {
        setUi(prev => ({ ...prev, errorNotification: null }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [ui.errorNotification]);

  const formatCurrency = (amount: number) => {
    if (!amount) return 'KES 0';
    return `KES ${amount.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-KE');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      accepted: 'bg-blue-100 text-blue-800 border-blue-300',
      shipped: 'bg-purple-100 text-purple-800 border-purple-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      dispute: 'bg-red-100 text-red-800 border-red-300',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[status] || colors.pending;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: '🟡 Awaiting Acceptance',
      accepted: '✅ Accepted',
      shipped: '🚚 In Transit',
      completed: '✅ Completed',
      dispute: '🚨 Dispute Open',
      cancelled: '❌ Cancelled',
    };
    return labels[status] || status;
  };

  const filteredOrders = orders?.filter(order => {
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = !searchQuery || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  })?.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'amount-high') return b.amount - a.amount;
    if (sortBy === 'amount-low') return a.amount - b.amount;
    return 0;
  }) || [];

  const OrderDetailModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl my-8">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6 flex justify-between items-center">
            <div>
              <h3 className="text-3xl font-black text-white">Order #{selectedOrder.id}</h3>
              <p className="text-blue-100 text-sm mt-1">Created {formatTime(selectedOrder.createdAt)}</p>
            </div>
            <button
              onClick={() => setUi(prev => ({ ...prev, orderDetailOpen: false }))}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Buyer Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="text-lg font-black text-blue-900 mb-4 flex items-center gap-2">
                👤 Buyer Information
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-blue-700 font-semibold mb-1">Name</p>
                  <p className="text-gray-900 font-bold">{selectedOrder.buyerName}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-semibold mb-1">Phone</p>
                  <a href={`tel:${selectedOrder.buyerPhone}`} className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-2">
                    <Phone size={16} /> {selectedOrder.buyerPhone}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-semibold mb-1">Location</p>
                  <p className="text-gray-900 font-bold flex items-center gap-2">
                    <MapPin size={16} /> {selectedOrder.buyerLocation}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-semibold mb-1">Member Since</p>
                  <p className="text-gray-900 font-bold">{selectedOrder.buyerMemberSince || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-blue-700 font-semibold mb-1">Rating</p>
                  <p className="text-gray-900 font-bold">⭐ {selectedOrder.buyerRating?.toFixed(1) || '0.0'}/5.0 ({selectedOrder.buyerPurchases || 0} purchases)</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <a href={`tel:${selectedOrder.buyerPhone}`} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-bold text-sm flex items-center justify-center gap-2">
                  <Phone size={16} /> Call Buyer
                </a>
                <button
                  onClick={() => setUi(prev => ({ ...prev, messageModalOpen: true }))}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-bold text-sm flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} /> Message
                </button>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                📦 Order Details
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-gray-700 font-semibold">Item</span>
                  <span className="text-gray-900 font-bold">{selectedOrder.itemName}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-gray-700 font-semibold">Quantity</span>
                  <span className="text-gray-900 font-bold">{selectedOrder.quantity}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-gray-700 font-semibold">Amount</span>
                  <span className="text-2xl font-black text-green-600">{formatCurrency(selectedOrder.amount)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-gray-700 font-semibold">Status</span>
                  <span className={`text-xs font-black px-4 py-2 rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Escrow Guarantee */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="text-lg font-black text-green-900 mb-4 flex items-center gap-2">
                🔒 Escrow Guarantee
              </h4>
              <div className="space-y-3 text-green-900">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="flex-shrink-0 mt-1 text-green-600" />
                  <div>
                    <p className="font-bold">Amount Locked in Escrow</p>
                    <p className="text-2xl font-black text-green-600">{formatCurrency(selectedOrder.amount)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="flex-shrink-0 mt-1 text-green-600" />
                  <div>
                    <p className="font-bold">Released When</p>
                    <p>Buyer confirms delivery</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={20} className="flex-shrink-0 mt-1 text-orange-600" />
                  <div>
                    <p className="font-bold">Deadline to Ship</p>
                    <p>{new Date(selectedOrder.deadline).toLocaleDateString('en-KE')}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {Math.ceil((new Date(selectedOrder.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-black text-gray-900 mb-4">📅 Order Timeline</h4>
              <div className="space-y-4">
                {selectedOrder.timeline?.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${event.completed ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                      {idx < (selectedOrder.timeline?.length || 0) - 1 && (
                        <div className="w-0.5 h-12 bg-gray-300"></div>
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="font-bold text-gray-900">{event.title}</p>
                      {event.completedAt && (
                        <p className="text-sm text-gray-600">{new Date(event.completedAt).toLocaleString('en-KE')}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buyer Message */}
            {selectedOrder.buyerMessage && (
              <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-6">
                <h4 className="text-lg font-black text-blue-900 mb-3">💬 Buyer's Message</h4>
                <p className="text-gray-800 italic">"{selectedOrder.buyerMessage}"</p>
                <p className="text-sm text-gray-600 mt-3">{formatTime(selectedOrder.messageCreatedAt || '')}</p>
              </div>
            )}

            {/* Shipping Info */}
            {selectedOrder.shipping && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h4 className="text-lg font-black text-purple-900 mb-4 flex items-center gap-2">
                  📍 Shipping Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-purple-200">
                    <span className="text-purple-700 font-semibold">Courier</span>
                    <span className="text-gray-900 font-bold">{selectedOrder.shipping.courierName}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-purple-200">
                    <span className="text-purple-700 font-semibold">Tracking Number</span>
                    <span className="text-gray-900 font-bold font-mono">{selectedOrder.shipping.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-purple-200">
                    <span className="text-purple-700 font-semibold">Est. Delivery</span>
                    <span className="text-gray-900 font-bold">{new Date(selectedOrder.shipping.estimatedDeliveryDate).toLocaleDateString('en-KE')}</span>
                  </div>
                  {selectedOrder.shipping.notes && (
                    <div className="p-3 bg-white rounded-lg border border-purple-200">
                      <span className="text-purple-700 font-semibold text-sm">Notes</span>
                      <p className="text-gray-800 text-sm mt-2">{selectedOrder.shipping.notes}</p>
                    </div>
                  )}
                </div>

                {selectedOrder.shipping.proofImages && selectedOrder.shipping.proofImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-purple-700 font-semibold text-sm mb-3">📸 Proof of Shipment</p>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedOrder.shipping.proofImages.map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Proof ${idx + 1}`}
                          className="h-24 w-24 rounded-lg object-cover border border-purple-200 hover:scale-110 transition cursor-pointer"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t bg-gray-50 px-8 py-6 flex gap-3 justify-end flex-wrap">
            {selectedOrder.status === 'pending' && (
              <>
                <button
                  onClick={() => rejectOrder(selectedOrder.id)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
                >
                  ❌ Reject Order
                </button>
                <button
                  onClick={() => acceptOrder(selectedOrder.id)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold"
                >
                  ✅ Accept Order
                </button>
              </>
            )}

            {selectedOrder.status === 'accepted' && (
              <button
                onClick={() => setUi(prev => ({ ...prev, shippingModalOpen: true }))}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold flex items-center gap-2"
              >
                <Truck size={18} /> Add Shipping Info
              </button>
            )}

            {selectedOrder.status === 'shipped' && (
              <button
                onClick={() => setUi(prev => ({ ...prev, proofUploadOpen: true }))}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold flex items-center gap-2"
              >
                <Upload size={18} /> Update Proof
              </button>
            )}

            <button
              onClick={() => setUi(prev => ({ ...prev, orderDetailOpen: false }))}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ShippingModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl my-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black text-white">📦 Add Shipping Information</h3>
              <p className="text-purple-100 text-sm mt-1">Order #{selectedOrder.id}</p>
            </div>
            <button
              onClick={() => setUi(prev => ({ ...prev, shippingModalOpen: false }))}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Courier Name <span className="text-red-600">*</span>
              </label>
              <select
                value={shippingForm.courierName}
                onChange={(e) => setShippingForm(prev => ({ ...prev, courierName: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              >
                <option value="">Select a courier...</option>
                <option value="jiji">Jiji Courier</option>
                <option value="dhl">DHL Express</option>
                <option value="fedex">FedEx</option>
                <option value="custom">Custom Courier</option>
                <option value="pickup">Customer Pickup</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Tracking Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={shippingForm.trackingNumber}
                onChange={(e) => setShippingForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                placeholder="e.g., KN2025-891234"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
              <p className="text-xs text-gray-600 mt-2">Enter the tracking number from your courier receipt</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Estimated Delivery Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={shippingForm.estimatedDeliveryDate}
                onChange={(e) => setShippingForm(prev => ({ ...prev, estimatedDeliveryDate: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-gray-600 mt-2">Deadline: {new Date(selectedOrder.deadline).toLocaleDateString('en-KE')}</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Message to Buyer (Optional)
              </label>
              <textarea
                value={shippingForm.notes}
                onChange={(e) => setShippingForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special instructions or notes for the buyer..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Proof of Shipment (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition cursor-pointer">
                <Camera className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-sm text-gray-600">Click to upload images</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB each</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      setShippingForm(prev => ({
                        ...prev,
                        proofImages: [...prev.proofImages, ...Array.from(e.target.files || [])]
                      }));
                    }
                  }}
                />
              </div>
              {shippingForm.proofImages.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {shippingForm.proofImages.map((file, idx) => (
                    <div key={idx} className="relative">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                        {file.name.substring(0, 8)}...
                      </div>
                      <button
                        onClick={() => setShippingForm(prev => ({
                          ...prev,
                          proofImages: prev.proofImages.filter((_, i) => i !== idx)
                        }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-t bg-gray-50 px-8 py-6 flex gap-3 justify-end">
            <button
              onClick={() => setUi(prev => ({ ...prev, shippingModalOpen: false }))}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-bold"
            >
              Cancel
            </button>
            <button
              onClick={() => submitShippingInfo(selectedOrder.id)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold flex items-center gap-2"
            >
              <Truck size={18} /> Submit Shipping Info
            </button>
          </div>
        </div>
      </div>
    );
  };

  const MessageModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-black text-white">💬 Send Message</h3>
            <button
              onClick={() => setUi(prev => ({ ...prev, messageModalOpen: false }))}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-600">Sending to:</p>
              <p className="font-bold">{selectedOrder.buyerName}</p>
            </div>
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none"
              rows={4}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setUi(prev => ({ ...prev, messageModalOpen: false }))}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => sendMessage(selectedOrder.id)}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {ui.errorNotification && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{ui.errorNotification}</span>
          </div>
          <button onClick={() => setUi(prev => ({ ...prev, errorNotification: null }))}>
            <X size={20} />
          </button>
        </div>
      )}

      {ui.successNotification && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={20} />
            <span>{ui.successNotification}</span>
          </div>
          <button onClick={() => setUi(prev => ({ ...prev, successNotification: null }))}>
            <X size={20} />
          </button>
        </div>
      )}

      {/* Header with Performance Metrics */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">📦 Orders</h2>
          <p className="text-gray-600 text-sm">Manage your incoming orders</p>
        </div>
        <button
          onClick={onCreatePaymentLink}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition font-bold flex items-center gap-2"
        >
          <Plus size={20} />
          Create Payment Link
        </button>
      </div>

      {/* Performance Cards */}
      {performanceMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Award size={20} />
              <span className="text-sm opacity-90">Acceptance Rate</span>
            </div>
            <p className="text-2xl font-black">{performanceMetrics.acceptanceRate}%</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={20} />
              <span className="text-sm opacity-90">Avg Delivery</span>
            </div>
            <p className="text-2xl font-black">{performanceMetrics.averageDeliveryTime}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} />
              <span className="text-sm opacity-90">Total Orders</span>
            </div>
            <p className="text-2xl font-black">{performanceMetrics.totalOrders}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={20} />
              <span className="text-sm opacity-90">Dispute Rate</span>
            </div>
            <p className="text-2xl font-black">{performanceMetrics.disputeRate}%</p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or buyer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="dispute">Dispute</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Highest Amount</option>
              <option value="amount-low">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {ui.loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      )}

      {/* Empty State */}
      {!ui.loading && filteredOrders.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">
            {orders?.length === 0 ? 'No orders yet' : 'No matching orders'}
          </h3>
          <p className="text-gray-500 mb-6">
            {orders?.length === 0 
              ? 'Share your payment links to start receiving orders!' 
              : 'Try adjusting your search or filters'}
          </p>
          {orders?.length === 0 && (
            <button 
              onClick={onCreatePaymentLink}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Create Payment Link
            </button>
          )}
        </div>
      )}

      {/* Orders List */}
      {!ui.loading && filteredOrders.length > 0 && (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer"
              onClick={() => fetchOrderDetails(order.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-lg">Order #{order.id}</p>
                  <p className="text-gray-600">
                    Buyer: {order.buyerName} • <MapPin size={14} className="inline" /> {order.buyerLocation}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 font-semibold mb-2">{order.itemName} × {order.quantity}</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(order.amount)}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <Clock size={14} className="inline mr-1" />
                  {formatTime(order.createdAt)}
                </div>
                <div className="flex gap-2">
                  <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchOrderDetails(order.id);
                    }}
                  >
                    <Eye size={16} /> View Details
                  </button>
                  <button 
                    className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(order);
                      setUi(prev => ({ ...prev, messageModalOpen: true }));
                    }}
                  >
                    <MessageSquare size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {ui.orderDetailOpen && <OrderDetailModal />}
      {ui.shippingModalOpen && <ShippingModal />}
      {ui.messageModalOpen && <MessageModal />}
    </div>
  );
}
