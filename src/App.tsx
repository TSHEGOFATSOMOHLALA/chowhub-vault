import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Utensils, Star, Clock, MapPin, ShieldCheck, ShoppingBag, UserPlus, LogOut, X, Trash2 } from 'lucide-react';

// --- DATA: Restaurants with Prices ---
const RESTAURANTS = [
  { id: 1, name: "The Burger Vault", rating: 4.8, time: "15-20", price: 85, img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500" },
  { id: 2, name: "Neon Sushi Bar", rating: 4.9, time: "25-30", price: 120, img: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500" },
  { id: 3, name: "Pasta Lock-up", rating: 4.6, time: "20-25", price: 95, img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500" },
  { id: 4, name: "Secret Taco Club", rating: 4.7, time: "10-15", price: 70, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500" },
];

export default function App() {
  const [passcode, setPasscode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userPin, setUserPin] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // CART STATE: Now stores a list of items
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  useEffect(() => {
    const savedPin = localStorage.getItem('chowhub_pin');
    if (savedPin) {
      setUserPin(savedPin);
    } else {
      setIsRegistering(true);
    }
  }, []);

  const handleKeypad = (num: string) => {
    if (passcode.length < 4) {
      const newCode = passcode + num;
      setPasscode(newCode);
      if (newCode.length === 4) {
        if (isRegistering) {
          localStorage.setItem('chowhub_pin', newCode);
          setUserPin(newCode);
          setIsRegistering(false);
          setPasscode("");
        } else if (newCode === userPin) {
          setUnlocked(true);
        } else {
          setIsError(true);
          setTimeout(() => { setPasscode(""); setIsError(false); }, 800);
        }
      }
    }
  };

  const addToCart = (item: any) => {
    setCartItems([...cartItems, { ...item, cartId: Math.random() }]); // Add unique ID for removal
    setOrderMessage(`Added ${item.name} to vault!`);
    setTimeout(() => setOrderMessage(""), 2000);
  };

  const removeFromCart = (cartId: number) => {
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
  };

  const totalCost = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
      
      {/* 1. NOTIFICATION POPUP */}
      <AnimatePresence>
        {orderMessage && (
          <motion.div initial={{ y: -100 }} animate={{ y: 20 }} exit={{ y: -100 }} className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
            <div className="bg-orange-600 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold text-black italic">
              <ShieldCheck size={20} /> {orderMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN MARKETPLACE */}
      <main className={`p-6 max-w-6xl mx-auto transition-all duration-1000 ${unlocked ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <nav className="flex justify-between items-center mb-12 border-b border-neutral-800 pb-6">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-lg"><Utensils className="text-black" size={24} /></div>
            <h1 className="text-3xl font-black italic tracking-tighter">CHOWHUB</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* CLICKABLE CART ICON */}
            <button 
              onClick={() => setShowCart(true)}
              className="relative p-3 bg-neutral-900 rounded-2xl hover:bg-neutral-800 transition-colors border border-neutral-800 group"
            >
              <ShoppingBag size={24} className="group-hover:text-orange-500 transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-black text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#0a0a0a]">
                  {cartItems.length}
                </span>
              )}
            </button>
            <button onClick={() => setUnlocked(false)} className="p-3 bg-neutral-900 rounded-2xl hover:text-red-500 transition-all border border-neutral-800"><LogOut size={24} /></button>
          </div>
        </nav>

        <section>
          <h2 className="text-4xl font-bold mb-8">Unlocked Cravings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {RESTAURANTS.map((res) => (
              <div key={res.id} className="bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 group hover:shadow-[0_0_30px_rgba(234,88,12,0.1)] transition-all">
                <img src={res.img} className="w-full h-44 object-cover opacity-70 group-hover:opacity-100 transition-all" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold">{res.name}</h3>
                    <span className="text-orange-500 font-black italic">R{res.price}</span>
                  </div>
                  <div className="flex items-center text-neutral-500 text-xs mb-5 uppercase tracking-widest font-bold">⭐ {res.rating} • {res.time} min</div>
                  <button onClick={() => addToCart(res)} className="w-full bg-white text-black py-3 rounded-2xl font-black text-sm uppercase tracking-tighter hover:bg-orange-500 transition-colors">Add to Vault</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 3. ORDER SUMMARY (THE CART MODAL) */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-[110] flex items-center justify-end p-4">
            {/* Background Overlay */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCart(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            
            {/* Sidebar Content */}
            <motion.div initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }} className="relative bg-neutral-900 w-full max-w-md h-full rounded-[40px] shadow-2xl border-l border-white/10 p-8 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black italic">VAULT SUMMARY</h2>
                <button onClick={() => setShowCart(false)} className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"><X size={20}/></button>
              </div>

              {/* LIST OF ORDERED ITEMS */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-600 italic">
                    <ShoppingBag size={48} className="mb-4 opacity-20" />
                    <p>Your vault is empty.</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.cartId} className="bg-black/40 p-4 rounded-2xl flex items-center gap-4 border border-white/5">
                      <img src={item.img} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">{item.name}</h4>
                        <p className="text-orange-500 text-xs font-black">R{item.price}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.cartId)} className="p-2 text-neutral-600 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                    </div>
                  ))
                )}
              </div>

              {/* TOTALS SECTION */}
              {cartItems.length > 0 && (
                <div className="mt-8 border-t border-neutral-800 pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Total Value</span>
                    <span className="text-3xl font-black text-orange-500 italic">R{totalCost}</span>
                  </div>
                  <button 
                    onClick={() => { alert("ORDER AUTHORIZED! Dispatching drones..."); setCartItems([]); setShowCart(false); }}
                    className="w-full bg-orange-500 text-black py-4 rounded-3xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(234,88,12,0.3)]"
                  >
                    Authorize Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. THE VAULT DOOR (Login/Registration) */}
      <AnimatePresence>
        {!unlocked && (
          <motion.div exit={{ rotateY: -110, x: "-100%", opacity: 0, transition: { duration: 1.5 } }} style={{ transformOrigin: "left", perspective: "2000px" }} className="fixed inset-0 z-50 bg-[#121212] flex items-center justify-center border-r-[25px] border-black">
            <div className="flex flex-col items-center">
              <div className="mb-10 text-center">
                 <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-4 ${isRegistering ? 'bg-cyan-500' : 'bg-orange-600 shadow-[0_0_40px_rgba(234,88,12,0.3)]'}`}>
                    {isRegistering ? <UserPlus className="text-black" /> : <Lock className="text-black" />}
                 </div>
                 <h1 className="text-2xl font-black uppercase italic tracking-tighter">{isRegistering ? "Secure Your Account" : "Vault Access Control"}</h1>
                 <p className="text-neutral-600 text-[10px] mt-2 font-bold tracking-widest uppercase">Biometric Verification Level 4</p>
              </div>
              <div className="bg-black/60 p-8 rounded-[40px] border border-white/5 backdrop-blur-md">
                <div className={`mb-6 p-4 rounded-2xl bg-black border-2 flex justify-center ${isError ? 'border-red-500' : isRegistering ? 'border-cyan-500' : 'border-neutral-800'}`}>
                  <span className={`text-3xl font-mono tracking-[15px] ${isRegistering ? 'text-cyan-400' : 'text-orange-500'}`}>{passcode.padEnd(4, "•")}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "OK"].map((btn) => (
                    <button key={btn} onClick={() => btn === "C" ? setPasscode("") : btn === "OK" ? null : handleKeypad(btn.toString())} className="w-14 h-14 rounded-full bg-neutral-800 text-lg font-bold hover:bg-orange-500 transition-all active:scale-90">{btn}</button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}