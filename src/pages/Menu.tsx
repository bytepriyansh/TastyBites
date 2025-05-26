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
        console.log("Fetching menu items from Firestore...");
        const querySnapshot = await getDocs(collection(db, 'menuItems'));
        const items: MenuItem[] = [];

        querySnapshot.forEach((doc) => {
          console.log("Document ID:", doc.id);
          console.log("Document data:", doc.data());
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

        console.log("Fetched items:", items);
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-tasty-cream to-white">
      <Header />

      <section className="bg-hero-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            Welcome to TastyBites
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in">
            Delicious food delivered fresh to your door
          </p>
          <div className="glass-effect rounded-2xl p-6 max-w-md mx-auto">
            <p className="text-lg">🚚 Free delivery on orders over $25</p>
            <p className="text-sm mt-2 opacity-80">⏱️ Average delivery time: 25-30 minutes</p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${selectedCategory === category
                    ? 'bg-tasty-orange text-white shadow-lg'
                    : 'bg-white text-tasty-charcoal hover:bg-gray-50 border border-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-tasty-charcoal mb-8">
            Our Menu
          </h2>
          {filteredItems.length === 0 ? (
            <p className="text-center">No items found in this category</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <MenuItemCard item={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Menu;