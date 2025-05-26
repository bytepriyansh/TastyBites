import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MenuItemCard from '../components/MenuItemCard';
import { MenuItem } from '../contexts/CartContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';

const categories = ['All', 'Burgers', 'Pizza', 'Salads', 'Seafood', 'Mexican', 'Desserts', 'Pasta', 'BBQ'];

const Menu: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'menuItems'));
        const items: MenuItem[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            id: doc.id,
            name: data.name,
            description: data.description,
            price: data.price,
            image: data.imageUrl,
            category: data.category
          });
        });

        setMenuItems(items);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tasty-cream to-white flex flex-col">
        <Header />
        <div className="container mx-auto px-4 flex flex-col items-center justify-center flex-grow py-20">
          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-tasty-orange animate-pulse shadow-lg shadow-yellow-500/50"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-70 animate-shimmer"></div>
          </div>
          <p className="mt-8 text-yellow-700 text-3xl font-semibold tracking-wide drop-shadow-lg animate-pulse">
            Loading menu items...
          </p>
        </div>

        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shimmer {
            background-size: 200% 100%;
            animation: shimmer 2.5s infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tasty-cream to-white font-sans">
      <Header />

      <section className="bg-gradient-to-r from-tasty-orange via-yellow-400 to-tasty-orange-dark text-white py-20 rounded-b-[3rem] shadow-xl animate-fade-in">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-xl mb-4 tracking-tight">
            Welcome to TastyBites
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in">
            Delicious food delivered fresh to your door
          </p>
          <div className="glass-effect rounded-2xl p-6 max-w-md mx-auto backdrop-blur-lg bg-white/20 border border-white/30">
            <p className="text-lg">🚚 Free delivery on orders over $25</p>
            <p className="text-sm mt-2 opacity-80">⏱️ Average delivery time: 25-30 minutes</p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold shadow transition-all duration-200 hover:scale-105 ${selectedCategory === category
                  ? 'bg-tasty-orange text-white shadow-lg'
                  : 'bg-white text-tasty-charcoal hover:bg-orange-100 border border-tasty-orange/40'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-tasty-charcoal mb-12 animate-fade-in">
            Our Menu
          </h2>
          {filteredItems.length === 0 ? (
            <p className="text-center text-lg text-tasty-charcoal/80">No items found in this category</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in-up rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <MenuItemCard item={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in 0.4s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Menu;