import React, { useState } from 'react';
import { ChevronLeft, Check, Crown, Star, Zap, TrendingUp } from 'lucide-react';
import { User } from '../../App';
import { toast } from 'sonner@2.0.3';
import { Footer } from '../Footer';

type MembershipPageScreenProps = {
  user: User;
  onBack: () => void;
};

export function MembershipPageScreen({ user, onBack }: MembershipPageScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'Forever',
      features: [
        'Browse academic resources',
        'Upload up to 5 resources/month',
        'Basic search filters',
        'Standard support',
        'Download approved resources',
      ],
      icon: Star,
      color: '#6B7280',
    },
    {
      id: 'monthly',
      name: 'Premium Monthly',
      price: 299,
      period: 'Per Month',
      features: [
        'Unlimited uploads',
        'Priority approval for uploads',
        'Advanced search & filters',
        'Priority support',
        'Early access to new resources',
        '10% bonus on all earnings',
        'Exclusive member badge',
      ],
      icon: Zap,
      color: '#E56E20',
      popular: true,
    },
    {
      id: 'yearly',
      name: 'Premium Yearly',
      price: 2999,
      period: 'Per Year',
      savings: 'Save 16%',
      features: [
        'Everything in Monthly',
        '20% bonus on all earnings',
        'Free featured listings (2/month)',
        'Dedicated account manager',
        'Custom analytics dashboard',
        'API access (coming soon)',
        'Lifetime member badge',
      ],
      icon: Crown,
      color: '#8B5CF6',
      bestValue: true,
    },
  ];

  const handleSubscribe = () => {
    if (selectedPlan === 'free') {
      toast.info('You are already on the free plan');
      return;
    }

    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      toast.success(`Redirecting to payment for ${plan.name}...`);
      // In real app, would navigate to payment screen
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0D7C7' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={24} color="#E56E20" />
              </button>
              <h2 className="font-semibold text-gray-900 text-xl">Membership Plans</h2>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#E56E20' }}>
            Upgrade Your Experience
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs and unlock premium features to enhance your academic journey
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as any)}
                className={`relative bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all ${
                  isSelected 
                    ? 'ring-4 ring-offset-2 scale-105' 
                    : 'hover:shadow-xl'
                }`}
                style={isSelected ? { ringColor: plan.color } : {}}
              >
                {/* Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span
                      className="px-4 py-1 rounded-full text-white text-xs font-semibold shadow-md"
                      style={{ backgroundColor: plan.color }}
                    >
                      Most Popular
                    </span>
                  </div>
                )}
                {plan.bestValue && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span
                      className="px-4 py-1 rounded-full text-white text-xs font-semibold shadow-md"
                      style={{ backgroundColor: plan.color }}
                    >
                      Best Value
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${plan.color}20` }}
                  >
                    <Icon size={32} style={{ color: plan.color }} />
                  </div>
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>

                {/* Price */}
                <div className="text-center mb-2">
                  <span className="text-4xl font-bold" style={{ color: plan.color }}>
                    {plan.price === 0 ? 'Free' : `৳${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-500 text-sm block">{plan.period}</span>
                  )}
                </div>

                {/* Savings Badge */}
                {plan.savings && (
                  <div className="text-center mb-4">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                      {plan.savings}
                    </span>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check size={20} className="flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Select Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(plan.id as any);
                  }}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    isSelected
                      ? 'text-white shadow-lg'
                      : 'border-2 text-gray-700 hover:border-gray-400'
                  }`}
                  style={
                    isSelected
                      ? { backgroundColor: plan.color }
                      : { borderColor: '#D1D5DB' }
                  }
                >
                  {isSelected ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Why Go Premium?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: '#E5F3FF' }}
              >
                <TrendingUp size={24} style={{ color: '#3B82F6' }} />
              </div>
              <h4 className="font-semibold mb-2">Earn More</h4>
              <p className="text-sm text-gray-600">
                Get up to 20% bonus on all your resource earnings
              </p>
            </div>
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: '#FEF3E2' }}
              >
                <Zap size={24} style={{ color: '#E56E20' }} />
              </div>
              <h4 className="font-semibold mb-2">Priority Access</h4>
              <p className="text-sm text-gray-600">
                Get your uploads approved faster and access new features first
              </p>
            </div>
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: '#F3E8FF' }}
              >
                <Crown size={24} style={{ color: '#8B5CF6' }} />
              </div>
              <h4 className="font-semibold mb-2">Stand Out</h4>
              <p className="text-sm text-gray-600">
                Get exclusive badges and featured listings to boost visibility
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={handleSubscribe}
            className="px-12 py-4 rounded-lg text-white font-semibold text-lg shadow-lg hover:opacity-90 transition-all"
            style={{ backgroundColor: '#E56E20' }}
          >
            {selectedPlan === 'free' ? 'Continue with Free' : `Subscribe to ${plans.find(p => p.id === selectedPlan)?.name}`}
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Cancel anytime • No hidden fees • Secure payment
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}