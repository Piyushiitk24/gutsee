import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, SparklesIcon, CameraIcon, MicrophoneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { foodSearchService, type FoodItem } from '../../lib/foodAPIs';

interface LogEntry {
  type: 'meal' | 'output' | 'gas' | 'irrigation';
  content: string;
  timestamp: Date;
  confidence?: number;
  foods?: FoodItem[];
}

interface EnhancedSmartEntryLoggerProps {
  onEntryCreated?: (entry: LogEntry) => void;
}

export default function EnhancedSmartEntryLoggerV2({ onEntryCreated }: EnhancedSmartEntryLoggerProps) {
  const [activeMode, setActiveMode] = useState<'ai' | 'search' | 'barcode' | 'voice'>('search');
  const [inputText, setInputText] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchSources, setSearchSources] = useState({
    openFoodFacts: true,
    usda: true,
    spoonacular: false, // Disabled by default since it requires paid API key
    local: true
  });

  // Debounced search for real-time results
  useEffect(() => {
    if (activeMode === 'search' && inputText.trim()) {
      const timeoutId = setTimeout(async () => {
        setIsLoading(true);
        try {
          const sources = Object.entries(searchSources)
            .filter(([_, enabled]) => enabled)
            .map(([source, _]) => source === 'openFoodFacts' ? 'openfoodfacts' : 
                                   source === 'local' ? 'local' : 
                                   source as any);

          const { combined } = await foodSearchService.searchFood(inputText, {
            sources: sources as any,
            limit: 10
          });
          
          setSearchResults(combined);
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
  }, [inputText, activeMode, searchSources]);

  const handleFoodSelect = (food: FoodItem) => {
    if (!selectedFoods.find(f => f.id === food.id)) {
      setSelectedFoods(prev => [...prev, food]);
    }
    setInputText('');
    setSearchResults([]);
  };

  const removeFoodItem = (foodId: string) => {
    setSelectedFoods(prev => prev.filter(f => f.id !== foodId));
  };

  const createEntry = () => {
    if (selectedFoods.length === 0) return;

    const entry: LogEntry = {
      type: 'meal',
      content: selectedFoods.map(f => f.name).join(', '),
      timestamp: new Date(),
      foods: selectedFoods,
      confidence: 1.0
    };

    onEntryCreated?.(entry);
    setSelectedFoods([]);
    setInputText('');
  };

  const handleBarcodeSearch = async (barcode: string) => {
    setIsLoading(true);
    try {
      const product = await foodSearchService.getProductByBarcode(barcode);
      if (product) {
        handleFoodSelect(product);
      }
    } catch (error) {
      console.error('Barcode search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Smart Food Logger</h2>
        <p className="text-gray-600">
          Search from 3+ million foods worldwide using professional food databases
        </p>
      </div>

      {/* Mode Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { mode: 'search', icon: MagnifyingGlassIcon, label: 'Search Foods' },
          { mode: 'ai', icon: SparklesIcon, label: 'AI Parse' },
          { mode: 'barcode', icon: CameraIcon, label: 'Barcode' },
          { mode: 'voice', icon: MicrophoneIcon, label: 'Voice' },
        ].map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeMode === mode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Data Source Selection */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Data Sources</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'openFoodFacts', label: 'Open Food Facts (3M+ products)', free: true },
            { key: 'usda', label: 'USDA FoodData (600K+ foods)', free: true },
            { key: 'local', label: 'Local Indian Foods', free: true },
            { key: 'spoonacular', label: 'Spoonacular (Premium)', free: false },
          ].map(({ key, label, free }) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={searchSources[key as keyof typeof searchSources]}
                onChange={(e) => setSearchSources(prev => ({ ...prev, [key]: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className={free ? 'text-green-700' : 'text-orange-700'}>
                {label} {free && '(FREE)'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            activeMode === 'search' ? 'Search for foods (e.g., "paneer butter masala", "quinoa", "chicken")...' :
            activeMode === 'ai' ? 'Describe what you ate (e.g., "Had 2 rotis with dal and rice")...' :
            activeMode === 'barcode' ? 'Enter barcode number...' :
            'Voice input coming soon...'
          }
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={activeMode === 'voice'}
        />
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {searchResults.length > 0 && activeMode === 'search' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 max-h-96 overflow-y-auto"
          >
            <h3 className="text-lg font-semibold mb-3">Search Results</h3>
            <div className="space-y-2">
              {searchResults.map((food, index) => (
                <motion.div
                  key={`${food.source}-${food.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleFoodSelect(food)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{food.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          food.source === 'openfoodfacts' ? 'bg-green-100 text-green-800' :
                          food.source === 'usda' ? 'bg-blue-100 text-blue-800' :
                          food.source === 'local' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {food.source === 'openfoodfacts' ? 'Open Food Facts' :
                           food.source === 'usda' ? 'USDA' :
                           food.source === 'local' ? 'Local DB' : 'Spoonacular'}
                        </span>
                      </div>
                      {food.brand && (
                        <p className="text-sm text-gray-600 mt-1">Brand: {food.brand}</p>
                      )}
                      {food.categories.length > 0 && (
                        <p className="text-sm text-gray-500">
                          Category: {food.categories.slice(0, 2).join(', ')}
                        </p>
                      )}
                      {food.nutrition.calories && (
                        <p className="text-sm text-green-600 mt-1">
                          {Math.round(food.nutrition.calories)} cal/100g
                        </p>
                      )}
                      {food.allergens.length > 0 && (
                        <p className="text-sm text-red-600 mt-1">
                          Allergens: {food.allergens.slice(0, 3).join(', ')}
                        </p>
                      )}
                    </div>
                    {food.image && (
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-16 h-16 object-cover rounded-lg ml-4"
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Foods */}
      {selectedFoods.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Selected Foods</h3>
          <div className="flex flex-wrap gap-2">
            {selectedFoods.map((food) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-full"
              >
                <span className="text-sm font-medium">{food.name}</span>
                <button
                  onClick={() => removeFoodItem(food.id)}
                  className="p-1 hover:bg-blue-200 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={createEntry}
          disabled={selectedFoods.length === 0}
          className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Log Entry ({selectedFoods.length} items)
        </button>
        <button
          onClick={() => {
            setSelectedFoods([]);
            setInputText('');
            setSearchResults([]);
          }}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* API Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Professional Food Database APIs</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>✅ <strong>Open Food Facts:</strong> 3+ million products, completely free, excellent Indian food coverage</p>
          <p>✅ <strong>USDA FoodData Central:</strong> 600K+ foods, free government data, research-grade accuracy</p>
          <p>✅ <strong>Local Database:</strong> Curated Indian foods for quick access</p>
          <p>⭐ <strong>Spoonacular:</strong> Premium API with advanced features (requires API key)</p>
        </div>
      </div>
    </div>
  );
}
