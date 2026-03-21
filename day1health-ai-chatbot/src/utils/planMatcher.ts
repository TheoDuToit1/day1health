import { InsurancePlan, UserProfile, PlanRecommendation } from '../types';

export function calculatePlanPrice(
  plan: InsurancePlan,
  adults: number,
  children: number
): number {
  const { category, variant, basePrice, adultPrice, childPrice } = plan;

  // Day-to-Day plans have special pricing
  if (category === 'day-to-day') {
    if (variant === 'single') {
      return basePrice + (childPrice || 0) * children;
    } else if (variant === 'couple') {
      return basePrice + (childPrice || 0) * children;
    } else if (variant === 'family') {
      return (adultPrice || basePrice) * adults + (childPrice || 0) * children;
    }
  }

  // Hospital, Comprehensive, and Senior plans
  const pricePerAdult = adultPrice || basePrice;
  const pricePerChild = childPrice || 0;

  return pricePerAdult * adults + pricePerChild * children;
}

export function recommendPlans(
  allPlans: InsurancePlan[],
  userProfile: UserProfile
): PlanRecommendation[] {
  const { budget, familySize, age, priorities } = userProfile;
  const { adults, children } = familySize;

  // Filter out senior plans if user is under 60
  let eligiblePlans = allPlans.filter(plan => {
    if (age < 60 && plan.category === 'senior') return false;
    if (age >= 60 && plan.category !== 'senior') return false;
    return true;
  });

  // Filter by variant based on family composition
  eligiblePlans = eligiblePlans.filter(plan => {
    if (adults === 1 && children === 0) return plan.variant === 'single';
    if (adults === 2 && children === 0) return plan.variant === 'couple' || plan.variant === 'single';
    if (children > 0) return plan.variant === 'family' || plan.variant === 'couple' || plan.variant === 'single';
    return true;
  });

  // Calculate prices and filter by budget (with 10% flexibility)
  const affordablePlans = eligiblePlans
    .map(plan => ({
      plan,
      price: calculatePlanPrice(plan, adults, children),
    }))
    .filter(({ price }) => price <= budget * 1.1);

  // Score each plan
  const scoredPlans = affordablePlans.map(({ plan, price }) => {
    let score = 0;
    const reasons: string[] = [];
    const pros: string[] = [];
    const cons: string[] = [];

    // Age-based scoring
    if (age >= 60 && plan.category === 'senior') {
      score += 30;
      reasons.push('Designed specifically for seniors');
      pros.push('Age-appropriate coverage');
    }

    // Priority-based scoring
    if (priorities.includes('hospital') || priorities.includes('emergency')) {
      if (plan.category === 'hospital') {
        score += 25;
        reasons.push('Covers hospital stays and emergencies');
        pros.push('Protection against major medical expenses');
      } else if (plan.category === 'comprehensive') {
        score += 20;
        reasons.push('Includes hospital coverage plus more');
      }
    }

    if (priorities.includes('day-to-day') || priorities.includes('doctor') || priorities.includes('gp')) {
      if (plan.category === 'day-to-day') {
        score += 25;
        reasons.push('Covers regular doctor visits');
        pros.push('Affordable day-to-day medical care');
      } else if (plan.category === 'comprehensive') {
        score += 20;
        reasons.push('Includes day-to-day coverage');
      }
    }

    if (priorities.includes('comprehensive') || priorities.includes('everything') || priorities.includes('full')) {
      if (plan.category === 'comprehensive') {
        score += 30;
        reasons.push('Complete coverage for all medical needs');
        pros.push('No need for multiple plans');
      }
    }

    if (priorities.includes('chronic') || priorities.includes('medication')) {
      if (plan.category === 'comprehensive') {
        score += 20;
        reasons.push('Includes chronic medication benefits');
        pros.push('Ongoing medication covered');
      }
    }

    // Family size scoring
    if (children > 0) {
      if (plan.variant === 'family') {
        score += 15;
        reasons.push('Family-friendly plan structure');
      }
      if (plan.category === 'comprehensive') {
        score += 10;
        reasons.push('Best value for families with children');
      }
    }

    if (adults === 2 && children === 0 && plan.variant === 'couple') {
      score += 15;
      reasons.push('Optimized for couples');
    }

    if (adults === 1 && children === 0 && plan.variant === 'single') {
      score += 15;
      reasons.push('Perfect for individuals');
    }

    // Budget efficiency scoring
    const budgetUtilization = price / budget;
    if (budgetUtilization >= 0.8 && budgetUtilization <= 1.0) {
      score += 20;
      reasons.push('Excellent value within your budget');
      pros.push('Maximizes your budget');
    } else if (budgetUtilization < 0.8) {
      score += 10;
      reasons.push('Affordable option with room in budget');
      pros.push(`Saves R${Math.round(budget - price)}/month`);
    } else if (budgetUtilization <= 1.1) {
      score += 5;
      cons.push(`Slightly over budget by R${Math.round(price - budget)}/month`);
    }

    // Tier-based pros/cons
    if (plan.tier === 'executive') {
      pros.push('Highest benefit limits');
      cons.push('Premium pricing');
    } else if (plan.tier === 'platinum') {
      pros.push('Enhanced benefit limits');
    } else if (plan.tier === 'value-plus') {
      pros.push('Most affordable option');
      cons.push('Lower benefit limits');
    }

    // Category-based cons
    if (plan.category === 'hospital') {
      cons.push('No day-to-day doctor visit coverage');
    } else if (plan.category === 'day-to-day') {
      cons.push('No hospital stay coverage');
    }

    return {
      plan,
      monthlyPrice: price,
      matchScore: score,
      reasons: reasons.slice(0, 3), // Top 3 reasons
      pros: pros.slice(0, 3),
      cons: cons.slice(0, 2),
    };
  });

  // Sort by score and return top 3
  return scoredPlans
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}

export function comparePlans(plans: InsurancePlan[]): string {
  if (plans.length === 0) return 'No plans to compare.';
  if (plans.length === 1) return `You're looking at the ${plans[0].planName}.`;

  const categories = [...new Set(plans.map(p => p.category))];
  const tiers = [...new Set(plans.map(p => p.tier).filter(Boolean))];

  let comparison = `Comparing ${plans.length} plans:\n\n`;

  plans.forEach((plan, index) => {
    comparison += `${index + 1}. ${plan.planName}\n`;
    comparison += `   Category: ${plan.category}\n`;
    if (plan.tier) comparison += `   Tier: ${plan.tier}\n`;
    comparison += `   Base Price: R${plan.basePrice}/month\n`;
    if (plan.adultPrice) comparison += `   Per Adult: R${plan.adultPrice}\n`;
    if (plan.childPrice) comparison += `   Per Child: R${plan.childPrice}\n`;
    comparison += `\n`;
  });

  return comparison;
}
