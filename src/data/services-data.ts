// Shared challenge → service data.
// Edit here once; ChallengeMatcher (homepage) and the Services page both
// render from this file.

export const CHALLENGES = [
  { id: 'order-taker',      text: 'Treated like an order-taker' },
  { id: 'change',           text: 'Overwhelmed by constant change' },
  { id: 'beyond-content',   text: 'Need to go beyond courses and content development' },
  { id: 'busy',             text: 'Always busy. Too much work to juggle.' },
  { id: 'going-elsewhere',  text: 'People are going elsewhere for help' },
  { id: 'brought-late',     text: 'Brought in too late to projects' },
  { id: 'quality',          text: 'Quality could be better' },
  { id: 'do-more-less',     text: 'Asked to do more with less' },
] as const;

export interface Service {
  id: string;
  title: string;
  helpsWith: string[];
  description: string;
}

export const SERVICES: Service[] = [
  {
    id: 'strategy',
    title: 'Strategy',
    helpsWith: ['change', 'order-taker', 'going-elsewhere', 'brought-late'],
    description: "Create the strategy for your team and how you'll operate.",
  },
  {
    id: 'process-improvement',
    title: 'Process Improvement',
    helpsWith: ['change', 'busy', 'brought-late', 'quality'],
    description: 'Remodelling and refining processes to increase efficiency, improve effectiveness and become more strategic.',
  },
  {
    id: 'performance-consulting',
    title: 'Performance Consulting',
    helpsWith: ['beyond-content', 'brought-late'],
    description: 'Take the conversation away from content and training and towards improving business results and capability.',
  },
  {
    id: 'id-beyond-content',
    title: 'ID Beyond Content',
    helpsWith: ['beyond-content', 'quality'],
    description: 'Discover ways to build experiences.',
  },
  {
    id: 'design-principles',
    title: 'Design Principles',
    helpsWith: ['quality'],
    description: 'Create a set of design principles that gets your team on the same page when it comes to quality.',
  },
  {
    id: 'team-upskill',
    title: 'Team Upskill',
    helpsWith: ['quality', 'busy'],
    description: 'Build supporting capabilities to execute your strategy, do better work and be more efficient.',
  },
  {
    id: 'positioning',
    title: 'Positioning',
    helpsWith: ['order-taker', 'going-elsewhere', 'brought-late'],
    description: 'Change the perception of L&D within the organisation and the team itself.',
  },
  {
    id: 'opportunities-for-efficiency',
    title: 'Opportunities for Efficiency',
    helpsWith: ['do-more-less', 'busy'],
    description: 'An outside perspective to help you find ways of saving time, effort and money.',
  },
];

// Reference code for each service, indexed by position.
export const refFor = (i: number) => `REF. S-${String(i + 1).padStart(2, '0')}`;
