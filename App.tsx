import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, User as UserIcon, Menu, X, Scissors, LayoutDashboard, 
  Users, Shirt, BarChart3, CreditCard, LogOut, Search, Filter, 
  ChevronRight, Star, Clock, CheckCircle, Package 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_WORKERS, MOCK_FABRICS } from './mockData';
import { User, Product, Order, Measurement, OrderItem, Role, Fabric } from './types';

// --- Contexts ---

interface CartContextType {
  items: OrderItem[];
  addToCart: (item: OrderItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface AuthContextType {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Global Hooks ---
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within a AuthProvider');
  return context;
};

// --- Shared Components ---

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' }> = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-secondary text-white hover:bg-yellow-700 focus:ring-secondary shadow-sm",
    secondary: "bg-primary text-white hover:bg-slate-700 focus:ring-primary shadow-sm",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-400",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};

const Badge: React.FC<{ children: React.ReactNode, variant?: 'success' | 'warning' | 'info' | 'default' }> = ({ children, variant = 'default' }) => {
  const variants = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800",
    default: "bg-gray-100 text-gray-800"
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// --- Layout Components ---

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <Scissors className="h-8 w-8 text-secondary mr-2" />
            <span className="text-xl font-serif font-bold text-primary tracking-wide">TailorCraft</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-secondary font-medium">Home</Link>
            <Link to="/shop" className="text-slate-600 hover:text-secondary font-medium">Shop</Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="text-secondary font-medium flex items-center">
                <LayoutDashboard className="w-4 h-4 mr-1" /> Dashboard
              </Link>
            )}
            
            <div className="flex items-center space-x-4 ml-4">
              <Link to="/cart" className="relative p-2 text-slate-400 hover:text-secondary transition-colors">
                <ShoppingBag className="w-6 h-6" />
                {items.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-secondary rounded-full">
                    {items.length}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-3 border-l pl-4 border-slate-200">
                  <div className="text-sm text-right hidden lg:block">
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.role}</p>
                  </div>
                  <Button variant="ghost" onClick={logout} className="p-2">
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <div className="space-x-2">
                   <Link to="/login"><Button variant="outline" className="text-sm">Login</Button></Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-400 hover:text-slate-500">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Home</Link>
            <Link to="/shop" className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Shop</Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="block px-3 py-2 text-base font-medium text-secondary hover:bg-slate-50 rounded-md">Dashboard</Link>
            )}
            <Link to="/cart" className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Cart ({items.length})</Link>
            {user ? (
              <button onClick={logout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md">Logout</button>
            ) : (
              <Link to="/login" className="block px-3 py-2 text-base font-medium text-secondary hover:bg-slate-50 rounded-md">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-primary text-slate-300 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <div className="flex items-center text-white mb-4">
          <Scissors className="h-6 w-6 text-secondary mr-2" />
          <span className="text-xl font-serif font-bold">TailorCraft</span>
        </div>
        <p className="text-sm leading-relaxed">
          Premium bespoke tailoring and ready-to-wear fashion. 
          Experience the perfect fit with our master tailors and exquisite fabrics.
        </p>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
        <ul className="space-y-2 text-sm">
          <li><Link to="/shop" className="hover:text-secondary">Collection</Link></li>
          <li><Link to="/shop" className="hover:text-secondary">Custom Tailoring</Link></li>
          <li><Link to="#" className="hover:text-secondary">Track Order</Link></li>
          <li><Link to="#" className="hover:text-secondary">Size Guide</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-4">Contact</h3>
        <ul className="space-y-2 text-sm">
          <li>123 Fashion Avenue, Design District</li>
          <li>New York, NY 10001</li>
          <li>+1 (555) 123-4567</li>
          <li>support@tailorcraft.com</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-700 text-center text-xs">
      &copy; 2023 TailorCraft Inc. All rights reserved.
    </div>
  </footer>
);

// --- Pages ---

// Helper Icons for Landing Page
const RulerIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>;
const TruckIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/></svg>;
const ShieldCheckIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>;

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();
  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.isCustomizable && (
          <span className="absolute top-2 right-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded">
            Customizable
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-primary group-hover:text-secondary truncate">{product.name}</h3>
        <p className="text-sm text-slate-500 mb-2">{product.category}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-slate-900">${product.price}</span>
          <Button variant="outline" className="text-xs px-2 py-1" onClick={() => navigate(`/product/${product.id}`)}>
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative bg-primary">
        <div className="absolute inset-0 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1600" alt="Tailor working" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
            Crafting Elegance,<br/> <span className="text-secondary">Tailored for You</span>
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-slate-300">
            Experience the luxury of bespoke clothing and curated ready-to-wear collections.
          </p>
          <div className="mt-10 flex gap-4">
            <Button onClick={() => navigate('/shop')} className="px-8 py-3 text-lg">Shop Collection</Button>
            <Button variant="outline" className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-primary" onClick={() => navigate('/shop')}>Custom Tailoring</Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: RulerIcon, title: "Perfect Fit Guarantee", desc: "Our AI-powered measurement tools ensure 100% accuracy." },
              { icon: TruckIcon, title: "Global Shipping", desc: "We deliver premium fashion to your doorstep, anywhere." },
              { icon: ShieldCheckIcon, title: "Premium Fabrics", desc: "Sourced from the finest mills in Italy and England." }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                <f.icon className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-bold text-primary mb-2">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Featured Products Preview */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ShopPage = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  const filtered = MOCK_PRODUCTS.filter(p => 
    (filter === 'All' || p.category === filter) && 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-serif font-bold text-primary">Shop Collection</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none w-full sm:w-64"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-secondary outline-none"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Suits">Suits</option>
              <option value="Shirts">Shirts</option>
              <option value="Pants">Pants</option>
              <option value="Blazers">Blazers</option>
            </select>
          </div>
        </div>
        
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = React.useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  
  const [customMode, setCustomMode] = useState(false);
  const [measurements, setMeasurements] = useState<Measurement>({ chest: 0, waist: 0, length: 0 });
  const [selectedFabric, setSelectedFabric] = useState('');

  if (!product) return <div>Product not found</div>;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      quantity: 1,
      price: product.price,
      isCustom: customMode,
      measurements: customMode ? measurements : undefined,
      selectedFabric: customMode ? selectedFabric : undefined
    });
    navigate('/cart');
  };

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 flex items-center">
           ← Back to Shop
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-slate-50 rounded-lg overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-serif font-bold text-primary">{product.name}</h1>
                <p className="text-2xl font-bold text-secondary">${product.price}</p>
              </div>
              <p className="text-slate-500 mt-2">{product.category}</p>
            </div>
            
            <p className="text-slate-600 leading-relaxed">{product.description}</p>
            
            <div className="border-t border-b border-slate-200 py-6 space-y-4">
              {product.isCustomizable && (
                <div className="flex items-center space-x-4 mb-6">
                  <button 
                    onClick={() => setCustomMode(false)}
                    className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${!customMode ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 text-slate-500'}`}
                  >
                    Standard Size
                  </button>
                  <button 
                    onClick={() => setCustomMode(true)}
                    className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${customMode ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 text-slate-500'}`}
                  >
                    Custom Tailoring
                  </button>
                </div>
              )}

              {customMode ? (
                <div className="space-y-4 bg-slate-50 p-6 rounded-lg animate-in fade-in">
                  <h3 className="font-semibold text-primary flex items-center"><Scissors className="w-4 h-4 mr-2" /> Custom Measurements</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500">Chest (in)</label>
                      <input type="number" className="w-full p-2 border rounded" onChange={e => setMeasurements({...measurements, chest: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500">Waist (in)</label>
                      <input type="number" className="w-full p-2 border rounded" onChange={e => setMeasurements({...measurements, waist: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500">Length (in)</label>
                      <input type="number" className="w-full p-2 border rounded" onChange={e => setMeasurements({...measurements, length: Number(e.target.value)})} />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="text-sm font-medium text-slate-700 block mb-2">Select Fabric</label>
                    <div className="grid grid-cols-3 gap-2">
                       {product.fabrics?.map(fid => {
                         const fabric = MOCK_FABRICS.find(f => f.id === fid);
                         if(!fabric) return null;
                         return (
                           <div 
                             key={fid} 
                             onClick={() => setSelectedFabric(fabric.name)}
                             className={`cursor-pointer border-2 rounded p-2 text-center text-xs hover:border-secondary ${selectedFabric === fabric.name ? 'border-secondary bg-white' : 'border-transparent bg-white'}`}
                           >
                             <img src={fabric.image} className="w-full h-12 object-cover rounded mb-1"/>
                             {fabric.name}
                           </div>
                         )
                       })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Select Size</label>
                  <div className="flex space-x-2">
                    {['S', 'M', 'L', 'XL'].map(size => (
                      <button key={size} className="w-12 h-12 rounded-full border border-slate-300 hover:border-secondary hover:text-secondary flex items-center justify-center font-medium">
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button onClick={handleAddToCart} className="w-full py-4 text-lg">
              Add to Cart - ${customMode ? product.price + 50 : product.price}
            </Button>
            <p className="text-center text-xs text-slate-400">Free shipping on orders over $200</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const { items, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-primary mb-8">Shopping Bag</h1>
        {items.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-sm">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-slate-600 mb-6">Your bag is empty.</p>
            <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm flex gap-4">
                   <div className="w-24 h-24 bg-slate-100 rounded-md flex-shrink-0 overflow-hidden">
                     {/* Placeholder image logic would go here */}
                     <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">Img</div>
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between">
                       <h3 className="font-semibold text-primary">{item.productName}</h3>
                       <button onClick={() => removeFromCart(idx)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                     </div>
                     <p className="text-sm text-slate-500">{item.isCustom ? 'Custom Tailored' : `Size: ${item.selectedSize}`}</p>
                     {item.isCustom && (
                       <div className="text-xs text-slate-400 mt-1">
                         Fabric: {item.selectedFabric} | Chest: {item.measurements?.chest}"
                       </div>
                     )}
                     <div className="mt-2 font-medium">${item.price}</div>
                   </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <div className="flex justify-between"><span>Subtotal</span><span>${cartTotal}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
                <span>Total</span><span>${cartTotal}</span>
              </div>
              <Button className="w-full">Proceed to Checkout</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') navigate('/admin');
      else navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <Scissors className="w-12 h-12 text-secondary mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-primary">Welcome Back</h2>
          <p className="text-slate-500">Sign in to your TailorCraft account</p>
        </div>
        <div className="space-y-4">
          <Button onClick={() => login('CUSTOMER')} variant="primary" className="w-full justify-center">
            Login as Customer
          </Button>
          <Button onClick={() => login('ADMIN')} variant="secondary" className="w-full justify-center">
            Login as Shop Owner (Admin)
          </Button>
          <Button onClick={() => login('WORKER')} variant="outline" className="w-full justify-center">
             Login as Worker
          </Button>
        </div>
        <div className="mt-6 text-center text-xs text-slate-400">
          This is a demo. No password required.
        </div>
      </div>
    </div>
  );
};

// --- Admin Dashboard Components ---

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  const menu = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Products', path: '/admin/products', icon: Shirt },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Workers', path: '/admin/workers', icon: Scissors },
    { label: 'Finance', path: '/admin/finance', icon: CreditCard },
  ];

  return (
    <div className="w-64 bg-primary text-slate-300 min-h-screen flex flex-col hidden md:flex">
      <div className="p-6 flex items-center text-white font-serif font-bold text-xl">
        <Scissors className="w-6 h-6 mr-2 text-secondary" /> TailorCraft
      </div>
      <div className="flex-1 px-4 space-y-2">
        {menu.map(item => (
          <div 
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${location.pathname === item.path ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-slate-700">
        <button onClick={logout} className="flex items-center text-slate-400 hover:text-white w-full px-4 py-2">
          <LogOut className="w-5 h-5 mr-3" /> Logout
        </button>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Revenue', value: '$12,450', icon: CreditCard, color: 'bg-green-500' },
          { label: 'Active Orders', value: '24', icon: ShoppingBag, color: 'bg-blue-500' },
          { label: 'Pending Production', value: '8', icon: Scissors, color: 'bg-amber-500' },
          { label: 'Total Customers', value: '1,203', icon: Users, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
            <div className={`p-4 rounded-full ${stat.color} bg-opacity-10 text-opacity-100 mr-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-4">Revenue Trend (Monthly)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{n:'Jan', v:4000}, {n:'Feb', v:3000}, {n:'Mar', v:5000}, {n:'Apr', v:4500}, {n:'May', v:6000}]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="n" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke="#b45309" strokeWidth={2} dot={{r:4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-4">Order Status Distribution</h3>
           <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{n:'Pending', v:5}, {n:'Processing', v:12}, {n:'Ready', v:8}, {n:'Delivered', v:20}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="n" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="v" fill="#1e293b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-700">Recent Orders</h3>
          <Button variant="outline" className="text-xs">View All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map(order => (
                <tr key={order.id} className="bg-white border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4">
                    <Badge variant={order.status === 'DELIVERED' ? 'success' : order.status === 'PROCESSING' ? 'info' : 'warning'}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">${order.totalAmount}</td>
                  <td className="px-6 py-4">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminWorkers = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Worker Management</h2>
        <Button>Add New Worker</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_WORKERS.map(worker => (
          <div key={worker.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-xl font-bold text-slate-600 mb-4">
              {worker.name.charAt(0)}
            </div>
            <h3 className="font-bold text-lg text-slate-900">{worker.name}</h3>
            <p className="text-secondary font-medium text-sm mb-4">{worker.role}</p>
            <div className="w-full grid grid-cols-2 gap-2 text-sm mb-4">
               <div className="bg-slate-50 p-2 rounded">
                 <div className="text-slate-400 text-xs">Active Tasks</div>
                 <div className="font-bold text-slate-800">{worker.activeOrders}</div>
               </div>
               <div className="bg-slate-50 p-2 rounded">
                 <div className="text-slate-400 text-xs">Rating</div>
                 <div className="font-bold text-slate-800">{worker.performanceRating} ★</div>
               </div>
            </div>
            <div className="w-full flex gap-2">
              <Button variant="outline" className="flex-1 text-xs">View Profile</Button>
              <Button variant="secondary" className="flex-1 text-xs">Assign Task</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- App Shell ---

const AppShell = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute && user?.role === 'ADMIN') {
    return (
      <div className="flex bg-slate-100 min-h-screen">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/workers" element={<AdminWorkers />} />
            {/* Other admin routes would go here */}
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Redirect unauthorized admin access */}
          <Route path="/admin/*" element={<Navigate to="/login" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// --- Main App Provider Structure ---

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);

  // Simple Auth Logic
  const login = (role: Role) => {
    // In a real app, this would hit the API
    if (role === 'ADMIN') setUser({ id: 'u1', name: 'Admin User', email: 'admin@tailorcraft.com', role: 'ADMIN' });
    else setUser({ id: 'u2', name: 'John Doe', email: 'john@example.com', role: 'CUSTOMER' });
  };
  const logout = () => setUser(null);

  // Cart Logic
  const addToCart = (item: OrderItem) => setCartItems([...cartItems, item]);
  const removeFromCart = (index: number) => setCartItems(cartItems.filter((_, i) => i !== index));
  const clearCart = () => setCartItems([]);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Router>
      <AuthContext.Provider value={{ user, login, logout }}>
        <CartContext.Provider value={{ items: cartItems, addToCart, removeFromCart, clearCart, cartTotal }}>
           <AppShell />
        </CartContext.Provider>
      </AuthContext.Provider>
    </Router>
  );
};

export default App;