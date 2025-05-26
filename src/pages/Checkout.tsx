import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, CreditCard, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart, submitOrder } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online'>('card');

  const totalPrice = getTotalPrice();
  const deliveryFee = totalPrice >= 25 ? 0 : 3.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + deliveryFee + tax;

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [cartItems.length, orderPlaced, navigate]);


  const handlePlaceOrder = async () => {
    if (!customerInfo.address || !customerInfo.city || !customerInfo.phone || !customerInfo.name || !customerInfo.email) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const orderId = await submitOrder({
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: `${customerInfo.address}, ${customerInfo.city}`
      }, paymentMethod);

      setOrderPlaced(true);
      clearCart();

      setTimeout(() => {
        navigate(`/order/${orderId}`);
      }, 3000);
    } catch (err) {
      setError('Failed to submit order. Please try again.');
      console.error('Order submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tasty-cream to-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-lg mx-auto p-8 text-center bg-white shadow-lg border-0 animate-scale-in">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold text-tasty-charcoal mb-4">Order Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order! Your delicious food is being prepared and will be delivered soon.
            </p>
            <div className="bg-tasty-orange/10 rounded-lg p-4 mb-6">
              <p className="text-tasty-orange-dark font-semibold">Estimated Delivery Time</p>
              <p className="text-2xl font-bold text-tasty-orange">25-30 minutes</p>
            </div>
            <p className="text-sm text-gray-500">
              Redirecting to order status page...
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tasty-cream to-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-tasty-charcoal mb-2">Checkout</h1>
            <p className="text-gray-600">Review your order and delivery details</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="p-6 bg-white shadow-lg border-0">
                <h3 className="text-xl font-bold text-tasty-charcoal mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-tasty-orange" />
                  Delivery Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your Name"
                      value={customerInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="(555) 123-4567"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Your City"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                    <Input
                      id="notes"
                      placeholder="Ring doorbell, leave at door, etc."
                      value={customerInfo.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Payment Method *</h4>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value as 'cash' | 'card' | 'online')}
                      className="grid gap-3 grid-cols-3"
                    >
                      <div>
                        <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                        <Label
                          htmlFor="cash"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span>Cash</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="card" id="card" className="peer sr-only" />
                        <Label
                          htmlFor="card"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span>Card</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="online" id="online" className="peer sr-only" />
                        <Label
                          htmlFor="online"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span>Online</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-tasty-orange to-tasty-orange-light text-white">
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Estimated Delivery Time
                </h3>
                <p className="text-2xl font-bold">25-30 minutes</p>
                <p className="text-sm opacity-90 mt-1">From order confirmation</p>
              </Card>
            </div>

            <div>
              <Card className="p-6 bg-white shadow-lg border-0">
                <h3 className="text-xl font-bold text-tasty-charcoal mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-tasty-orange" />
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-tasty-orange">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-tasty-orange">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || !customerInfo.address || !customerInfo.city ||
                    !customerInfo.phone || !customerInfo.name || !customerInfo.email}
                  className="w-full btn-primary mb-3"
                >
                  {isSubmitting ? 'Processing...' : `Place Order - $${finalTotal.toFixed(2)}`}
                </Button>

                {error && (
                  <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
                )}

                <Button
                  onClick={() => navigate('/cart')}
                  variant="outline"
                  className="w-full btn-secondary"
                >
                  Back to Cart
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;