import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, ShieldCheck, ShoppingBag, LogOut, X, Radio, Zap, Navigation } from 'lucide-react';

const RESTAURANTS = [
  { id: 1, name: "The Burger Vault", rating: 4.8, time: "15-20", price: 85, img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500" },
  { id: 2, name: "Neon Sushi Bar", rating: 4.9, time: "25-30", price: 120, img: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500" },
  { id: 3, name: "Pasta Lock-up", rating: 4.6, time: "20-25", price: 95, img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500" },
  { id: 4, name: "Secret Taco Club", rating: 4.7, time: "10-15", price: 70, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500" },
];

export default function App() {
  const [passcode, setPasscode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [userPin, setUserPin] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderStatus, setOrderStatus] = useState<"idle" | "preparing" | "shipping" | "delivered">("idle");

  useEffect(() => {
    const savedPin = localStorage.getItem('chowhub_pin');
    if (savedPin) {
      setUserPin(savedPin);
      setIsRegistering(false);
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
          // Visual feedback for wrong PIN
          setTimeout(() => setPasscode(""), 500);
        }
      }
    }
  };

  const startDelivery = () => {
    setOrderStatus("preparing");
    setTimeout(() => setOrderStatus("shipping"), 3000);
    setTimeout(() => setOrderStatus("delivered"), 7000);
    setTimeout(() => {
        setOrderStatus("idle");
        setCartItems([]);
        setShowCart(false);
    }, 10000);
  };

  const totalCost = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* --- DRONE DELIVERY TRACKING OVERLAY --- */}
      <AnimatePresence>
        {orderStatus !== "idle" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 text-center">
            <div className="max-w-sm w-full">
              <div className="relative w-32 h-32 mx-auto mb-8 text-orange-500">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="absolute inset-0 border-4 border-dashed border-orange-500 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {orderStatus === "preparing" && <Zap size={48} className="animate-pulse" />}
                  {orderStatus === "shipping" && <Navigation size={48} className="animate-bounce" />}
                  {orderStatus === "delivered" && <ShieldCheck size={48} />}
                </div>
              </div>
              <h2 className="text-2xl font-black italic uppercase mb-2 text-orange-500 tracking-widest">{orderStatus}</h2>
              <p className="text-neutral-500 text-sm mb-8 italic">ChowHub Autonomous Drone Dispatch</p>
              <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: orderStatus === "preparing" ? "30%" : orderStatus === "shipping" ? "70%" : "100%" }}
                    className="h-full bg-orange-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN MARKETPLACE --- */}
      <main className={`p-6 max-w-6xl mx-auto transition-all duration-1000 ${unlocked ? 'opacity-100 blur-0' : 'opacity-0 blur-xl pointer-events-none'}`}>
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center rotate-3"><Utensils className="text-black" /></div>
            <h1 className="text-3xl font-black tracking-tighter italic text-white">CHOWHUB.</h1>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowCart(true)} className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center relative border border-neutral-800">
              <ShoppingBag />
              {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-orange-500 text-black text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-4 border-[#050505]">{cartItems.length}</span>}
            </button>
            <button onClick={() => { setUnlocked(false); setPasscode(""); }} className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center border border-neutral-800"><LogOut size={20}/></button>
          </div>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {RESTAURANTS.map((res) => (
            <motion.div whileHover={{ y: -10 }} key={res.id} className="bg-[#111] rounded-[32px] p-2 border border-neutral-800">
              <img src={res.img} className="w-full h-48 rounded-[26px] object-cover mb-4" alt={res.name} />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1">{res.name}</h3>
                <p className="text-neutral-500 text-[10px] uppercase font-black tracking-widest mb-6">Secured Delivery • R{res.price}</p>
                <button onClick={() => setCartItems([...cartItems, res])} className="w-full bg-orange-500 text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all">Add to Vault</button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* --- THE VAULT ENTRY --- */}
      <AnimatePresence>
        {!unlocked && (
          <motion.div exit={{ scale: 2, opacity: 0, filter: "blur(20px)", transition: { duration: 1 } }} className="fixed inset-0 z-50 bg-[#080808] flex items-center justify-center overflow-hidden">
            <div className="relative flex flex-col items-center">
              <div className="relative w-80 h-80 flex items-center justify-center mb-12">
                <motion.div animate={{ rotate: passcode.length * 90 }} className="absolute inset-0 border-[12px] border-neutral-900 rounded-full" />
                <div className="text-center z-10">
                  <div className={`text-[10px] font-black tracking-[0.3em] mb-4 ${isRegistering ? 'text-cyan-500' : 'text-orange-500'}`}>
                    {isRegistering ? "SETUP MODE" : "IDENTITY REQ"}
                  </div>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div key={i} animate={passcode.length > i ? { scale: 1.2, backgroundColor: isRegistering ? "#06b6d4" : "#f97316" } : { scale: 1 }} className="w-4 h-4 rounded-sm bg-neutral-800 border border-white/10" />
                    ))}
                  </div>
                </div>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num, i) => {
                    const angle = (i * 36) - 90;
                    const x = Math.cos(angle * (Math.PI / 180)) * 130;
                    const y = Math.sin(angle * (Math.PI / 180)) * 130;
                    return (
                        <button key={num} onClick={() => handleKeypad(num.toString())} style={{ transform: `translate(${x}px, ${y}px)` }} className="absolute w-12 h-12 rounded-full bg-[#111] border border-white/5 text-sm font-bold hover:bg-white hover:text-black transition-all shadow-xl">{num}</button>
                    )
                })}
              </div>
              <div className="text-center max-w-xs px-6">
                <h2 className="text-3xl font-black italic tracking-tighter mb-4 uppercase underline decoration-orange-500 decoration-4 underline-offset-8">
                    {isRegistering ? "Create Pin" : "Vault Locked"}
                </h2>
                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">
                    {isRegistering ? "Tap the circular dial to set your 4-digit master code." : "Authorized personnel only. Please input code."}
                </p>
                <button onClick={() => setPasscode("")} className="mt-10 text-neutral-700 hover:text-white transition-colors uppercase text-[9px] font-black tracking-widest flex items-center gap-2 mx-auto">
                    <Radio size={14} className="animate-pulse" /> Reset Terminal
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CART SIDEBAR --- */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-[150] flex items-center justify-end p-4 bg-black/40 backdrop-blur-md">
            <motion.div initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }} className="bg-[#111] w-full max-w-md h-full rounded-[40px] border border-white/10 p-10 flex flex-col shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-black italic tracking-tighter">VAULT SUMMARY</h2>
                    <button onClick={() => setShowCart(false)} className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center"><X /></button>
                </div>
                <div className="flex-1 space-y-4 overflow-y-auto">
                    {cartItems.map((item, idx) => (
                        <div key={idx} className="bg-black/40 p-4 rounded-3xl flex items-center gap-4 border border-white/5">
                            <img src={item.img} className="w-16 h-16 rounded-2xl object-cover" alt={item.name} />
                            <div className="flex-1">
                                <h4 className="font-bold text-sm">{item.name}</h4>
                                <p className="text-orange-500 font-black italic text-xs">R{item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pt-10 border-t border-neutral-800">
                    <div className="flex justify-between text-2xl font-black italic mb-8">
                        <span>TOTAL</span>
                        <span className="text-orange-500 underline decoration-4 underline-offset-8">R{totalCost}</span>
                    </div>
                    <button onClick={startDelivery} className="w-full bg-white text-black py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-orange-500 transition-all">Initialize Delivery</button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}