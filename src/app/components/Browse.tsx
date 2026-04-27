import React, { useState, useEffect } from 'react';
import { User } from '../App';
import { Header } from './Header';
import { Footer } from './Footer';
import { useMockData, Resource as ResourceType } from '../utils/MockDataContext';
import { Search, Filter, FileText, Download, Star, ShoppingCart, X } from 'lucide-react';
import { ItemDetailsModal } from './ItemDetailsModal';

type BrowseProps = {
  user: User;
};

export function Browse({ user }: BrowseProps) {
  const mockData = useMockData();
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceType, setSelectedPriceType] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<ResourceType[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

  const categories = ['All', 'Previous Papers', 'Lecture Notes', 'Assignments', 'Study Guides', 'Books', 'Electronic Equipment'];
  const departments = ['All', 'Computer Science', 'Electrical Engineering', 'Mathematics', 'Physics', 'Chemistry'];

  useEffect(() => {
    fetchResources();
  }, [selectedCategory]);

  const fetchResources = () => {
    setLoading(true);
    const allResources = mockData.getResourcesByCategory(selectedCategory === 'All' ? undefined : selectedCategory);
    setResources(allResources);
    setLoading(false);
  };

  const addToCart = (resource: ResourceType) => {
    if (!cart.find(item => item.id === resource.id)) {
      setCart([...cart, resource]);
      mockData.addToCart(resource.id);
    }
  };

  const removeFromCart = (resourceId: string) => {
    setCart(cart.filter(item => item.id !== resourceId));
    mockData.removeFromCart(resourceId);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Calculate total cost
    let totalMoney = 0;
    let totalPoints = 0;

    cart.forEach(item => {
      if (item.priceType === 'money') {
        totalMoney += item.price;
      } else {
        totalPoints += item.price;
      }
    });

    // Check if user has enough balance
    const hasEnoughMoney = user.walletBalance >= totalMoney;
    const hasEnoughPoints = (user.rewardPoints || 0) >= totalPoints;

    if (!hasEnoughMoney || !hasEnoughPoints) {
      const moneyNeeded = Math.max(0, totalMoney - user.walletBalance);
      const pointsNeeded = Math.max(0, totalPoints - (user.rewardPoints || 0));
      
      let message = 'Insufficient balance!\n';
      if (moneyNeeded > 0) message += `\nNeed ৳${moneyNeeded} more in wallet.`;
      if (pointsNeeded > 0) message += `\nNeed ${pointsNeeded} more reward points.`;
      
      alert(message);
      return;
    }

    // Process the purchase
    try {
      mockData.purchaseFromCart('wallet', false);
      setCart([]);
      alert('Purchase successful! You can now access your resources.');
      setShowCart(false);
    } catch (error: any) {
      alert(error.message || 'Purchase failed. Please try again.');
    }
  };

  const filteredResources = resources.filter(resource => {
    // Search filter
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price type filter
    const matchesPriceType = selectedPriceType === 'All' || resource.priceType === selectedPriceType;
    
    // Department filter
    const matchesDepartment = selectedDepartment === 'All' || resource.department === selectedDepartment;
    
    // Course filter
    const matchesCourse = selectedCourse === 'All' || resource.course === selectedCourse;
    
    // Price range filter
    const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
    const matchesPriceRange = resource.price >= minPrice && resource.price <= maxPrice;

    return matchesSearch && matchesPriceType && matchesDepartment && matchesCourse && matchesPriceRange;
  });

  // Get unique courses from resources
  const courses = ['All', ...Array.from(new Set(resources.map(r => r.course).filter(Boolean)))];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-start justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white h-full w-full max-w-md shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Shopping Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{item.title}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                        <p className="font-semibold" style={{ color: '#E56E20' }}>
                          {item.price} {item.priceType === 'money' ? 'BDT' : 'Points'}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total:</span>
                      <span className="text-2xl font-bold" style={{ color: '#E56E20' }}>
                        {cart.reduce((sum, item) => sum + item.price, 0)} Points
                      </span>
                    </div>
                    <button
                      className="w-full py-3 rounded-lg text-white font-semibold"
                      style={{ backgroundColor: '#E56E20' }}
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h2 className="text-3xl font-bold mb-6">Browse Resources</h2>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for resources..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <Filter size={20} className="text-gray-500" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedCategory === category ? { backgroundColor: '#E56E20' } : {}}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm font-medium flex items-center gap-2"
            style={{ color: '#E56E20' }}
          >
            {showFilters ? 'Hide' : 'Show'} Advanced Filters
            <Filter size={16} />
          </button>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Type
                </label>
                <select
                  value={selectedPriceType}
                  onChange={(e) => setSelectedPriceType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                >
                  <option value="All">All Types</option>
                  <option value="money">Money (BDT)</option>
                  <option value="points">Points</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                >
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    placeholder="Min"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    placeholder="Max"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#E56E20' }}></div>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FileText size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No resources found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedResourceId(resource.id)}
              >
                <div className="h-2" style={{ backgroundColor: '#D4ECF7' }}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: '#E56E20' }}
                    >
                      {resource.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span>{resource.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{resource.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>by {resource.uploaderName}</span>
                    <div className="flex items-center gap-1">
                      <Download size={14} />
                      <span>{resource.downloads}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold" style={{ color: '#E56E20' }}>
                      {resource.price === 0 ? 'Free' : `${resource.price} ${resource.priceType === 'money' ? 'BDT' : 'Points'}`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(resource);
                      }}
                      className="px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-90"
                      style={{ backgroundColor: '#E56E20' }}
                    >
                      {resource.price === 0 ? 'Download' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Item Details Modal */}
      {selectedResourceId && (
        <ItemDetailsModal
          resourceId={selectedResourceId}
          onClose={() => setSelectedResourceId(null)}
          onAddToCart={() => {
            const resource = resources.find(r => r.id === selectedResourceId);
            if (resource) {
              addToCart(resource);
            }
          }}
        />
      )}

      <Footer />
    </div>
  );
}