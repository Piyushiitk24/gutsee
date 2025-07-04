'use client';

import React, { useState, useRef } from 'react';
import { 
  CameraIcon, 
  XMarkIcon, 
  PhotoIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoLoggerProps {
  onPhotoCapture: (photo: File, analysis?: any) => void;
  onClose: () => void;
}

export function PhotoLogger({ onPhotoCapture, onClose }: PhotoLoggerProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera if available
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      const dataURL = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedPhoto(dataURL);
      
      // Convert to file
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `meal-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setPhotoFile(file);
          analyzePhoto(file);
        }
      }, 'image/jpeg', 0.8);
      
      stopCamera();
    }
  };

  const analyzePhoto = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      // Mock analysis - in real app, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis = {
        detectedItems: ['Rice', 'Chicken', 'Broccoli'],
        confidence: 0.85,
        portion: 'Medium',
        suggestedMeal: 'Chicken and Rice Bowl',
        nutritionalInfo: {
          calories: 420,
          protein: 35,
          carbs: 45,
          fat: 12
        }
      };
      
      setAnalysisResult(mockAnalysis);
    } catch (error) {
      console.error('Error analyzing photo:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setPhotoFile(file);
      analyzePhoto(file);
    }
  };

  const handleSubmit = () => {
    if (photoFile) {
      onPhotoCapture(photoFile, analysisResult);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setPhotoFile(null);
    setAnalysisResult(null);
    startCamera();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Photo Logger</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {!capturedPhoto ? (
          <div className="space-y-4">
            {isCapturing ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 bg-black rounded-lg object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={capturePhoto}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <CameraIcon className="h-8 w-8 text-gray-700" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <button
                  onClick={startCamera}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                >
                  <CameraIcon className="h-5 w-5" />
                  Take Photo
                </button>
                
                <div className="text-center text-gray-500">or</div>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <PhotoIcon className="h-5 w-5" />
                  Upload from Gallery
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={capturedPhoto}
                alt="Captured meal"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {isAnalyzing ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-blue-700 font-medium">Analyzing photo...</span>
                </div>
              </div>
            ) : analysisResult ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-medium">Analysis Complete</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Detected: </span>
                    {analysisResult.detectedItems.join(', ')}
                  </div>
                  <div>
                    <span className="font-medium">Suggested: </span>
                    {analysisResult.suggestedMeal}
                  </div>
                  <div>
                    <span className="font-medium">Calories: </span>
                    ~{analysisResult.nutritionalInfo.calories}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex gap-3">
              <button
                onClick={retakePhoto}
                className="flex-1 bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Retake
              </button>
              <button
                onClick={handleSubmit}
                disabled={!photoFile}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Use Photo
              </button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </div>
  );
}
