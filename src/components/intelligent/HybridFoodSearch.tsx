import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  HeartIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { createHybridFoodService, type EnhancedFoodItem } from '../../lib/hybridFoodService';
import { createClient } from '../../lib/supabase';

interface HybridFoodSearchProps {
  onFoodSelect?: (food: EnhancedFoodItem) => void;
  onClose?: () => void;
}

export default function HybridFoodSearch({ onFoodSelect, onClose }: HybridFoodSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<EnhancedFoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<EnhancedFoodItem | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const supabase = createClient();
  const hybridService = createHybridFoodService(supabase);

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const timeoutId = setTimeout(async () => {
        setIsLoading(true);
        try {
          const results = await hybridService.searchFoods(searchQuery, 15);
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const getGutFriendlinessColor = (friendliness?: string) => {
    switch (friendliness) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-green-500 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'caution': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'avoid': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getGutFriendlinessIcon = (friendliness?: string) => {
    switch (friendliness) {
      case 'excellent':
      case 'good':
        return <HeartIcon className="w-4 h-4" />;
      case 'caution':
      case 'avoid':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <InformationCircleIcon className="w-4 h-4" />;
    }
  };

  const handleFoodSelect = (food: EnhancedFoodItem) => {
    setSelectedFood(food);
    onFoodSelect?.(food);
  };

  const renderFoodCard = (food: EnhancedFoodItem) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleFoodSelect(food)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{food.name}</h3>
            {food.brand && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {food.brand}
              </span>
            )}
          </div>
          
          {/* Data source indicator */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              food.source === 'openfoodfacts' ? 'bg-green-100 text-green-800' : 
              food.source === 'usda' ? 'bg-blue-100 text-blue-800' : 
              'bg-purple-100 text-purple-800'
            }`}>
              {food.source === 'openfoodfacts' ? 'Open Food Facts' : 
               food.source === 'usda' ? 'USDA' : 'Local DB'}
            </span>
            
            {food.gutData && (
              <span className={`text-xs px-2 py-1 rounded-full border ${getGutFriendlinessColor(food.gutData.gutFriendliness)}`}>
                <div className="flex items-center gap-1">
                  {getGutFriendlinessIcon(food.gutData.gutFriendliness)}
                  {food.gutData.gutFriendliness}
                </div>
              </span>
            )}
          </div>

          {/* Categories */}
          {food.categories.length > 0 && (
            <p className="text-sm text-gray-600 mb-2">
              {food.categories.slice(0, 2).join(', ')}
            </p>
          )}

          {/* Stoma-specific insights */}
          {food.gutData && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="font-medium">Digestibility:</span>
                <span className={`${
                  food.gutData.digestibilityScore >= 8 ? 'text-green-600' :
                  food.gutData.digestibilityScore >= 6 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {food.gutData.digestibilityScore}/10
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Gas:</span>
                <span className={`${
                  food.gutData.gasProduction === 'low' ? 'text-green-600' :
                  food.gutData.gasProduction === 'medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {food.gutData.gasProduction}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Fiber:</span>
                <span>{food.gutData.fiberContent}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">FODMAP:</span>
                <span>{food.gutData.fodmapLevel}</span>
              </div>
            </div>
          )}

          {/* Nutrition highlights */}
          {food.nutrition.calories && (
            <div className="mt-2 text-xs text-gray-600">
              <span className="font-medium">{Math.round(food.nutrition.calories)} cal/100g</span>
              {food.nutrition.protein && (
                <span className="ml-2">Protein: {food.nutrition.protein.toFixed(1)}g</span>
              )}
            </div>
          )}

          {/* Allergens warning */}
          {food.allergens.length > 0 && (
            <div className="mt-2 text-xs text-red-600">
              <span className="font-medium">Allergens:</span> {food.allergens.slice(0, 3).join(', ')}
            </div>
          )}
        </div>

        {/* Food image */}
        {food.image && (
          <img
            src={food.image}
            alt={food.name}
            className="w-16 h-16 object-cover rounded-lg ml-4"
          />
        )}
      </div>

      {/* Preparation tips */}
      {food.gutData?.preparationTips && food.gutData.preparationTips.length > 0 && (
        <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
          <span className="font-medium text-blue-800">Tips:</span>
          <span className="text-blue-700 ml-1">
            {food.gutData.preparationTips[0]}
            {food.gutData.preparationTips.length > 1 && ` +${food.gutData.preparationTips.length - 1} more`}
          </span>
        </div>
      )}

      {/* Triggers warning */}
      {food.gutData?.commonTriggers && food.gutData.commonTriggers.length > 0 && (
        <div className="mt-2 p-2 bg-red-50 rounded text-xs">
          <span className="font-medium text-red-800">Triggers:</span>
          <span className="text-red-700 ml-1">
            {food.gutData.commonTriggers.join(', ')}
          </span>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hybrid Food Search</h2>
          <p className="text-gray-600">
            Professional food data + stoma-specific insights
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Data Sources Info */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-gray-900 mb-2">🚀 Hybrid Approach</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Professional Data:</span>
            <p className="text-blue-700">Open Food Facts (3M+ products) + USDA nutrition data</p>
          </div>
          <div>
            <span className="font-medium text-green-800">Stoma Insights:</span>
            <p className="text-green-700">Digestibility, triggers, tips curated for stoma patients</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search foods (e.g., 'paneer curry', 'brown rice', 'chicken')..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Found {searchResults.length} foods
              </h3>
              <div className="text-sm text-gray-600">
                Sorted by stoma-friendliness
              </div>
            </div>
            
            <div className="grid gap-4">
              {searchResults.map((food, index) => (
                <div key={`${food.source}-${food.id}`}>
                  {renderFoodCard(food)}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      {searchQuery.length > 2 && !isLoading && searchResults.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No foods found for "{searchQuery}"</p>
          <p className="text-sm mt-2">Try searching for common names like "rice", "chicken", or "bread"</p>
        </div>
      )}

      {/* Search Suggestions */}
      {searchQuery.length === 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'White rice', 'Chicken breast', 'White bread', 'Bananas',
            'Pasta', 'Fish', 'Potatoes', 'Carrots',
            'Chapati', 'Dal', 'Paneer', 'Yogurt'
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setSearchQuery(suggestion)}
              className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
