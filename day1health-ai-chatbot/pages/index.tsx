import React from 'react';
import ChatWidget from '../src/components/ChatWidget';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Day1Health AI Assistant
            </h1>
            <p className="text-lg text-gray-600">
              Get instant help finding the perfect health insurance plan
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-600 text-3xl mb-2">💬</div>
              <h3 className="font-bold text-lg mb-2">Ask Questions</h3>
              <p className="text-gray-600 text-sm">
                Get instant answers about plans, coverage, and pricing
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-600 text-3xl mb-2">🎯</div>
              <h3 className="font-bold text-lg mb-2">Get Recommendations</h3>
              <p className="text-gray-600 text-sm">
                Find the best plan based on your needs and budget
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-600 text-3xl mb-2">📋</div>
              <h3 className="font-bold text-lg mb-2">Compare Plans</h3>
              <p className="text-gray-600 text-sm">
                Understand differences between plans in simple terms
              </p>
            </div>
          </div>

          {/* Demo Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Try It Now</h2>
            <p className="text-gray-600 mb-4">
              Click the chat button in the bottom-right corner to start a conversation!
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-semibold text-blue-900 mb-2">Try asking:</p>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• "I need health insurance for my family"</li>
                <li>• "What's the difference between hospital and comprehensive plans?"</li>
                <li>• "How much does it cost for 2 adults and 1 child?"</li>
                <li>• "How do I apply for coverage?"</li>
              </ul>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">What I Can Help With</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Plan Explanations</h3>
                  <p className="text-gray-600 text-sm">
                    I break down complex insurance terms into simple language you can understand
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Personalized Recommendations</h3>
                  <p className="text-gray-600 text-sm">
                    Tell me your needs and budget, and I'll recommend the best plans for you
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Application Guidance</h3>
                  <p className="text-gray-600 text-sm">
                    I'll guide you through the application process and answer any questions
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Claims & Coverage Info</h3>
                  <p className="text-gray-600 text-sm">
                    Learn about claims processes, network providers, and what's covered
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-600 text-sm">
            <p>Powered by Day1Health AI • Available 24/7</p>
            <p className="mt-2">
              For urgent matters, call{' '}
              <a href="tel:0876100600" className="text-blue-600 hover:underline">
                0876 100 600
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget 
        apiUrl="/api/chat"
        position="bottom-right"
        theme="light"
        welcomeMessage="Hi! I'm here to help you find the perfect health plan. What can I help you with today?"
      />
    </div>
  );
}
