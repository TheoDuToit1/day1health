import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';

const links: { title: string; href: string }[] = [
  { title: 'POPI Website Statement', href: "/assets/pdf's/Legal and Regulatory Information/POPI-Website-Statement.pdf" },
  { title: 'Data Subject Enquiry Protocols', href: "/assets/pdf's/Legal and Regulatory Information/Day1-Health-POPIA-Data-Subject-Enquiry-Protocols.pdf" },
  { title: 'Complaints Policy', href: "/assets/pdf's/Legal and Regulatory Information/Complaints-Policy.pdf" },
  { title: 'Conflict of Interest Management Policy', href: "/assets/pdf's/Legal and Regulatory Information/Conflict-of-Interest-Management-Policy.pdf" },
  { title: 'PAIA Manual', href: "/assets/pdf's/Legal and Regulatory Information/DAY-1-HEALTH-PTY-LTD-PAIA-Manual.pdf" },
  { title: 'PAIA Request for Access to Records', href: "/assets/pdf's/Legal and Regulatory Information/PAIA-FORM-2.pdf" },
  { title: 'PAIA Outcome and Fees Payable', href: "/assets/pdf's/Legal and Regulatory Information/PAIA-FORM-3.pdf" },
  { title: 'POPI Privacy Policy', href: "/assets/pdf's/DAY 1 HEALTH PTY LTD - Privacy Policy.pdf" },
];

function RegulatoryInformationPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [activeSection] = useState('hero');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFooterInView, setIsFooterInView] = useState(false);

  const scrollToSection = (sectionId: string) => {
    // Store the target and navigate to home, where AppWrapper will handle scrolling
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
          {/* Page Content */}
          <div
            className={`${isSidebarCollapsed ? 'lg:pl-24' : 'lg:pl-64'}`}
            style={{ transition: 'padding-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
          >
            <section className={`transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <header className="mb-10">
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
                  <h1 className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                    Legal and Regulatory Information
                  </h1>
                  <p className={`text-lg max-w-3xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    You can find all the important regulatory information relevant to our industry by exploring the links below.
                    These resources provide direct access to official guidelines, compliance standards, licensing requirements,
                    and governing bodies that oversee our operations. We encourage all visitors, clients, and partners to review
                    this information to stay informed and aligned with current industry regulations.
                  </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {links.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group inline-flex items-center justify-between w-full rounded-lg border px-5 py-4 font-medium transition-all
                        ${isDark ? 'border-gray-800 bg-gray-900 hover:bg-gray-800 hover:border-gray-700 text-gray-100' : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-800'}
                      `}
                    >
                      <span>{item.title}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-5 h-5 opacity-60 group-hover:opacity-100"
                      >
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* Footer */}
            <Footer id="footer" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegulatoryInformationPage;
