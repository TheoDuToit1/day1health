import React from 'react';
import ChatWidget from '../src/components/ChatWidget';
import ManualUiLab from '../src/components/ManualUiLab';

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Manual prototype
            </span>
            <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">
              Day1Health AI Chatbot UI Lab
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
              Manual trigger page for testing chatbot visual responses before AI integration.
            </p>
          </div>

          <ManualUiLab />

          <div className="mt-8 text-center text-sm text-slate-500">
            <p>Manual UI lab only. No AI, claims, authorisations, or member data are connected.</p>
            <p className="mt-2">
              For urgent matters, call{' '}
              <a href="tel:0876100600" className="text-emerald-700 hover:underline">
                0876 100 600
              </a>
            </p>
          </div>
        </div>
      </div>

      <ChatWidget
        apiUrl="/api/chat"
        position="bottom-right"
        theme="light"
        size="compact"
        welcomeMessage="Hi! I'm here to help you find the perfect health plan. What can I help you with today?"
      />
    </div>
  );
}
