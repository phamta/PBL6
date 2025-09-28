export const MOU_STATUS = {
  PROPOSING: 'proposing',
  REVIEWING: 'reviewing',
  PENDING_SUPPLEMENT: 'pending_supplement',
  APPROVED: 'approved',
  SIGNED: 'signed',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  TERMINATED: 'terminated',
} as const;

export const MOU_STATUS_VALUES = Object.values(MOU_STATUS);

export const MOU_TYPE = {
  RESEARCH: 'research',
  EDUCATION: 'education',
  EXCHANGE: 'exchange',
  COOPERATION: 'cooperation',
} as const;

export const MOU_TYPE_VALUES = Object.values(MOU_TYPE);

export const MOU_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const MOU_PRIORITY_VALUES = Object.values(MOU_PRIORITY);

export type MouStatus = typeof MOU_STATUS[keyof typeof MOU_STATUS];
export type MouType = typeof MOU_TYPE[keyof typeof MOU_TYPE];
export type MouPriority = typeof MOU_PRIORITY[keyof typeof MOU_PRIORITY];
