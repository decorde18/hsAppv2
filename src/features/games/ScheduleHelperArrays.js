export const likelihoodArray = [
  { value: 'unnecessary', label: 'Unnecessary', rank: 5 },
  { value: 'unlikely', label: 'Unlikely', rank: 4 },
  { value: 'hopeful', label: 'Likely/Hopeful', rank: 3 },
  { value: 'likely', label: 'Highly Likely', rank: 2 },
  { value: 'mandatory', label: 'Mandatory', rank: 1 },
];
export const statusArray = [
  { value: 'noContact', label: 'Not Contacted', rank: 5, newBtn: true },
  { value: 'unable', label: 'Unable To Schedule', rank: 0, newBtn: false },
  { value: 'pending', label: 'Status Pending', rank: 4, newBtn: false },
  { value: 'contacted', label: 'Contacted', rank: 3, newBtn: false },
  { value: 'scheduled', label: 'Scheduled', rank: 1, newBtn: false },
];
//Levels for liklihood of scheduling 1 Mandatory 2 Highly Likely 3 Likely/Hopeful 4 Unlikely 5 Unnecessary
