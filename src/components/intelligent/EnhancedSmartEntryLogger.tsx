'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MicrophoneIcon, 
  SparklesIcon, 
  ClockIcon, 
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { createHybridFoodService, type EnhancedFoodItem } from '@/lib/hybridFoodService';
import { createClient } from '@/lib/supabase';

interface ParsedEntry {
  foods: Array<{
    item: string;
    amount?: string;
    match?: EnhancedFoodItem;
    confidence: 'high' | 'medium' | 'low';
  }>;
  symptoms: Array<{
    type: string;
    severity?: string;
    timing?: string;
  }>;
  outputs: Array<{
    type: string;
    volume?: string;
    consistency?: string;
    timing?: string;
  }>;
  timing: string;
  notes: string;
  suggestedMealType?: string;
}

interface SelectedFood {
  food: EnhancedFoodItem;
  amount: string;
  unit: string;
}

interface SmartEntryLoggerProps {
  onEntriesLogged?: (entries: any[]) => void;
  onClose?: () => void;
}

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack', 'drinks'] as const;

function suggestMealType(timeString: string): string {
  const hour = parseInt(timeString.split(':')[0]);
  if (hour >= 5 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 16) return 'lunch';
  if (hour >= 16 && hour < 21) return 'dinner';
  return 'snack';
}

export default function SmartEntryLogger({ onEntriesLogged, onClose }: SmartEntryLoggerProps) {
  // Input states
  const [inputMode, setInputMode] = useState<'natural' | 'traditional'>('natural');
  const [naturalText, setNaturalText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Traditional mode states
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [mealTime, setMealTime] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [foodSearch, setFoodSearch] = useState('');
  const [searchResults, setSearchResults] = useState<EnhancedFoodItem[]>([]);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Parsed data state
  const [parsedData, setParsedData] = useState<ParsedEntry | null>(null);
  const [showParsedData, setShowParsedData] = useState(false);

  // Initialize services
  const supabase = createClient();
  const hybridService = createHybridFoodService(supabase);

  // Auto-suggest meal type based on current time
  useEffect(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setMealTime(currentTime);
    setSelectedMealType(suggestMealType(currentTime));
  }, []);

  // Professional food search functionality
  useEffect(() => {
    if (foodSearch.length > 2) {
      const timeoutId = setTimeout(async () => {
        setIsSearching(true);
        try {
          const results = await hybridService.searchFoods(foodSearch, 10);
          setSearchResults(results);
          console.log('Hybrid search results:', results.length, 'foods found');
        } catch (error) {
          console.error('Food search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [foodSearch]);

  // Voice recording functionality
  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Start voice recording using Web Speech API
      if ('webkitSpeechRecognition' in window) {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setNaturalText(transcript);
          setIsListening(false);
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.start();
      } else {
        // Fallback for browsers without speech recognition
        setIsListening(false);
        alert('Speech recognition not supported in this browser');
      }
    }
  };

  // Enhanced AI parsing with real API call
  const handleProcessNaturalLanguage = async () => {
    if (!naturalText.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Try real API first
      const response = await fetch('/api/ai/parse-multi-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: naturalText,
          timestamp: new Date(`${mealTime.split('T')[0] || new Date().toISOString().split('T')[0]}T${mealTime.split('T')[1] || '12:00:00'}`).toISOString()
        })
      });

      if (response.ok) {
        const apiResult = await response.json();
        if (apiResult.success && apiResult.data) {
          // Convert API result to our ParsedEntry format
          const convertedData: ParsedEntry = {
            foods: apiResult.data.entries
              .filter((entry: any) => ['breakfast', 'lunch', 'dinner', 'snack', 'drinks'].includes(entry.type))
              .map((entry: any) => ({
                item: entry.description,
                amount: entry.details?.quantity || '1 serving',
                confidence: entry.confidence > 0.8 ? 'high' : entry.confidence > 0.5 ? 'medium' : 'low' as const
              })),
            symptoms: apiResult.data.entries
              .filter((entry: any) => entry.type === 'symptoms')
              .map((entry: any) => ({
                type: entry.description,
                severity: entry.details?.severity || 'medium',
                timing: 'during meal'
              })),
            outputs: apiResult.data.entries
              .filter((entry: any) => ['irrigation', 'gas', 'output'].includes(entry.type))
              .map((entry: any) => ({
                type: entry.type,
                volume: entry.details?.volume || 'normal',
                consistency: entry.details?.consistency || 'normal',
                timing: 'after meal'
              })),
            timing: mealTime,
            notes: naturalText,
            suggestedMealType: apiResult.data.entries.find((e: any) => 
              ['breakfast', 'lunch', 'dinner'].includes(e.type)
            )?.type || suggestMealType(mealTime)
          };
          
          setParsedData(convertedData);
          setShowParsedData(true);
          console.log('Real AI parsing successful:', convertedData);
        } else {
          throw new Error('API returned no data');
        }
      } else {
        throw new Error(`API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Real API failed, using local parsing:', error);
      
      // Fallback to local parsing
      try {
        const localResult = await simulateAIParsing(naturalText);
        setParsedData(localResult);
        setShowParsedData(true);
        console.log('Local parsing successful:', localResult);
      } catch (localError) {
        console.error('Local parsing also failed:', localError);
        alert('Failed to parse entry. Please try again or use traditional mode.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Enhanced local AI simulation
  const simulateAIParsing = async (text: string): Promise<ParsedEntry> => {
    const lowerText = text.toLowerCase();
    
    // Extract timing with better patterns
    const timePatterns = [
      /(\d{1,2}):(\d{2})\s*(am|pm)?/i,
      /(\d{1,2})\s*(am|pm)/i,
      /(\d{1,2})\.(\d{2})\s*(am|pm)?/i,
      /(morning|afternoon|evening|night)/i
    ];
    
    let timing = mealTime;
    for (const pattern of timePatterns) {
      const match = text.match(pattern);
      if (match) {
        timing = match[0];
        break;
      }
    }
    
    // Suggest meal type based on timing or content
    let suggestedMealType = suggestMealType(timing);
    if (lowerText.includes('breakfast') || lowerText.includes('morning')) suggestedMealType = 'breakfast';
    if (lowerText.includes('lunch') || lowerText.includes('afternoon')) suggestedMealType = 'lunch';
    if (lowerText.includes('dinner') || lowerText.includes('evening')) suggestedMealType = 'dinner';
    if (lowerText.includes('snack')) suggestedMealType = 'snack';
    
    // Enhanced food extraction using hybrid search
    const foods: ParsedEntry['foods'] = [];
    
    // Split text into potential food items
    const words = text.split(/[,\s]+/);
    const foodCombinations = [];
    
    // Check single words and combinations
    for (let i = 0; i < words.length; i++) {
      foodCombinations.push(words[i]);
      if (i < words.length - 1) {
        foodCombinations.push(`${words[i]} ${words[i + 1]}`);
      }
      if (i < words.length - 2) {
        foodCombinations.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
      }
    }
    
    // Use hybrid search for better food matching
    const foundFoods = new Set<string>();
    for (const combo of foodCombinations) {
      if (combo.length > 2) {
        try {
          const searchResults = await hybridService.searchFoods(combo, 3);
          if (searchResults.length > 0 && !foundFoods.has(searchResults[0].id)) {
            foundFoods.add(searchResults[0].id);
            foods.push({
              item: searchResults[0].name,
              match: searchResults[0],
              confidence: 'high'
            });
          }
        } catch (error) {
          console.warn('Hybrid search failed for:', combo);
        }
      }
    }
    
    // Extract amounts
    const amountPatterns = [
      /(\d+)\s*(cups?|tablespoons?|teaspoons?|ounces?|slices?|pieces?)/gi,
      /(\d+)\s*(small|medium|large)/gi,
      /(half|quarter|whole)/gi
    ];
    
    for (const food of foods) {
      for (const pattern of amountPatterns) {
        const match = text.match(pattern);
        if (match) {
          food.amount = match[0];
          break;
        }
      }
    }
    
    // Extract symptoms with timing
    const symptoms: ParsedEntry['symptoms'] = [];
    const symptomPatterns = [
      { pattern: /(gas|gassy|bloat|bloated)/i, type: 'gas' },
      { pattern: /(pain|cramp|cramping)/i, type: 'abdominal pain' },
      { pattern: /(nausea|nauseous|sick)/i, type: 'nausea' },
      { pattern: /(heartburn|reflux)/i, type: 'heartburn' },
      { pattern: /(diarrhea|loose)/i, type: 'diarrhea' },
      { pattern: /(constipat|backed up)/i, type: 'constipation' }
    ];
    
    for (const { pattern, type } of symptomPatterns) {
      if (pattern.test(text)) {
        const severityMatch = text.match(/(mild|moderate|severe|slight|bad|terrible)/i);
        const timingMatch = text.match(/(\d+)\s*(hours?|minutes?)\s*(after|later)/i);
        
        symptoms.push({
          type,
          severity: severityMatch ? severityMatch[1].toLowerCase() : 'mild',
          timing: timingMatch ? timingMatch[0] : undefined
        });
      }
    }
    
    // Extract outputs
    const outputs: ParsedEntry['outputs'] = [];
    const outputPatterns = [
      { pattern: /(output|stool|bowel movement)/i, type: 'bowel movement' },
      { pattern: /(loose|liquid|watery)/i, type: 'loose stool' },
      { pattern: /(normal|formed|solid)/i, type: 'normal stool' },
      { pattern: /(changed.*pouch|emptied.*bag)/i, type: 'pouch change' }
    ];
    
    for (const { pattern, type } of outputPatterns) {
      if (pattern.test(text)) {
        const volumeMatch = text.match(/(small|medium|large|full)/i);
        const consistencyMatch = text.match(/(liquid|soft|formed|hard)/i);
        
        outputs.push({
          type,
          volume: volumeMatch ? volumeMatch[1] : undefined,
          consistency: consistencyMatch ? consistencyMatch[1] : undefined
        });
      }
    }
    
    return {
      foods,
      symptoms,
      outputs,
      timing,
      notes: text,
      suggestedMealType
    };
  };

  // Add food to traditional mode
  const addFoodToMeal = (food: EnhancedFoodItem) => {
    setSelectedFoods([...selectedFoods, {
      food,
      amount: '1',
      unit: 'serving'
    }]);
    setFoodSearch('');
    setShowFoodSearch(false);
  };

  // Remove food from traditional mode
  const removeFoodFromMeal = (index: number) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index));
  };

  // Update food amount
  const updateFoodAmount = (index: number, amount: string, unit: string) => {
    const updated = [...selectedFoods];
    updated[index] = { ...updated[index], amount, unit };
    setSelectedFoods(updated);
  };

  // Save entry
  const saveEntry = async () => {
    if (inputMode === 'natural' && parsedData) {
      // For AI-parsed entries, create individual entries for each detected item
      const entries = [];
      
      // Add food entries
      for (const food of parsedData.foods) {
        entries.push({
          type: parsedData.suggestedMealType || 'snack',
          description: `${food.item}${food.amount ? ' - ' + food.amount : ''}`,
          timestamp: new Date(`${new Date().toISOString().split('T')[0]}T${parsedData.timing || mealTime}`).toISOString(),
          confidence: food.confidence === 'high' ? 1.0 : food.confidence === 'medium' ? 0.7 : 0.5
        });
      }
      
      // Add symptom entries
      for (const symptom of parsedData.symptoms) {
        entries.push({
          type: 'symptoms',
          description: `${symptom.type}${symptom.severity ? ' - ' + symptom.severity + ' severity' : ''}`,
          timestamp: new Date(`${new Date().toISOString().split('T')[0]}T${parsedData.timing || mealTime}`).toISOString(),
          confidence: 0.8
        });
      }
      
      // Add output entries
      for (const output of parsedData.outputs) {
        entries.push({
          type: output.type,
          description: `${output.type}${output.volume ? ' - ' + output.volume + ' volume' : ''}${output.consistency ? ', ' + output.consistency + ' consistency' : ''}`,
          timestamp: new Date(`${new Date().toISOString().split('T')[0]}T${parsedData.timing || mealTime}`).toISOString(),
          confidence: 0.9
        });
      }
      
      console.log('Saving AI-parsed entries:', entries);
      
      if (onEntriesLogged) {
        onEntriesLogged(entries);
      }
      
    } else if (inputMode === 'traditional' && selectedFoods.length > 0) {
      // For traditional entries, create a single meal entry
      const entries = [{
        type: selectedMealType,
        description: selectedFoods.map(sf => `${sf.food.name} - ${sf.amount} ${sf.unit}`).join(', ') + 
                     (notes ? ` (Notes: ${notes})` : ''),
        timestamp: new Date(`${new Date().toISOString().split('T')[0]}T${mealTime}`).toISOString(),
        confidence: 1.0
      }];
      
      console.log('Saving traditional entries:', entries);
      
      if (onEntriesLogged) {
        onEntriesLogged(entries);
      }
      
    } else {
      alert('Please add some food items before saving.');
      return;
    }
    
    // Reset form
    setNaturalText('');
    setParsedData(null);
    setShowParsedData(false);
    setSelectedFoods([]);
    setNotes('');
    
    // Close the modal after saving
    if (onClose) {
      onClose();
    }
    
    alert('Entry saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <SparklesIcon className="h-8 w-8 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Smart Entry Logger</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setInputMode('natural')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            inputMode === 'natural'
              ? 'bg-purple-600 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <SparklesIcon className="h-5 w-5 inline mr-2" />
          Natural Language (AI)
        </button>
        <button
          onClick={() => setInputMode('traditional')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            inputMode === 'traditional'
              ? 'bg-purple-600 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <MagnifyingGlassIcon className="h-5 w-5 inline mr-2" />
          Traditional (Database)
        </button>
      </div>

      {/* Natural Language Mode */}
      {inputMode === 'natural' && (
        <div className="space-y-6">
          <div>
            <label className="block text-white/90 font-medium mb-3">
              Tell me what you ate and how you feel:
            </label>
            <div className="relative">
              <textarea
                value={naturalText}
                onChange={(e) => setNaturalText(e.target.value)}
                placeholder="Example: I had a turkey sandwich with cheddar cheese and tomato for lunch at 1pm, felt some gas 2 hours later"
                className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  onClick={toggleListening}
                  disabled={isProcessing}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <MicrophoneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleProcessNaturalLanguage}
            disabled={!naturalText.trim() || isProcessing}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Parsing with AI...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <SparklesIcon className="h-5 w-5" />
                Parse with AI
              </span>
            )}
          </button>

          {/* Parsed Results */}
          <AnimatePresence>
            {showParsedData && parsedData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-green-400" />
                  Parsed Results
                </h3>

                {/* Meal Type & Timing */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Meal Type</label>
                    <select
                      value={parsedData.suggestedMealType || ''}
                      onChange={(e) => setParsedData({
                        ...parsedData,
                        suggestedMealType: e.target.value
                      })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                    >
                      {MEAL_TYPES.map(type => (
                        <option key={type} value={type} className="bg-slate-800">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Time</label>
                    <input
                      type="time"
                      value={parsedData.timing}
                      onChange={(e) => setParsedData({
                        ...parsedData,
                        timing: e.target.value
                      })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                    />
                  </div>
                </div>

                {/* Foods */}
                {parsedData.foods.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Foods Detected:</h4>
                    <div className="space-y-2">
                      {parsedData.foods.map((food, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              food.confidence === 'high' ? 'bg-green-400' :
                              food.confidence === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                            }`}></div>
                            <div>
                              <p className="text-white font-medium">{food.item}</p>
                              {food.match && (
                                <p className="text-white/60 text-sm">
                                  {food.match.categories[0] || 'Food'} • {food.match.stomaData?.fodmapLevel?.toUpperCase() || 'Unknown'} FODMAP
                                </p>
                              )}
                              {food.amount && (
                                <p className="text-white/60 text-sm">Amount: {food.amount}</p>
                              )}
                            </div>
                          </div>
                          {food.match?.stomaData?.commonTriggers && food.match.stomaData.commonTriggers.length > 0 && (
                            <div className="text-orange-400">
                              <ExclamationTriangleIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Symptoms */}
                {parsedData.symptoms.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Symptoms Detected:</h4>
                    <div className="space-y-2">
                      {parsedData.symptoms.map((symptom, index) => (
                        <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <p className="text-red-200 font-medium">{symptom.type}</p>
                          {symptom.severity && (
                            <p className="text-red-200/70 text-sm">Severity: {symptom.severity}</p>
                          )}
                          {symptom.timing && (
                            <p className="text-red-200/70 text-sm">Timing: {symptom.timing}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outputs */}
                {parsedData.outputs.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Outputs Detected:</h4>
                    <div className="space-y-2">
                      {parsedData.outputs.map((output, index) => (
                        <div key={index} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <p className="text-blue-200 font-medium">{output.type}</p>
                          {output.volume && (
                            <p className="text-blue-200/70 text-sm">Volume: {output.volume}</p>
                          )}
                          {output.consistency && (
                            <p className="text-blue-200/70 text-sm">Consistency: {output.consistency}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Traditional Mode */}
      {inputMode === 'traditional' && (
        <div className="space-y-6">
          {/* Meal Type & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/90 font-medium mb-2">Meal Type</label>
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                {MEAL_TYPES.map(type => (
                  <option key={type} value={type} className="bg-slate-800">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/90 font-medium mb-2">Time</label>
              <input
                type="time"
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Food Search */}
          <div>
            <label className="block text-white/90 font-medium mb-2">Add Foods</label>
            <div className="relative">
              <input
                type="text"
                value={foodSearch}
                onChange={(e) => {
                  setFoodSearch(e.target.value);
                  setShowFoodSearch(true);
                }}
                onFocus={() => setShowFoodSearch(true)}
                placeholder="Search from 3+ million foods (e.g., 'masala chai', 'quinoa salad', 'pasta')"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <MagnifyingGlassIcon className="absolute right-3 top-3 h-6 w-6 text-white/50" />
              {isSearching && (
                <div className="absolute right-10 top-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/50"></div>
                </div>
              )}
            </div>

            {/* Search Results */}
            <AnimatePresence>
              {showFoodSearch && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-1 bg-slate-800/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                >
                  {searchResults.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => {
                        console.log('Adding food to meal:', food);
                        addFoodToMeal(food);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{food.name}</p>
                          <p className="text-white/60 text-sm">
                            {food.categories[0] || 'Food'} • {food.stomaData?.fodmapLevel?.toUpperCase() || 'Unknown'} FODMAP
                          </p>
                          {food.brand && (
                            <p className="text-white/50 text-xs">Brand: {food.brand}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {food.stomaData?.stomaFriendliness && (
                            <div className={`w-3 h-3 rounded-full ${
                              food.stomaData.stomaFriendliness === 'excellent' ? 'bg-green-400' :
                              food.stomaData.stomaFriendliness === 'good' ? 'bg-blue-400' :
                              food.stomaData.stomaFriendliness === 'moderate' ? 'bg-yellow-400' :
                              food.stomaData.stomaFriendliness === 'caution' ? 'bg-orange-400' : 'bg-red-400'
                            }`}></div>
                          )}
                          {food.stomaData?.commonTriggers && food.stomaData.commonTriggers.length > 0 && (
                            <ExclamationTriangleIcon className="h-5 w-5 text-orange-400" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
              {/* Search status */}
              {showFoodSearch && foodSearch.length > 2 && searchResults.length === 0 && !isSearching && (
                <div className="absolute z-10 w-full mt-1 bg-blue-500/20 border border-blue-500/40 rounded-lg p-4">
                  <p className="text-blue-400 text-sm">Searching professional food database...</p>
                  <p className="text-blue-300 text-xs mt-1">Try: "chicken curry", "brown rice", "greek yogurt"</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Selected Foods */}
          {selectedFoods.length > 0 && (
            <div>
              <h4 className="text-white font-medium mb-3">Selected Foods:</h4>
              <div className="space-y-3">
                {selectedFoods.map((selectedFood, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="text-white font-medium">{selectedFood.food.name}</p>
                        {selectedFood.food.stomaData?.commonTriggers && selectedFood.food.stomaData.commonTriggers.length > 0 && (
                          <ExclamationTriangleIcon className="h-4 w-4 text-orange-400" />
                        )}
                      </div>
                      <p className="text-white/60 text-sm">
                        {selectedFood.food.categories[0] || 'Food'} • {selectedFood.food.stomaData?.fodmapLevel?.toUpperCase() || 'Unknown'} FODMAP
                      </p>
                      {selectedFood.food.brand && (
                        <p className="text-white/50 text-xs">Brand: {selectedFood.food.brand}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={selectedFood.amount}
                        onChange={(e) => updateFoodAmount(index, e.target.value, selectedFood.unit)}
                        className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-center"
                      />
                      <select
                        value={selectedFood.unit}
                        onChange={(e) => updateFoodAmount(index, selectedFood.amount, e.target.value)}
                        className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                      >
                        <option value="serving">serving</option>
                        <option value="cup">cup</option>
                        <option value="slice">slice</option>
                        <option value="piece">piece</option>
                        <option value="oz">oz</option>
                      </select>
                      <button
                        onClick={() => removeFoodFromMeal(index)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-white/90 font-medium mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about this meal..."
              className="w-full h-24 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <button
          onClick={saveEntry}
          disabled={
            (inputMode === 'natural' && !parsedData) ||
            (inputMode === 'traditional' && selectedFoods.length === 0)
          }
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <span className="flex items-center justify-center gap-2">
            <CheckIcon className="h-5 w-5" />
            Save Entry
          </span>
        </button>
      </div>
    </div>
  );
}
