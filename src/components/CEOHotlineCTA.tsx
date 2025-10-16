import { Lock, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CEOHotlineCTAProps = {
  href?: string; // e.g. "/ceo-hotline" → your 2-step flow entry
  className?: string;
  onClick?: () => void; // use if you open a modal first
  variant?: 'emerald' | 'blue'; // quick theme toggle
};

export default function CEOHotlineCTA({
  href = '/ceo-hotline',
  className,
  onClick,
  variant = 'emerald',
}: CEOHotlineCTAProps) {
  // Map 'emerald' to our brand green palette to stay consistent with site colors
  const palette =
    variant === 'emerald'
      ? 'from-green-500 via-green-600 to-green-700'
      : 'from-sky-500 via-sky-600 to-sky-700';

  const Wrapper: any = href && !onClick ? 'a' : 'button';
  const wrapperProps = href && !onClick ? { href } : { type: 'button', onClick };

  return (
    <Wrapper
      {...(wrapperProps as any)}
      aria-label="Executive Hotline: 2-step link for CEOs & business owners only"
      className={cn(
        'group relative block w-full rounded-2xl p-[2px] transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'focus-visible:ring-green-400/70 dark:focus-visible:ring-green-300/70',
        className
      )}
      data-cta="ceo-hotline"
    >
      <div
        className={cn(
          'rounded-2xl bg-gradient-to-br',
          palette,
          'p-3 shadow-md transition',
          'group-hover:shadow-lg group-active:scale-[0.99]'
        )}
      >
        <div className="flex items-start gap-3 text-white">
          <div
            className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/15"
            aria-hidden="true"
          >
            <Crown className="h-4 w-4 opacity-90" />
          </div>

          <div className="flex-1 leading-tight">
            <div className="font-semibold text-sm sm:text-[15px]">Executive Hotline:</div>
            <div className="text-xs sm:text-[13px] opacity-95">
              2-step link for CEOs & Business Owners only
            </div>
          </div>

          <Lock className="h-4 w-4 mt-1 opacity-90" aria-hidden="true" />
        </div>
      </div>

      {/* subtle outer glow on hover */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -inset-0.5 rounded-3xl blur transition',
          variant === 'emerald' ? 'bg-green-500/0 group-hover:bg-green-500/20' : 'bg-sky-500/0 group-hover:bg-sky-500/20'
        )}
      />
    </Wrapper>
  );
}
