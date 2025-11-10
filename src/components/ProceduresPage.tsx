import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import FloatingWhatsApp from './FloatingWhatsApp';

function ProceduresPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [activeSection] = useState('procedures');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFooterInView, setIsFooterInView] = useState(false);

  const scrollToSection = (sectionId: string) => {
    sessionStorage.setItem('navigatingToSection', sectionId);
    navigate('/');
  };

  useEffect(() => {
    const onScroll = () => {
      const footer = document.getElementById('footer');
      if (footer) {
        const rect = footer.getBoundingClientRect();
        setIsFooterInView(rect.top < window.innerHeight * 0.8);
      }
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const paragraph = (children: any) => (
    <p className={`text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{children}</p>
  );

  const buttonLink = (href: string, label: string) => (
    <a
      href={href}
      download
      className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium mt-4 transition-colors ${
        isDark
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'bg-green-600 text-white hover:bg-green-700'
      }`}
    >
      {label}
    </a>
  );

  const list = (items: string[]) => (
    <ul className={`list-disc pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );

  // Build sections as tabs
  const tabs = useMemo(() => {
    const p = paragraph;
    const btn = buttonLink;
    const list = (items: string[]) => (
      <ul className={`list-disc pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    );

    return [
      {
        id: 'join',
        title: 'JOIN THE DAY1 HEALTH FAMILY',
        content: (
          <div className="space-y-3">
            {p('View our different plans and pricing options.')}
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem('navigatingToSection', 'plans');
                navigate('/');
                window.scrollTo(0, 0);
              }}
              className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium mt-4 transition-colors ${
                isDark ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              View Plans & Pricing
            </button>
          </div>
        )
      },
      {
        id: 'welcome-pack',
        title: 'WELCOME PACK',
        content: (
          <div className="space-y-3">
            {p('If any details are missing or if we need any more information for underwriting purposes, we shall contact you.')}
            {p('We shall activate your membership and send you a confirmation SMS within 24 hours which will contain your Day1 Health membership number and important contact information.')}
            {p('You will receive your Day1 Health Welcome Pack after your first successful debit order (inclusive of your once-off activation fee).')}
            {p('Your Welcome Pack contains your Day1 Health membership card, welcome letter, Africa Assist (A-A) decal (car) sticker, policy schedule and endorsements (if applicable), product guide and policy wording (applicable to hospital policies only).')}
            {p('Please read your documentation carefully and keep it safe for your records.')}
            {p('Please feel free to contact Day1 Health by email at admin@day1.co.za or contact us on 0876 100 600 if you have any queries regarding your application.')}
          </div>
        )
      },
      {
        id: 'chronic-medication',
        title: 'CHRONIC MEDICATION',
        content: (
          <div className="space-y-3">
            {p('If you are diagnosed with a chronic condition, however, you need to register on the Day1 Health Chronic Disease Management Programme via your Day1 Health Network GP in order to receive your chronic medication. Chronic medication may be collected from any Clicks, Dischem or Medirite pharmacy nationwide and is subject to pre-authorisation. (An additional administration fee may be levied on all approved chronic medication.)')}
            {p('You may download the Chronic Application Form by clicking on the button below or you may contact us on 0876 100 600 and request that the application form be emailed to you.')}
            {btn("/assets/pdf's/procedures/Chronic-Medication-Application-Form.pdf", 'Download Chronic Application Form (PDF)')}
          </div>
        )
      },
      {
        id: 'claims-procedure',
        title: 'CLAIMS PROCEDURE',
        content: (
          <div className="space-y-4">
            {p('Your GP visits, prescribed medication and other listed day-to-day benefits are covered within the approved Day1 Health Provider Network & formulary. To claim for out-of-area GP consultations, minor procedures and/or medication, you may download the Reimbursement Form or contact us to request one via email.')}
            {p('The following information must be attached to your completed Day1 Health Reimbursement Form in order for it to be processed successfully:')}
            {list([
              'Copy of detailed account (invoice/statement)',
              'Proof of payment (receipt)',
              'Proof of bank details (bank statement / bank letter or cancelled cheque)',
            ])}
            <div className="mt-2" />
            {p('Important Notes & Instructions:')}
            {list([
              'Refunds are made by electronic fund transfer (EFT) only. Noting your bank account details is essential to ensure that your reimbursement is processed for payment. Please retain copies of all documents as well as the proof of submission.',
              'Payments are made within 30 days from the date of receipt of the accounts.',
              'Reimbursements must be submitted within 120 days (4 months) from date of service. Any request received after 4 months from date of service will be rejected as stale.',
            ])}
            {btn("/assets/pdf's/procedures/Day1-Reimbursement-Form.pdf", 'Download Reimbursement Form (PDF)')}
          </div>
        )
      },
      {
        id: 'reservation-of-rights',
        title: 'RESERVATION OF RIGHTS',
        content: (
          <div className="space-y-3">
            {p('Day1health reserves the right to cancel your membership if you-')}
            {list([
              'Provide false information or fail to disclose medical information when applying for primary healthcare benefits or a hospital insurance plan.',
              'Provide false information upon submission of a claim, submit a fraudulent claim or intentionally allow a service provider to do so on your behalf.',
              'Allow any unauthorised person to use your Day1 Health membership card.',
              'Without a good explanation, neglect to inform Day1 Health that it has paid for services or supplies that were not delivered or received.',
              'Commit any other fraudulent act.',
              'failure to pay monthly contributions and/or premiums.',
            ])}
          </div>
        )
      },
      {
        id: 'africa-assist',
        title: 'AFRICA-ASSIST & HOSPITAL PRE-AUTHORISATION',
        content: (
          <div className="space-y-4">
            {p('What is the procedure to follow in the event of a medical emergency or illness and you need to go to the hospital?')}
            {p('Always call Africa-Assist: 0861 144 144. Tell the Africa-Assist operator that you are a Day1 Health member. The operator will prompt you or the caller and request all the information that is required to get help to you as quickly as possible. Have your membership number or ID number readily available.')}
            {p('Useful hints to remember about Africa-Assist and Hospital Pre-Authorisations:')}
            {list([
              'Teach your family members to call 0861 144 144 in case of an emergency.',
              'In the event of an accident, take note of road names and numbers as this will expedite the emergency response.',
              'Please store 0861 144 144 under “Medical Emergency” on your cell phone.',
              'For hospital pre-authorisation, please contact 0861 144 144. All admissions for both Accident & Illness must be authorised.',
            ])}
            {btn("/assets/pdf's/procedures/Hospital-Claim-Form.pdf", 'Download Hospital Claim Form (PDF)')}
          </div>
        )
      },
    ];
  }, [isDark]);

  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const sectionsRef = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleTab = (id: string) => {
    setActiveTab((prev) => (prev === id ? '' : id));
    // scroll into view of the header for better UX
    setTimeout(() => {
      const el = sectionsRef.current[id];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="flex min-h-screen w-full">
        <Header
          activeSection={activeSection}
          onNavigate={scrollToSection}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          isFooterInView={isFooterInView}
        />

        <div className="flex-1 w-0">
          <div
            className={`${isSidebarCollapsed ? 'lg:pl-24' : 'lg:pl-64'}`}
            style={{ transition: 'padding-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
          >
            <section className={`transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <header className="mb-8">
                  {/* Back button */}
                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.setItem('navigatingToSection', 'hero');
                      navigate('/');
                      window.scrollTo(0, 0);
                    }}
                    className={`inline-flex items-center gap-2 text-sm mb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-md px-1.5 py-1 transition-colors ${
                      isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-label="Go back"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Back
                  </button>
                  <h1 className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Procedures
                  </h1>
                  {paragraph('Operational guidance, downloads, and support information for Day1 Health members.')}
                </header>

                {/* Tabs Header */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {tabs.map((t) => {
                    const active = activeTab === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => toggleTab(t.id)}
                        aria-expanded={active}
                        aria-controls={`panel-${t.id}`}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                          active
                            ? 'bg-green-600 text-white border-green-600'
                            : isDark
                              ? 'bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {t.title}
                      </button>
                    );
                  })}
                </div>

                {/* Panels (Accordion-like) */}
                <div className="space-y-4">
                  {tabs.map((t) => {
                    const open = activeTab === t.id;
                    return (
                      <div key={t.id} ref={(el) => (sectionsRef.current[t.id] = el)}>
                        <button
                          onClick={() => toggleTab(t.id)}
                          aria-expanded={open}
                          aria-controls={`panel-${t.id}`}
                          className={`w-full flex items-center justify-between px-5 py-4 rounded-lg border text-left font-semibold transition-colors ${
                            open
                              ? isDark
                                ? 'bg-green-900/30 border-green-800 text-green-300'
                                : 'bg-green-50 border-green-200 text-green-700'
                              : isDark
                                ? 'bg-gray-900 border-gray-800 text-gray-200 hover:bg-gray-800'
                                : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50'
                          }`}
                        >
                          <span>{t.title}</span>
                          <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <div
                          id={`panel-${t.id}`}
                          role="region"
                          aria-labelledby={`tab-${t.id}`}
                          className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[2000px] mt-3' : 'max-h-0'}`}
                        >
                          <div className={`p-5 rounded-lg border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                            {t.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <Footer id="footer" />
          </div>
          <FloatingWhatsApp />
        </div>
      </div>
    </div>
  );
}

export default ProceduresPage;
