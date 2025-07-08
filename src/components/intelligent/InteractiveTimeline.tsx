'use client'

import { useState, useEffect } from 'react'
import { formatDate, formatTime } from '@/utils/dateUtils'
import { 
  CalendarDaysIcon, 
  ChartBarIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface TimelineEvent {
  id: string
  type: 'meal' | 'output' | 'gas' | 'irrigation' | 'mood' | 'symptom'
  timestamp: Date
  title: string
  description: string
  severity?: 'low' | 'medium' | 'high'
  correlationScore?: number
  tags: string[]
  data: any
}

interface InteractiveTimelineProps {
  events: TimelineEvent[]
  onEventClick: (event: TimelineEvent) => void
  onFilterChange: (filters: any) => void
  onCorrelationAnalysis: (event: TimelineEvent) => void
}

export function InteractiveTimeline({ 
  events, 
  onEventClick, 
  onFilterChange,
  onCorrelationAnalysis 
}: InteractiveTimelineProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [timeRange, setTimeRange] = useState('7d')
  const [showCorrelations, setShowCorrelations] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const eventTypes = [
    { id: 'meal', label: 'Meals', color: 'bg-green-500', icon: '🍽️' },
    { id: 'output', label: 'Output', color: 'bg-blue-500', icon: '💧' },
    { id: 'gas', label: 'Gas', color: 'bg-purple-500', icon: '💨' },
    { id: 'irrigation', label: 'Irrigation', color: 'bg-orange-500', icon: '🚿' },
    { id: 'mood', label: 'Mood', color: 'bg-pink-500', icon: '😊' },
    { id: 'symptom', label: 'Symptoms', color: 'bg-red-500', icon: '⚠️' }
  ]

  const filteredEvents = events.filter(event => {
    const matchesFilter = selectedFilters.length === 0 || selectedFilters.includes(event.type)
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meal': return '🍽️'
      case 'output': return '💧'
      case 'gas': return '💨'
      case 'irrigation': return '🚿'
      case 'mood': return '😊'
      case 'symptom': return '⚠️'
      default: return '📍'
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meal': return 'from-green-400 to-emerald-500'
      case 'output': return 'from-blue-400 to-cyan-500'
      case 'gas': return 'from-purple-400 to-violet-500'
      case 'irrigation': return 'from-orange-400 to-red-500'
      case 'mood': return 'from-pink-400 to-rose-500'
      case 'symptom': return 'from-red-400 to-rose-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const handleFilterToggle = (filterType: string) => {
    const newFilters = selectedFilters.includes(filterType)
      ? selectedFilters.filter(f => f !== filterType)
      : [...selectedFilters, filterType]
    
    setSelectedFilters(newFilters)
    onFilterChange({ types: newFilters, timeRange, searchTerm })
  }

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event)
    onEventClick(event)
  }

  return (
    <div className="glass-card backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <CalendarDaysIcon className="h-6 w-6 text-purple-400" />
          <h3 className="text-2xl font-bold text-white">Interactive Timeline</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCorrelations(!showCorrelations)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              showCorrelations
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <ChartBarIcon className="h-4 w-4 mr-2 inline" />
            Correlations
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white/10 text-white rounded-xl px-3 py-2 text-sm border border-white/20"
          >
            <option value="1d">Last 24h</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-white/60 rounded-xl border border-white/20 focus:border-purple-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {eventTypes.map(type => (
            <button
              key={type.id}
              onClick={() => handleFilterToggle(type.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedFilters.includes(type.id)
                  ? `${type.color} text-white`
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <span className="mr-2">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 to-pink-400"></div>

        <div className="space-y-4">
          <AnimatePresence>
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start space-x-4 cursor-pointer group"
                onClick={() => handleEventClick(event)}
              >
                {/* Timeline dot */}
                <div className={`relative z-10 w-6 h-6 rounded-full bg-gradient-to-r ${getEventColor(event.type)} flex items-center justify-center text-white text-xs font-bold group-hover:scale-110 transition-transform duration-200`}>
                  {getEventIcon(event.type)}
                </div>

                {/* Event card */}
                <div className="flex-1 backdrop-blur-lg bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 group-hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-white">{event.title}</h4>
                      {event.severity && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.severity === 'high' ? 'bg-red-400/20 text-red-300' :
                          event.severity === 'medium' ? 'bg-yellow-400/20 text-yellow-300' :
                          'bg-green-400/20 text-green-300'
                        }`}>
                          {event.severity}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-white/60">
                      <span>{formatTime(event.timestamp)}</span>
                      <span>•</span>
                      <span>{formatDate(event.timestamp)}</span>
                    </div>
                  </div>

                  <p className="text-white/80 text-sm mb-3">{event.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {event.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Correlation info */}
                  {showCorrelations && event.correlationScore && (
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-white/60 text-sm">Correlation Score</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                            style={{ width: `${event.correlationScore * 100}%` }}
                          />
                        </div>
                        <span className="text-white font-medium text-sm">
                          {Math.round(event.correlationScore * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 text-white/60">
            <CalendarDaysIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No events found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-white/80 text-sm mb-2">Description</p>
                  <p className="text-white">{selectedEvent.description}</p>
                </div>

                <div>
                  <p className="text-white/80 text-sm mb-2">Time</p>
                  <p className="text-white">{selectedEvent.timestamp.toLocaleString()}</p>
                </div>

                {selectedEvent.tags.length > 0 && (
                  <div>
                    <p className="text-white/80 text-sm mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedEvent.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-lg">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={() => onCorrelationAnalysis(selectedEvent)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-xl text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  >
                    <ChartBarIcon className="h-4 w-4 mr-2 inline" />
                    Analyze Correlations
                  </button>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 bg-white/10 text-white/80 rounded-xl text-sm font-medium hover:bg-white/20 transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
