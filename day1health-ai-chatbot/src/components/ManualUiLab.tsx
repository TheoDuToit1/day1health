import React, { useEffect, useMemo, useState } from 'react';

export type ManualComponentName =
  | 'PlanSummaryCard'
  | 'PlanComparisonPanel'
  | 'ClaimsChecklist'
  | 'AuthorisationSteps'
  | 'CallbackRequestCard'
  | 'ContactOptionsPanel'
  | 'FAQPanel'
  | 'EscalationPanel'
  | 'NavigationPreview';

interface ManualUiLabProps {
  onNavigateToPlanPage?: () => void;
}

interface PanelProps {
  onShowComponent: (componentName: ManualComponentName) => void;
  onNavigateToPlanPage: () => void;
}

interface RegistryEntry {
  label: string;
  description: string;
  icon: string;
  component: React.ComponentType<PanelProps>;
}

const triggerOrder: ManualComponentName[] = [
  'PlanSummaryCard',
  'PlanComparisonPanel',
  'ClaimsChecklist',
  'AuthorisationSteps',
  'CallbackRequestCard',
  'ContactOptionsPanel',
  'FAQPanel',
  'EscalationPanel',
  'NavigationPreview',
];

const shellClass = 'rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]';
const cardClass = 'rounded-[9px] border border-slate-200 bg-slate-50';
const primaryButtonClass = 'inline-flex items-center justify-center rounded-[9px] bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700';
const secondaryButtonClass = 'inline-flex items-center justify-center rounded-[9px] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50';

function getSidebarBounds(viewportWidth: number) {
  const maxWidth = Math.max(280, Math.min(760, viewportWidth - 16));
  const preferredMinWidth = viewportWidth < 640 ? Math.max(240, viewportWidth * 0.72) : 380;
  const minWidth = Math.min(preferredMinWidth, Math.max(220, maxWidth - 80));

  return { minWidth, maxWidth };
}

function getDefaultSidebarWidth(viewportWidth: number) {
  const { minWidth, maxWidth } = getSidebarBounds(viewportWidth);
  const preferredWidth = viewportWidth < 640 ? viewportWidth - 28 : 560;

  return Math.min(maxWidth, Math.max(minWidth, preferredWidth));
}

function clampSidebarWidth(viewportWidth: number, width: number) {
  const { minWidth, maxWidth } = getSidebarBounds(viewportWidth);
  return Math.min(maxWidth, Math.max(minWidth, width));
}

function SectionShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
        {eyebrow}
      </span>
      <h3 className="mt-4 text-2xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function PlanSummaryCard({ onShowComponent, onNavigateToPlanPage }: PanelProps) {
  const highlights = [
    'Short explanation first, actions second.',
    'Useful when someone asks what a plan is for.',
    'Can pivot into a comparison or callback flow.',
  ];

  return (
    <SectionShell
      eyebrow="Plan summary"
      title="Everyday cover in one view"
      description="This preview shows the kind of short plan explanation the chatbot can surface before AI is connected."
    >
      <div className={`${cardClass} p-4`}>
        <p className="text-base font-semibold text-slate-900">Day-to-day plan overview</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          A quick explanation of who the plan suits and what the next action should be.
        </p>
        <ul className="mt-4 space-y-3">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-3 text-sm text-slate-600">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <button type="button" className={primaryButtonClass} onClick={onNavigateToPlanPage}>
          Take me there
        </button>
        <button type="button" className={secondaryButtonClass} onClick={() => onShowComponent('PlanComparisonPanel')}>
          Show visually
        </button>
        <button type="button" className={secondaryButtonClass} onClick={() => onShowComponent('CallbackRequestCard')}>
          Request callback
        </button>
      </div>
    </SectionShell>
  );
}

function PlanComparisonPanel({ onShowComponent }: PanelProps) {
  const plans = [
    {
      name: 'Starter Day-to-Day',
      detail: 'Good for simple everyday support',
      benefits: ['GP visits', 'Acute medicine', 'Network-first value'],
    },
    {
      name: 'Hospital Core',
      detail: 'Focused on in-hospital guidance',
      benefits: ['Admissions path', 'Emergency support', 'Authorisation help'],
    },
    {
      name: 'Comprehensive Plus',
      detail: 'Broader day-to-day and hospital support',
      benefits: ['Wider guidance', 'More flexibility', 'Stronger support mix'],
    },
  ];

  const rows = [
    ['GP access', 'Included', 'Network-led', 'Included'],
    ['Hospital support', 'Limited', 'Core focus', 'Included'],
    ['Guided next steps', 'Basic', 'Medium', 'Broader'],
  ];

  return (
    <SectionShell
      eyebrow="Comparison"
      title="Compare example options"
      description="A future AI response can open a visual comparison instead of a long text answer."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className={`${cardClass} p-4`}>
            <p className="text-lg font-semibold text-slate-900">{plan.name}</p>
            <p className="mt-1 text-sm font-medium text-emerald-700">{plan.detail}</p>
            <ul className="mt-4 space-y-2">
              {plan.benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-[9px] border border-slate-200">
        <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          <span>Benefit</span>
          <span>Starter</span>
          <span>Hospital</span>
          <span>Comprehensive</span>
        </div>
        {rows.map(([benefit, starter, hospital, comprehensive]) => (
          <div key={benefit} className="grid grid-cols-4 border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{benefit}</span>
            <span>{starter}</span>
            <span>{hospital}</span>
            <span>{comprehensive}</span>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <button type="button" className={primaryButtonClass} onClick={() => onShowComponent('CallbackRequestCard')}>
          Help me choose
        </button>
      </div>
    </SectionShell>
  );
}

function ClaimsChecklist({ onShowComponent }: PanelProps) {
  const items = [
    'Invoice',
    'Proof of payment',
    'Member number',
    'Date of treatment',
    'Provider or practice details',
  ];

  return (
    <SectionShell
      eyebrow="Claims"
      title="Claim guidance checklist"
      description="This is the short checklist view a chatbot can show before handing off to claims guidance."
    >
      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item} className={`${cardClass} flex items-center gap-3 px-4 py-4`}>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-slate-800">{item}</span>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <button type="button" className={primaryButtonClass} onClick={() => onShowComponent('ContactOptionsPanel')}>
          Start claim guidance
        </button>
      </div>
    </SectionShell>
  );
}

function AuthorisationSteps({ onShowComponent }: PanelProps) {
  const steps = [
    'Ask about treatment or procedure',
    'Provide member and provider details',
    'Submit supporting documents',
    'Day1Health team reviews',
    'Member receives next step',
  ];

  return (
    <SectionShell
      eyebrow="Authorisations"
      title="Authorisation process"
      description="This timeline preview keeps the process clear and compact."
    >
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                {index + 1}
              </div>
              {index < steps.length - 1 && <div className="mt-2 h-10 w-px bg-slate-300" />}
            </div>
            <div className={`${cardClass} flex-1 px-4 py-4`}>
              <p className="text-sm font-medium text-slate-800">{step}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <button type="button" className={secondaryButtonClass} onClick={() => onShowComponent('ContactOptionsPanel')}>
          View contact options
        </button>
      </div>
    </SectionShell>
  );
}

function CallbackRequestCard() {
  const fields = [
    { label: 'Name', placeholder: 'Your full name', wide: false },
    { label: 'Phone', placeholder: 'Your phone number', wide: false },
    { label: 'Reason', placeholder: 'What do you need help with?', wide: true, multiline: true },
    { label: 'Preferred time', placeholder: 'Morning, afternoon, or specific time', wide: true },
  ];

  return (
    <SectionShell
      eyebrow="Callback"
      title="Request a callback"
      description="Visual-only placeholder for the future callback action. Nothing submits yet."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.label} className={field.wide ? 'sm:col-span-2' : ''}>
            <span className="mb-2 block text-sm font-medium text-slate-800">{field.label}</span>
            {field.multiline ? (
              <textarea
                rows={4}
                placeholder={field.placeholder}
                className="w-full rounded-[9px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500"
              />
            ) : (
              <input
                type="text"
                placeholder={field.placeholder}
                className="w-full rounded-[9px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500"
              />
            )}
          </label>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">Prototype only. No backend submission is connected.</p>
        <button type="button" className={primaryButtonClass}>
          Request callback
        </button>
      </div>
    </SectionShell>
  );
}

function ContactOptionsPanel() {
  const options = [
    ['Claims', 'Claim documents, statuses, and reimbursement help'],
    ['Authorisations', 'Admissions and procedure approvals'],
    ['Membership admin', 'Member details and card support'],
    ['Debit order / payments', 'Billing and payment help'],
    ['Sales', 'Plan interest and product questions'],
    ['Complaints', 'Formal review and service concerns'],
  ];

  return (
    <SectionShell
      eyebrow="Contact routing"
      title="Choose the right team"
      description="This routes people to the best department without exposing any real data or workflows."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map(([title, description]) => (
          <button key={title} type="button" className={`${cardClass} p-4 text-left transition hover:bg-white`}>
            <p className="text-base font-semibold text-slate-900">{title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </button>
        ))}
      </div>
    </SectionShell>
  );
}

function FAQPanel({ onShowComponent }: PanelProps) {
  const faqs = [
    {
      question: 'How do I claim?',
      answer: 'Start with the checklist, then move into guided support or contact routing.',
    },
    {
      question: 'What documents do I need?',
      answer: 'Usually your invoice, proof of payment, member number, treatment date, and provider details.',
    },
    {
      question: 'How do authorisations work?',
      answer: 'The process usually starts with treatment details, provider details, documents, and a review step.',
    },
    {
      question: 'How do I request help with my card?',
      answer: 'That can later route to membership admin once the handoff flow is connected.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <SectionShell
      eyebrow="FAQ"
      title="Demo FAQ panel"
      description="Expandable answers let the chatbot stay brief while still giving the user a next step."
    >
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={faq.question} className={`${cardClass} overflow-hidden`}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span className="text-sm font-semibold text-slate-900">{faq.question}</span>
                <span className={`text-slate-400 transition ${isOpen ? 'rotate-90' : ''}`}>›</span>
              </button>
              {isOpen && <p className="px-4 pb-4 text-sm leading-6 text-slate-600">{faq.answer}</p>}
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <button type="button" className={secondaryButtonClass} onClick={() => onShowComponent('ContactOptionsPanel')}>
          Need more help
        </button>
      </div>
    </SectionShell>
  );
}

function EscalationPanel({ onShowComponent }: PanelProps) {
  return (
    <SectionShell
      eyebrow="Escalation"
      title="This should go to a Day1Health consultant"
      description="Use this when the future chatbot needs to surface a human-review path for urgent or sensitive issues."
    >
      <div className="rounded-[9px] border border-rose-200 bg-rose-50 p-4">
        <p className="text-sm leading-6 text-slate-700">
          A Day1Health consultant should review this case directly and help with the next step.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button type="button" className={primaryButtonClass} onClick={() => onShowComponent('CallbackRequestCard')}>
          Request urgent callback
        </button>
        <button type="button" className={secondaryButtonClass} onClick={() => onShowComponent('ContactOptionsPanel')}>
          View contact options
        </button>
      </div>
    </SectionShell>
  );
}

function NavigationPreview({ onNavigateToPlanPage }: PanelProps) {
  return (
    <SectionShell
      eyebrow="Navigation"
      title="Future 'Take me there' preview"
      description="This shows how a future AI action can point to a real page or route."
    >
      <div className={`${cardClass} p-5`}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Target page</p>
        <p className="mt-2 text-xl font-bold text-slate-900">Plans page</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          For now this is a safe placeholder action, but the panel shape is ready for later routing.
        </p>
      </div>

      <div className="mt-5">
        <button type="button" className={primaryButtonClass} onClick={onNavigateToPlanPage}>
          Navigate to plan page
        </button>
      </div>
    </SectionShell>
  );
}

const registry: Record<ManualComponentName, RegistryEntry> = {
  PlanSummaryCard: {
    label: 'Show Plan Summary',
    description: 'Short plan explanation with three next-action buttons.',
    icon: 'PS',
    component: PlanSummaryCard,
  },
  PlanComparisonPanel: {
    label: 'Show Plan Comparison',
    description: 'Compare two to three example plan directions visually.',
    icon: 'PC',
    component: PlanComparisonPanel,
  },
  ClaimsChecklist: {
    label: 'Show Claims Checklist',
    description: 'Quick claims document checklist with a guidance CTA.',
    icon: 'CL',
    component: ClaimsChecklist,
  },
  AuthorisationSteps: {
    label: 'Show Authorisation Steps',
    description: 'Simple step-by-step authorisation timeline.',
    icon: 'AS',
    component: AuthorisationSteps,
  },
  CallbackRequestCard: {
    label: 'Show Callback Request',
    description: 'Visual-only callback request form placeholder.',
    icon: 'CB',
    component: CallbackRequestCard,
  },
  ContactOptionsPanel: {
    label: 'Show Contact Options',
    description: 'Department routing options for common support needs.',
    icon: 'CO',
    component: ContactOptionsPanel,
  },
  FAQPanel: {
    label: 'Show FAQ Panel',
    description: 'Expandable FAQ list with short answers.',
    icon: 'FQ',
    component: FAQPanel,
  },
  EscalationPanel: {
    label: 'Show Escalation Panel',
    description: 'Human-review prompt for urgent or complaint cases.',
    icon: 'ES',
    component: EscalationPanel,
  },
  NavigationPreview: {
    label: 'Show Navigation Preview',
    description: 'Placeholder navigation action for future AI handoff.',
    icon: 'NP',
    component: NavigationPreview,
  },
};

export default function ManualUiLab({ onNavigateToPlanPage }: ManualUiLabProps) {
  const [selectedComponent, setSelectedComponent] = useState<ManualComponentName>('PlanSummaryCard');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    if (typeof window === 'undefined') {
      return 560;
    }

    return getDefaultSidebarWidth(window.innerWidth);
  });
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (isPanelOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isPanelOpen]);

  useEffect(() => {
    const handleResize = () => {
      setSidebarWidth((currentWidth) => clampSidebarWidth(window.innerWidth, currentWidth));
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const nextWidth = clampSidebarWidth(window.innerWidth, event.clientX);
      setSidebarWidth(nextWidth);
    };

    const handlePointerUp = () => {
      setIsResizing(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isResizing]);

  const openComponent = (componentName: ManualComponentName) => {
    setSelectedComponent(componentName);
    setIsPanelOpen(true);
  };

  const ActiveComponent = useMemo(() => registry[selectedComponent].component, [selectedComponent]);

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className={`${shellClass} p-5 sm:p-6`}>
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">Manual triggers</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Click any trigger to open a desktop side panel or mobile bottom sheet with the selected chatbot visual component.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {triggerOrder.map((componentName) => {
              const item = registry[componentName];
              const isActive = selectedComponent === componentName;

              return (
                <button
                  key={componentName}
                  type="button"
                  onClick={() => openComponent(componentName)}
                  className={`rounded-[9px] border p-4 text-left transition ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                      : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-[9px] text-sm font-bold ${isActive ? 'bg-white/15 text-white' : 'bg-white text-emerald-700'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className={`text-base font-semibold ${isActive ? 'text-white' : 'text-slate-900'}`}>{item.label}</p>
                      <p className={`mt-2 text-sm leading-6 ${isActive ? 'text-emerald-50' : 'text-slate-600'}`}>{item.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`${shellClass} p-5 sm:p-6`}>
          <h2 className="text-xl font-semibold text-slate-900">Lab notes</h2>
          <div className="mt-5 space-y-4">
            {[
              'Desktop opens a left-side drawer.',
              'Mobile also keeps the panel on the left side instead of switching to a bottom sheet.',
              'Use the slim vertical edge to drag the panel wider or narrower.',
              'Nested buttons inside the panel can switch to another reusable component.',
              'This is a UI prototype only. No AI, Supabase, member data, claims, or authorisations are connected.',
            ].map((note) => (
              <div key={note} className={`${cardClass} flex items-start gap-3 px-4 py-4`}>
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <p className="text-sm leading-6 text-slate-600">{note}</p>
              </div>
            ))}
          </div>

          <div className={`${cardClass} mt-6 p-4`}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Active preview</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{registry[selectedComponent].label.replace('Show ', '')}</p>
            <p className="mt-1 text-sm text-slate-600">{isPanelOpen ? 'Panel open' : 'Ready to preview'}</p>
            <button type="button" className={`${primaryButtonClass} mt-4`} onClick={() => openComponent(selectedComponent)}>
              Open current preview
            </button>
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 z-40 transition ${isPanelOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <button
          type="button"
          aria-label="Close panel"
          className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
          onClick={() => setIsPanelOpen(false)}
        />

        <div
          className="absolute inset-y-0 left-0"
          style={{ width: `${sidebarWidth}px`, maxWidth: 'calc(100vw - 8px)' }}
        >
          <aside
            className={`relative h-full w-full overflow-hidden rounded-r-[9px] border border-slate-200 bg-slate-100 shadow-2xl transition duration-300 ${
              isPanelOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <button
              type="button"
              aria-label="Resize sidebar"
              className="absolute right-0 top-0 z-20 h-full w-4 translate-x-1/2 touch-none cursor-col-resize"
              onPointerDown={(event) => {
                event.preventDefault();
                setIsResizing(true);
              }}
            >
              <span className="mx-auto block h-full w-px bg-slate-300 transition hover:bg-emerald-500" />
            </button>

            <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white p-4 sm:p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Chatbot component</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">{registry[selectedComponent].label.replace('Show ', '')}</h2>
                <p className="mt-1 text-sm text-slate-600">Manual trigger preview before AI integration.</p>
              </div>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-[9px] border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-white"
                onClick={() => setIsPanelOpen(false)}
              >
                X
              </button>
            </div>

            <div className="h-[calc(100%-6.5rem)] overflow-y-auto p-4 sm:p-5">
              <ActiveComponent
                onShowComponent={openComponent}
                onNavigateToPlanPage={onNavigateToPlanPage || (() => {
                  if (typeof window !== 'undefined') {
                    window.alert('Placeholder navigation action. Route this to the plans page later.');
                  }
                })}
              />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
