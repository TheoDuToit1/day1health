import React, { useState } from 'react';
import { ArrowLeft, Mic, Play, Pause, Volume2, MessageSquare, Brain, Zap, Shield, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const VoiceAssistantsPage: React.FC = () => {
  const { isDark } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Intelligence",
      description: "Advanced natural language processing for accurate health consultations and insurance guidance."
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Natural Conversations",
      description: "Speak naturally with our AI assistants - no complex commands or rigid scripts required."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "HIPAA Compliant",
      description: "Your health information is protected with enterprise-grade security and privacy standards."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Availability",
      description: "Get instant answers to your health insurance questions anytime, day or night."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Responses",
      description: "No waiting on hold - get immediate, accurate answers to your insurance questions."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-Language Support",
      description: "Communicate in your preferred language with our multilingual voice assistants."
    }
  ];

  const demoScenarios = [
    {
      title: "Policy Information",
      description: "Ask about your coverage, deductibles, and benefits",
      example: "What's covered under my current plan?"
    },
    {
      title: "Claims Assistance",
      description: "Get help filing claims and tracking their status",
      example: "How do I file a claim for my recent doctor visit?"
    },
    {
      title: "Find Providers",
      description: "Locate in-network doctors and specialists near you",
      example: "Find a cardiologist in my network near downtown"
    },
    {
      title: "Appointment Scheduling",
      description: "Schedule appointments with healthcare providers",
      example: "Schedule a check-up with my primary care doctor"
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className={`flex items-center gap-2 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
              <Mic className={`w-12 h-12 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Voice AI Assistants
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto mb-8`}>
            Experience the future of healthcare support with our intelligent voice assistants. 
            Get instant answers, personalized guidance, and seamless insurance support through natural conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Try Demo Assistant
            </button>
            <button className={`${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} px-8 py-3 rounded-lg font-semibold transition-colors`}>
              Learn More
            </button>
          </div>
        </div>

        {/* Demo Player */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 mb-16`}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Interactive Demo</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Listen to a sample conversation with our AI voice assistant
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-32 h-32 rounded-full ${isDark ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-500'} flex items-center justify-center mb-6 shadow-lg`}>
              <Volume2 className="w-12 h-12 text-white" />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <div className={`flex-1 h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                <div className="h-full bg-blue-600 w-1/3 rounded-full"></div>
              </div>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>1:23 / 3:45</span>
            </div>
            
            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4 max-w-2xl`}>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} italic`}>
                "Hi, I'm your Day1Health voice assistant. I can help you understand your insurance coverage, 
                find doctors in your network, and guide you through the claims process. What would you like to know today?"
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Voice Assistants?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}>
                <div className={`${isDark ? 'text-blue-400' : 'text-blue-600'} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Scenarios */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What You Can Ask</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {demoScenarios.map((scenario, index) => (
              <div key={index} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-lg transition-shadow`}>
                <h3 className="text-lg font-semibold mb-2">{scenario.title}</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{scenario.description}</p>
                <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3`}>
                  <p className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'} italic`}>
                    "{scenario.example}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className={`${isDark ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'} rounded-2xl p-8 text-center text-white`}>
          <h2 className="text-3xl font-bold mb-4">Ready to Experience the Future?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are already benefiting from our AI voice assistants
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantsPage;
