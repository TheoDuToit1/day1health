import { useState, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  text: string;
  className?: string;
}

export function AudioPlayer({ text, className = "" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const playTTS = async () => {
    if (isPlaying) {
      // Stop current speech synthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    
    try {
      // Use Web Speech API for TTS
      if ('speechSynthesis' in window) {
        // Stop any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure voice settings
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        // Try to use a more natural voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Google') || 
          voice.name.includes('Microsoft') ||
          voice.lang.startsWith('en')
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
          setIsPlaying(true);
          setIsLoading(false);
        };

        utterance.onend = () => {
          setIsPlaying(false);
        };

        utterance.onerror = () => {
          setIsPlaying(false);
          setIsLoading(false);
          console.error('Speech synthesis error');
        };

        window.speechSynthesis.speak(utterance);
      } else {
        console.error('Speech synthesis not supported');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('TTS Error:', error);
      setIsLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop audio when text changes
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, [text]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={playTTS}
        disabled={isLoading}
        className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
          isPlaying 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} shadow-md`}
        aria-label={isPlaying ? 'Stop audio' : 'Play audio'}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5 ml-0.5" />
        )}
      </button>
      
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Volume2 className="w-4 h-4" />
        <span>{isPlaying ? 'Playing...' : 'Listen to testimonial'}</span>
      </div>
    </div>
  );
}
