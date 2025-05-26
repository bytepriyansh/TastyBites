import React from 'react';
import { ShoppingCart, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-tasty-orange/30 shadow-md transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigate('/')}
          >
            <div className="relative w-12 h-12 rounded-full bg-hero-gradient shadow-md flex items-center justify-center animate-glow">
              <span className="text-white font-bold text-2xl drop-shadow">T</span>
              <div className="absolute w-full h-full rounded-full border-2 border-white/20 animate-spin-slow"></div>
            </div>
            <div className="leading-tight">
              <h1 className="text-2xl font-extrabold text-tasty-orange drop-shadow-sm">TastyBites</h1>
              <p className="text-xs text-gray-500">Delicious Food Delivered</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-3">
            {location.pathname !== '/' && (
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-sm text-tasty-charcoal hover:text-tasty-orange transition-all"
              >
                🍽️ Back to Menu
              </Button>
            )}

            {location.pathname !== '/track-order' && (
              <Button
                onClick={() => navigate(`/order}`)}
                className="text-sm bg-gradient-to-r from-tasty-orange to-tasty-gold hover:brightness-110 text-white shadow-md rounded-full px-4 py-2 transition-all"
              >
                <MapPin className="w-4 h-4 mr-1" />
                Track Order
              </Button>
            )}

            {location.pathname !== '/cart' && (
              <Button
                onClick={() => navigate('/cart')}
                className="relative text-sm bg-tasty-orange hover:bg-tasty-orange-dark text-white shadow-lg rounded-full px-4 py-2 transition-all"
              >
                <ShoppingCart className="w-5 h-5 mr-1" />
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-tasty-gold text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    {totalItems}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(255, 165, 0, 0.3), 0 0 20px rgba(255, 165, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 165, 0, 0.6), 0 0 30px rgba(255, 165, 0, 0.6);
          }
        }
        .animate-glow {
          animation: glow 2.5s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;
