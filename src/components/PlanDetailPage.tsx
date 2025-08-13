import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';

const coverItems = [
  'Unlimited Doctor Visits',
  'Acute/Chronic Medication',
  'Dentistry / Optometry',
];

const descriptionItems: { title: string; text: string }[] = [
  {
    title: 'Unlimited Managed Doctor Visits',
    text:
      'Via a registered Day1 Health Network Provider. An upfront co-payment of R300.00 will apply for all additional visits after the 5th visit per member per annum. Pre-authorisation is required. A 1 month waiting period applies.',
  },
  {
    title: 'Pathology',
    text:
      'Basic diagnostic blood tests on referral by a 1Doctor Health Network GP and subject to a list of basic pathology tests approved by Day1 Health. A 1 month waiting period applies.',
  },
  {
    title: 'Specialist Benefit',
    text:
      'Specialist Benefit of up to R 1000 per family per annum. Subject to pre-authorisation and referral from a 1Doctor Health Network GP. A 3 month waiting period applies.',
  },
  {
    title: 'Basic Dentistry',
    text:
      'Basic treatment includes preventative cleaning, fillings, extractions and emergency pain and sepsis control via a Day1 Health Network Dentist. 2 visits per member per annum. Pre-authorisation is required for each visit. A 3 month waiting period applies.',
  },
  {
    title: 'Acute Medication',
    text:
      'Acute medication covered according to the 1Doctor Health formulary. Linked to the 1Doctor consultation dispensed by the 1Doctor Health Network GP or obtained on script from a Network Pharmacy. A 1 month waiting period applies.',
  },
  {
    title: 'Optometry (Iso Leso Optics)',
    text:
      'One eye test and one set of glasses every 24 months per the specific Iso Leso Optics agreed protocol range. A 12 month waiting period applies.',
  },
  {
    title: 'Chronic Medication',
    text:
      'Chronic medication covered according to the 1Doctor Health formulary. A 3 month waiting period applies on chronic medication for unknown conditions and 12 months waiting period on pre-existing conditions. (All chronic medication is subject to pre-authorisation. An additional administration fee may be levied on all approved chronic medication.)',
  },
  {
    title: 'Out-of-Area Visits',
    text:
      'In the event that you cannot see your Network GP, the Plan will allow 3 “out of area” visits per family per annum to an alternative Network GP or GP of your choice, subject to pre-authorisation. A 1 month waiting period applies.',
  },
  {
    title: 'Radiology',
    text:
      'Basic radiology according to the 1Doctor Health formulary via a 1Doctor Health network GP. Black and white diagnostic x-rays only. A 1 month waiting period applies.',
  },
  {
    title: 'Family Funeral Benefit',
    text:
      'Principal, Spouse & Child > 14 years R10,000. Child > 6 years R5,000. Child > 0 years > R2,500. Stillborn > 28 weeks R1,250. A 3 month waiting period applies.',
  },
];

const legalCopy = `Practical Medical Insurance – Providing cover since 2003 Day1 Health (Pty) Ltd is an authorised Financial Services Provider – FSP Number 11319. Day1 Health (Pty) Ltd is duly approved and accredited by the Council for Medical Schemes – CMS Ref: 1074. Powered by Day1 Health – Underwritten by African Unity Life Ltd, a licensed Life Insurer and an authorised Financial Services Provider. FSP No: FSP 8447. Day1 Health offers Medical Insurance plans and is not a Medical Aid product.

Day1 Health complies with the principles of open enrollment, community rating and cross-subsidisation and does not discriminate or refuse membership on the basis of race, age, gender, marital status, ethnic or social origin, sexual orientation, pregnancy, disability, state of health, geographical location or any other means of discrimination.`;

const PlanDetailPage: React.FC = () => {
  const { isDark } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [option, setOption] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'additional'>('description');

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="flex min-h-screen w-full">
        <Header
          activeSection="plans"
          onNavigate={() => {}}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          isFooterInView={false}
        />

        <div className="flex-1 w-0">
          <main className="w-full py-10">
            <div className={`${isSidebarCollapsed ? 'max-w-[74rem]' : 'max-w-[min(74rem,calc(100vw-14rem-0.5rem))]'} mx-auto px-4 md:px-6`}>
              {/* Breadcrumbs */}
              <nav className="text-sm mb-6">
                <Link to="/" className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>Home</Link>
                <span className={isDark ? 'text-gray-500 mx-2' : 'text-gray-400 mx-2'}>/</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Day To Day Plan</span>
              </nav>

              {/* Title + Price */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Day To Day Plan</h1>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>R385.00 – R1,446.00</div>
                  <div className={isDark ? 'text-gray-300 text-sm' : 'text-gray-600 text-sm'}>Price range: R385.00 through R1,446.00</div>
                </div>
              </div>

              {/* Cover highlights */}
              <div className={`rounded-xl border p-4 mb-6 ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                <div className="flex flex-wrap items-center gap-2">
                  <div className={`text-xs uppercase tracking-wide ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>COVER:</div>
                  {coverItems.map((c) => (
                    <span key={c} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                      <Check className="w-3.5 h-3.5" /> {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Options + quantity */}
              <div className="grid md:grid-cols-[1fr_auto] gap-4 mb-6">
                <div className={`rounded-xl border p-4 ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <label className={isDark ? 'text-gray-200 text-sm' : 'text-gray-700 text-sm'}>Options</label>
                  <select
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none ${isDark ? 'bg-gray-900/70 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    <option value="">Choose an option</option>
                    <option value="single">Single</option>
                    <option value="couple">Couple</option>
                    <option value="family">Family</option>
                  </select>
                </div>
                <div className={`rounded-xl border p-4 ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <label className={isDark ? 'text-gray-200 text-sm' : 'text-gray-700 text-sm'}>Day To Day Plan quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value || '1', 10))}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none ${isDark ? 'bg-gray-900/70 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>
              </div>

              {/* SKU + Category */}
              <div className={`text-sm mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <div>SKU: N/A</div>
                <div>Category: Normal</div>
              </div>

              {/* Tabs */}
              <div className="mb-4 flex items-center gap-2">
                <button
                  className={`px-3 py-2 text-sm rounded-lg border ${activeTab === 'description' ? (isDark ? 'bg-emerald-600/20 border-emerald-400 text-white' : 'bg-emerald-50 border-emerald-300 text-emerald-800') : (isDark ? 'bg-gray-800/80 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-700')}`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={`px-3 py-2 text-sm rounded-lg border ${activeTab === 'additional' ? (isDark ? 'bg-emerald-600/20 border-emerald-400 text-white' : 'bg-emerald-50 border-emerald-300 text-emerald-800') : (isDark ? 'bg-gray-800/80 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-700')}`}
                  onClick={() => setActiveTab('additional')}
                >
                  Additional information
                </button>
              </div>

              {/* Tab content */}
              {activeTab === 'description' ? (
                <div className={`rounded-xl border p-4 ${isDark ? 'bg-gray-800/80 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}>
                  <div className="prose max-w-none prose-invert:prose">
                    <ul className="space-y-5">
                      {descriptionItems.map((item) => (
                        <li key={item.title}>
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-sm opacity-90 leading-relaxed">{item.text}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6 text-xs opacity-80 whitespace-pre-line">{legalCopy}</div>
                </div>
              ) : (
                <div className={`rounded-xl border p-4 ${isDark ? 'bg-gray-800/80 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}>
                  <div className="text-sm">No additional information available.</div>
                </div>
              )}

              {/* Related products */}
              <div className="mt-10">
                <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Related products</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Platinum Plan', price: 'R895.00 – R3,043.00', link: '#' },
                    { name: 'Executive Plan', price: 'R985.00 – R3,300.00', link: '#' },
                    { name: 'Value Plus Plan', price: 'R665.00 – R2,195.00', link: '#' },
                    { name: 'Executive Hospital Plan', price: 'R640.00 – R2,176.00', link: '#' },
                  ].map((rp) => (
                    <Link key={rp.name} to={rp.link} className={`rounded-xl border p-4 transition-colors ${isDark ? 'bg-gray-800/80 border-gray-700 hover:border-emerald-700' : 'bg-white border-gray-200 hover:border-emerald-300'}`}>
                      <div className="font-semibold mb-1">{rp.name}</div>
                      <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{rp.price}</div>
                      <div className={`mt-2 inline-flex items-center gap-1 text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                        Select options <ChevronRight size={16} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </main>

          <Footer id="footer" isSidebarCollapsed={isSidebarCollapsed} />
        </div>
      </div>
    </div>
  );
};

export default PlanDetailPage;
