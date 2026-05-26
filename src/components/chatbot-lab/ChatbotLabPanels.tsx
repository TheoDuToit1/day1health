/* eslint-disable react-refresh/only-export-components */
import { useState, type ComponentType, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileStack,
  GitCompareArrows,
  Headphones,
  MessageCircleQuestion,
  PhoneCall,
  Route,
  ShieldAlert,
} from 'lucide-react';

export type ChatbotLabComponentName =
  | 'PlanSummaryCard'
  | 'PlanComparisonPanel'
  | 'ClaimsChecklist'
  | 'AuthorisationSteps'
  | 'CallbackRequestCard'
  | 'ContactOptionsPanel'
  | 'FAQPanel'
  | 'EscalationPanel'
  | 'NavigationPreview';

export interface ChatbotLabComponentProps {
  isDark: boolean;
  onShowComponent: (componentName: ChatbotLabComponentName) => void;
  onNavigateToPlanPage: () => void;
}

interface ChatbotLabRegistryEntry {
  label: string;
  blurb: string;
  icon: ComponentType<{ className?: string }>;
  component: ComponentType<ChatbotLabComponentProps>;
}

const sectionSurface = (isDark: boolean) =>
  isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white';

const softSurface = (isDark: boolean) =>
  isDark ? 'border-gray-800 bg-gray-950/70' : 'border-gray-200 bg-gray-50';

const titleText = (isDark: boolean) => (isDark ? 'text-white' : 'text-gray-900');
const bodyText = (isDark: boolean) => (isDark ? 'text-gray-300' : 'text-gray-600');
const subtleText = (isDark: boolean) => (isDark ? 'text-gray-400' : 'text-gray-500');

const primaryButtonClass =
  'inline-flex items-center justify-center rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700';

const secondaryButton = (isDark: boolean) =>
  `inline-flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
    isDark
      ? 'border-gray-700 bg-gray-900 text-gray-100 hover:bg-gray-800'
      : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
  }`;

const badgeClass = (isDark: boolean) =>
  `inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
    isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
  }`;

function PanelSection({
  isDark,
  eyebrow,
  title,
  description,
  children,
}: {
  isDark: boolean;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-3xl border p-5 sm:p-6 ${sectionSurface(isDark)}`}>
      <div className="mb-5">
        <span className={badgeClass(isDark)}>{eyebrow}</span>
        <h2 className={`mt-4 text-2xl font-bold ${titleText(isDark)}`}>{title}</h2>
        <p className={`mt-2 text-sm leading-6 ${bodyText(isDark)}`}>{description}</p>
      </div>
      {children}
    </div>
  );
}

function PlanSummaryCard({ isDark, onShowComponent, onNavigateToPlanPage }: ChatbotLabComponentProps) {
  const highlights = [
    'Built for everyday care with short, clear member guidance.',
    'Keeps the next action visible instead of hiding it in a long answer.',
    'Lets the chatbot pivot into visuals, navigation, or a callback request.',
  ];

  return (
    <PanelSection
      isDark={isDark}
      eyebrow="Plan snapshot"
      title="Day-to-day cover at a glance"
      description="This is the kind of short summary the chatbot can surface when someone asks what a plan is for."
    >
      <div className={`rounded-2xl border p-4 ${softSurface(isDark)}`}>
        <p className={`text-base font-semibold ${titleText(isDark)}`}>Plan summary title</p>
        <p className={`mt-2 text-sm leading-6 ${bodyText(isDark)}`}>
          A friendly overview that explains what the plan helps with before showing the next action.
        </p>
        <ul className="mt-4 space-y-3">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              <span className={`text-sm leading-6 ${bodyText(isDark)}`}>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <button type="button" className={primaryButtonClass} onClick={onNavigateToPlanPage}>
          Take me there
        </button>
        <button
          type="button"
          className={secondaryButton(isDark)}
          onClick={() => onShowComponent('PlanComparisonPanel')}
        >
          Show visually
        </button>
        <button
          type="button"
          className={secondaryButton(isDark)}
          onClick={() => onShowComponent('CallbackRequestCard')}
        >
          Request callback
        </button>
      </div>
    </PanelSection>
  );
}

function PlanComparisonPanel({ isDark, onShowComponent }: ChatbotLabComponentProps) {
  const plans = [
    {
      name: 'Starter Day-to-Day',
      tone: 'Everyday basics',
      benefits: ['GP visits', 'Acute medicine', 'Network-driven value'],
    },
    {
      name: 'Hospital Core',
      tone: 'In-hospital support',
      benefits: ['Admission guidance', 'Emergency focus', 'Authorisation path'],
    },
    {
      name: 'Comprehensive Plus',
      tone: 'Broader support',
      benefits: ['Day-to-day + hospital', 'More guided benefits', 'Stronger flexibility'],
    },
  ];

  const benefitRows = [
    ['GP access', 'Included', 'Focused network', 'Included'],
    ['Hospital guidance', 'Optional path', 'Core feature', 'Core feature'],
    ['Claim support', 'Basic', 'Moderate', 'Expanded'],
  ];

  return (
    <PanelSection
      isDark={isDark}
      eyebrow="Comparison"
      title="Compare example plan directions"
      description="A chatbot response can open a quick visual comparison instead of listing benefits in plain text."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className={`rounded-2xl border p-4 ${softSurface(isDark)}`}>
            <p className={`text-lg font-semibold ${titleText(isDark)}`}>{plan.name}</p>
            <p className="mt-1 text-sm font-medium text-green-600">{plan.tone}</p>
            <ul className="mt-4 space-y-2">
              {plan.benefits.map((benefit) => (
                <li key={benefit} className={`flex items-center gap-2 text-sm ${bodyText(isDark)}`}>
                  <Check className="h-4 w-4 text-green-600" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={`mt-5 overflow-hidden rounded-2xl border ${sectionSurface(isDark)}`}>
        <div className={`grid grid-cols-4 border-b px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] ${subtleText(isDark)} ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <span>Benefit</span>
          <span>Starter</span>
          <span>Hospital</span>
          <span>Comprehensive</span>
        </div>
        {benefitRows.map(([benefit, starter, hospital, comprehensive]) => (
          <div
            key={benefit}
            className={`grid grid-cols-4 px-4 py-3 text-sm ${bodyText(isDark)} ${isDark ? 'border-t border-gray-800' : 'border-t border-gray-200'}`}
          >
            <span className={`font-medium ${titleText(isDark)}`}>{benefit}</span>
            <span>{starter}</span>
            <span>{hospital}</span>
            <span>{comprehensive}</span>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <button
          type="button"
          className={primaryButtonClass}
          onClick={() => onShowComponent('CallbackRequestCard')}
        >
          Help me choose
        </button>
      </div>
    </PanelSection>
  );
}

function ClaimsChecklist({ isDark, onShowComponent }: ChatbotLabComponentProps) {
  const items = [
    'Invoice',
    'Proof of payment',
    'Member number',
    'Date of treatment',
    'Provider or practice details',
  ];

  return (
    <PanelSection
      isDark={isDark}
      eyebrow="Claims"
      title="Claim guidance checklist"
      description="Use this when the chatbot needs to show a short, practical list before guiding the member further."
    >
      <div className="grid gap-3">
        {items.map((item) => (
          <div
            key={item}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-4 ${softSurface(isDark)}`}
          >
            <FileCheck2 className="h-5 w-5 shrink-0 text-green-600" />
            <span className={`text-sm font-medium ${titleText(isDark)}`}>{item}</span>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <button
          type="button"
          className={primaryButtonClass}
          onClick={() => onShowComponent('ContactOptionsPanel')}
        >
          Start claim guidance
        </button>
      </div>
    </PanelSection>
  );
}

function AuthorisationSteps({ isDark, onShowComponent }: ChatbotLabComponentProps) {
  const steps = [
    'Ask about treatment or procedure',
    'Provide member and provider details',
    'Submit supporting documents',
    'Day1Health team reviews',
    'Member receives next step',
  ];

  return (
    <PanelSection
      isDark={isDark}
      eyebrow="Authorisations"
      title="Authorisation process preview"
      description="A compact visual timeline helps members understand the sequence before they call or upload anything."
    >
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`mt-2 h-10 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
              )}
            </div>
            <div className={`flex-1 rounded-2xl border px-4 py-4 ${softSurface(isDark)}`}>
              <p className={`text-sm font-medium ${titleText(isDark)}`}>{step}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <button
          type="button"
          className={secondaryButton(isDark)}
          onClick={() => onShowComponent('ContactOptionsPanel')}
        >
          View contact options
        </button>
      </div>
    </PanelSection>
  );
}

function CallbackRequestCard({ isDark }: ChatbotLabComponentProps) {
  return (
    <PanelSection
      isDark={isDark}
      eyebrow="Callback"
      title="Request a Day1Health callback"
      description="This is visual-only for now. It lets the future chatbot show the form shape without sending anything."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: 'Name', placeholder: 'Your full name', wide: false },
          { label: 'Phone', placeholder: 'Your phone number', wide: false },
          { label: 'Reason', placeholder: 'Why do you need help today?', wide: true },
          { label: 'Preferred time', placeholder: 'Morning, afternoon, or specific time', wide: true },
        ].map((field) => (
          <label key={field.label} className={field.wide ? 'sm:col-span-2' : ''}>
            <span className={`mb-2 block text-sm font-medium ${titleText(isDark)}`}>{field.label}</span>
            {field.label === 'Reason' ? (
              <textarea
                rows={4}
                placeholder={field.placeholder}
                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors ${
                  isDark
                    ? 'border-gray-700 bg-gray-950 text-white placeholder:text-gray-500 focus:border-green-500'
                    : 'border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-green-500'
                }`}
              />
            ) : (
              <input
                type="text"
                placeholder={field.placeholder}
                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors ${
                  isDark
                    ? 'border-gray-700 bg-gray-950 text-white placeholder:text-gray-500 focus:border-green-500'
                    : 'border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-green-500'
                }`}
              />
            )}
          </label>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className={`text-xs ${subtleText(isDark)}`}>Prototype only. No submission is connected yet.</p>
        <button type="button" className={primaryButtonClass}>
          Request callback
        </button>
      </div>
    </PanelSection>
  );
}

function ContactOptionsPanel({ isDark }: ChatbotLabComponentProps) {
  const departments = [
    ['Claims', 'Claim documents, statuses, and guidance'],
    ['Authorisations', 'Admission approvals and procedure questions'],
    ['Membership admin', 'Member details and admin support'],
    ['Debit order / payments', 'Billing and payment support'],
    ['Sales', 'New plan interest and product questions'],
    ['Complaints', 'Formal review and service concerns'],
  ];

  return (
    <PanelSection
      isDark={isDark}
      eyebrow="Contact routing"
      title="Choose the right team"
      description="The chatbot can use this to steer people toward the correct department before a human handoff."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {departments.map(([name, description]) => (
          <button
            key={name}
            type="button"
            className={`rounded-2xl border p-4 text-left transition-colors ${softSurface(isDark)} ${isDark ? 'hover:bg-gray-900' : 'hover:bg-white'}`}
          >
            <p className={`text-base font-semibold ${titleText(isDark)}`}>{name}</p>
            <p className={`mt-2 text-sm leading-6 ${bodyText(isDark)}`}>{description}</p>
          </button>
        ))}
      </div>
    </PanelSection>
  );
}

function FAQPanel({ isDark, onShowComponent }: ChatbotLabComponentProps) {
  const [openItem, setOpenItem] = useState(0);
  const faqs = [
    {
      question: 'How do I claim?',
      answer: 'Start with the basic checklist, then the chatbot can guide you to the correct claims support path.',
    },
    {
      question: 'What documents do I need?',
      answer: 'Typical claim support starts with your invoice, proof of payment, member number, treatment date, and provider details.',
    },
    {
      question: 'How do authorisations work?',
      answer: 'The process usually starts with treatment details, provider information, supporting documents, and a review step.',
    },
    {
      question: 'How do I request help with my card?',
      answer: 'The chatbot can route card or membership questions to the membership admin team when that flow is connected.',
    },
  ];

  return (
    <PanelSection
      isDark={isDark}
      eyebrow="FAQ panel"
      title="Demo FAQ responses"
      description="Short expandable answers keep the response compact while still giving the member a clear next step."
    >
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openItem === index;

          return (
            <div key={faq.question} className={`overflow-hidden rounded-2xl border ${softSurface(isDark)}`}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                onClick={() => setOpenItem(isOpen ? -1 : index)}
              >
                <span className={`text-sm font-semibold ${titleText(isDark)}`}>{faq.question}</span>
                <ArrowRight className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''} ${subtleText(isDark)}`} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <p className={`px-4 pb-4 text-sm leading-6 ${bodyText(isDark)}`}>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <button
          type="button"
          className={secondaryButton(isDark)}
          onClick={() => onShowComponent('ContactOptionsPanel')}
        >
          Need more help
        </button>
      </div>
    </PanelSection>
  );
}

function EscalationPanel({ isDark, onShowComponent }: ChatbotLabComponentProps) {
  return (
    <PanelSection
      isDark={isDark}
      eyebrow="Escalation"
      title="This case should move to a consultant"
      description="Use this when the chatbot identifies a complaint, urgent issue, or anything that needs human review."
    >
      <div className={`rounded-2xl border p-5 ${isDark ? 'border-red-900/60 bg-red-950/30' : 'border-red-200 bg-red-50'}`}>
        <p className={`text-sm leading-6 ${titleText(isDark)}`}>
          A Day1Health consultant should review this case directly to help with the next step.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className={primaryButtonClass}
          onClick={() => onShowComponent('CallbackRequestCard')}
        >
          Request urgent callback
        </button>
        <button
          type="button"
          className={secondaryButton(isDark)}
          onClick={() => onShowComponent('ContactOptionsPanel')}
        >
          View contact options
        </button>
      </div>
    </PanelSection>
  );
}

function NavigationPreview({ isDark, onNavigateToPlanPage }: ChatbotLabComponentProps) {
  return (
    <PanelSection
      isDark={isDark}
      eyebrow="Navigation"
      title="Future ‘Take me there’ preview"
      description="This shows how the chatbot can attach a route target to a visual response."
    >
      <div className={`rounded-2xl border p-5 ${softSurface(isDark)}`}>
        <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${subtleText(isDark)}`}>Target page</p>
        <p className={`mt-2 text-xl font-bold ${titleText(isDark)}`}>Plans page</p>
        <p className={`mt-2 text-sm leading-6 ${bodyText(isDark)}`}>
          A future action can send the member straight into plan details once they confirm the direction they want.
        </p>
      </div>

      <div className="mt-5">
        <button type="button" className={primaryButtonClass} onClick={onNavigateToPlanPage}>
          Navigate to plan page
        </button>
      </div>
    </PanelSection>
  );
}

export const chatbotLabTriggerOrder: ChatbotLabComponentName[] = [
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

export const chatbotLabRegistry: Record<ChatbotLabComponentName, ChatbotLabRegistryEntry> = {
  PlanSummaryCard: {
    label: 'Show Plan Summary',
    blurb: 'Short plan explanation with action buttons.',
    icon: ClipboardList,
    component: PlanSummaryCard,
  },
  PlanComparisonPanel: {
    label: 'Show Plan Comparison',
    blurb: 'Visual comparison between example plan directions.',
    icon: GitCompareArrows,
    component: PlanComparisonPanel,
  },
  ClaimsChecklist: {
    label: 'Show Claims Checklist',
    blurb: 'Checklist of items a member may need for a claim.',
    icon: FileStack,
    component: ClaimsChecklist,
  },
  AuthorisationSteps: {
    label: 'Show Authorisation Steps',
    blurb: 'Timeline view of the authorisation journey.',
    icon: Route,
    component: AuthorisationSteps,
  },
  CallbackRequestCard: {
    label: 'Show Callback Request',
    blurb: 'Visual-only callback form placeholder.',
    icon: PhoneCall,
    component: CallbackRequestCard,
  },
  ContactOptionsPanel: {
    label: 'Show Contact Options',
    blurb: 'Department routing options for common queries.',
    icon: Headphones,
    component: ContactOptionsPanel,
  },
  FAQPanel: {
    label: 'Show FAQ Panel',
    blurb: 'Expandable quick-answer panel.',
    icon: MessageCircleQuestion,
    component: FAQPanel,
  },
  EscalationPanel: {
    label: 'Show Escalation Panel',
    blurb: 'Human-review prompt for urgent or sensitive cases.',
    icon: ShieldAlert,
    component: EscalationPanel,
  },
  NavigationPreview: {
    label: 'Show Navigation Preview',
    blurb: 'Preview of future component-driven page navigation.',
    icon: ArrowRight,
    component: NavigationPreview,
  },
};
