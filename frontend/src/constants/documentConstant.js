export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const REQUIRED_DOCUMENTS = [
  {
    id: 'idProof',
    name: 'ID Proof',
    description: "Driver's License, Passport, or State ID",
    accept: '.pdf,.jpg,.jpeg,.png',
    required: true,
  },
  {
    id: 'incomeProof',
    name: 'Income Proof',
    description: 'W-2, Tax Returns, or Employment Letter',
    accept: '.pdf,.jpg,.jpeg,.png',
    required: true,
  },
  {
    id: 'recentPayStubs',
    name: 'Recent Pay Stubs',
    description: 'Last 2 months of pay stubs',
    accept: '.pdf,.jpg,.jpeg,.png',
    required: true,
  },
  {
    id: 'bankStatements',
    name: 'Bank Statements',
    description: "Last month's bank statements",
    accept: '.pdf,.jpg,.jpeg,.png',
    required: true,
  },
];

export const OPTIONAL_DOCUMENTS = [
  {
    id: 'additionalDocuments',
    name: 'Additional Documents',
    description: 'Any additional supporting documents',
    accept: '.pdf,.jpg,.jpeg,.png',
    required: false,
  },
];
