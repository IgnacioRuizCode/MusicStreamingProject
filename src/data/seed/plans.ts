import { type Plan } from '../../types/types';

export const SEED_PLANS: Plan[] = [
  {
    id: 'plan-free',
    name: 'Free',
    price: 0,
    benefits: ['Ad-supported music', 'Shuffle play', 'Standard audio quality'],
    featured: false,
  },
  {
    id: 'plan-individual',
    name: 'Individual',
    price: 9.99,
    benefits: ['Ad-free music', 'Download to listen offline', 'High audio quality', 'Cancel anytime'],
    featured: true,
  },
  {
    id: 'plan-duo',
    name: 'Duo',
    price: 12.99,
    benefits: ['2 Premium accounts', 'Ad-free music', 'Offline playback', 'Duo Mix playlist'],
    featured: false,
  },
  {
    id: 'plan-family',
    name: 'Family',
    price: 15.99,
    benefits: ['Up to 6 Premium accounts', 'Block explicit music', 'Ad-free music', 'Offline playback'],
    featured: false,
  },
];