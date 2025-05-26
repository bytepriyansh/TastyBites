import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, Truck, Phone, Mail } from 'lucide-react';
import Header from '../../components/Header';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';

interface OrderItem {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    id: string;
    customerInfo: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    items: OrderItem[];
    status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    total: number;
    paymentMethod: 'cash' | 'card' | 'online';
    createdAt: Date;
    updatedAt: Date;
}

const statusSteps = [
    { id: 'pending', label: 'Order Received', icon: Clock },
    { id: 'preparing', label: 'Preparing', icon: Clock },
    { id: 'ready', label: 'Ready', icon: CheckCircle },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const OrderPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!orderId) return;

        const unsubscribe = onSnapshot(doc(db, 'orders', orderId), (doc) => {
            try {
                if (doc.exists()) {
                    const data = doc.data();
                    setOrder({
                        id: doc.id,
                        customerInfo: data.customerInfo,
                        items: data.items,
                        status: data.status,
                        total: data.total,
                        paymentMethod: data.paymentMethod,
                        createdAt: data.createdAt?.toDate() || new Date(),
                        updatedAt: data.updatedAt?.toDate() || new Date(),
                    });
                } else {
                    setError('Order not found');
                }
                setLoading(false);
            } catch (err) {
                setError('Error loading order');
                console.error(err);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-tasty-cream to-white">
                <Header />
                <div className="container mx-auto px-4 flex flex-col items-center justify-center flex-grow py-20">
                    <div className="relative flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-tasty-orange animate-pulse shadow-lg shadow-yellow-500/50"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-70 animate-shimmer"></div>
                    </div>
                    <p className="mt-8 text-yellow-700 text-3xl font-semibold tracking-wide drop-shadow-lg animate-pulse">
                        Loading your order...
                    </p>
                </div>

                <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2.5s infinite;
        }
      `}</style>
            
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-tasty-cream to-white">
                <Header />
                <div className="container mx-auto px-4 py-16">
                    <Card className="max-w-lg mx-auto p-8 text-center bg-white shadow-lg border-0">
                        <h2 className="text-2xl font-bold text-tasty-charcoal mb-4">Order Not Found</h2>
                        <p className="text-gray-600 mb-6">
                            {error || 'We couldn\'t find your order. Please check your order ID.'}
                        </p>
                        <Button onClick={() => window.location.href = '/'} className="btn-primary">
                            Back to Home
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    const currentStatusIndex = statusSteps.findIndex(step => step.id === order.status);
    const deliveryTime = new Date(order.createdAt);
    deliveryTime.setMinutes(deliveryTime.getMinutes() + 30);

    return (
        <div className="min-h-screen bg-gradient-to-br from-tasty-cream to-white">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-tasty-charcoal mb-2">Order #{order.id.slice(0, 8)}</h1>
                        <p className="text-gray-600">
                            Placed on {order.createdAt.toLocaleDateString()} at {order.createdAt.toLocaleTimeString()}
                        </p>
                    </div>

                    <Card className="p-6 mb-8 bg-white shadow-lg border-0">
                        <h2 className="text-xl font-bold text-tasty-charcoal mb-6">Order Status</h2>
                        <div className="relative">
                            <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
                            {statusSteps.map((step, index) => {
                                const StatusIcon = step.icon;
                                const isCompleted = index < currentStatusIndex;
                                const isCurrent = index === currentStatusIndex;
                                const isPending = index > currentStatusIndex;

                                return (
                                    <div key={step.id} className="relative flex items-start mb-8 last:mb-0">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full z-10 ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-tasty-orange text-white' : 'bg-gray-200 text-gray-600'}`}>
                                            <StatusIcon className="w-4 h-4" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className={`font-semibold ${isCurrent ? 'text-tasty-orange' : ''}`}>{step.label}</h3>
                                            {isCurrent && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {order.status === 'pending' && 'We\'ve received your order'}
                                                    {order.status === 'preparing' && 'Your food is being prepared'}
                                                    {order.status === 'ready' && 'Your order is ready for pickup'}
                                                    {order.status === 'delivered' && 'Your order has been delivered'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="p-6 bg-white shadow-lg border-0">
                            <h2 className="text-xl font-bold text-tasty-charcoal mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-tasty-orange" />
                                Delivery Information
                            </h2>

                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold">{order.customerInfo.name}</p>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                    <p>{order.customerInfo.address}</p>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                    <p>{order.customerInfo.phone}</p>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                    <p>{order.customerInfo.email}</p>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center">
                                        <Truck className="w-5 h-5 mr-2 text-tasty-orange" />
                                        <div>
                                            <p className="font-semibold">Estimated Delivery</p>
                                            <p className="text-sm text-gray-600">
                                                {deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white shadow-lg border-0">
                            <h2 className="text-xl font-bold text-tasty-charcoal mb-4">Order Details</h2>

                            <div className="space-y-4 mb-6">
                                {order.items.map((item) => (
                                    <div key={item.itemId} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
                                        <div className="flex items-center">
                                            <span className="text-gray-600 mr-2">{item.quantity}x</span>
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">${order.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method</span>
                                    <span className="font-semibold capitalize">{order.paymentMethod}</span>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-tasty-orange">${order.total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button className="w-full mt-6 btn-primary" onClick={() => window.location.href = '/'}>
                                Back to Menu
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;