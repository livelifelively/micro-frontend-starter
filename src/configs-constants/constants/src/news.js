export const TIMEOUT = 10000;

// export const NEWS_THEMES = [
//  'Funding',
//  'Acquisition',
//  'Events',
//  'Partnerships',
//  'Technologies',
//  'Expansion',
//  'Growth',
//  'Leadership Changes',
//  'Product Launches',
//  'Executive Movements',
//  'IPOS',
// ];

export const NEWS_THEMES = {
  all: {
    label: 'All',
    name: 'All News Themes',
    bgColor: '#71FCF0',
    color: '#26C6B8',
  },
  funding: {
    label: 'Funding',
    name: 'Funding',
    bgColor: '#AEFCD2',
    color: '#62BC8B',
  },
  acquisition: {
    label: 'Acquisition',
    name: 'Acquisition',
    bgColor: '#FFE5E8',
    color: '#EB949E',
  },
  events: {
    label: 'Events',
    name: 'Events',
    bgColor: '#FFF1E5',
    color: '#E3A46D',
  },
  partnerships: {
    label: 'Partnerships',
    name: 'Partnerships',
    bgColor: '#FFE5E5',
    color: '#FC8888',
  },
  // technologies: {
  //   label: 'Technologies',
  //   bgColor: '#BEF0FD',
  //   color: '#14A8D3',
  // },
  expansion: {
    label: 'Expansion',
    name: 'Expansion',
    bgColor: '#FFF7BE',
    color: '#BEAD2C',
  },
  growth: {
    label: 'Growth',
    name: 'Growth',
    bgColor: '#71FCF0',
    color: '#26C6B8',
  },
  leadership_changes: {
    label: 'Leadership Changes',
    name: 'Leadership Changes',
    bgColor: '#FBE0FC',
    color: '#E38BE6',
  },
  product_launches: {
    label: 'Product Launches',
    name: 'Product Launches',
    bgColor: '#E4FFD0',
    color: '#8FB572',
  },
  executive_movements: {
    label: 'Executive Movements',
    name: 'Executive Movements',
    bgColor: '#FBE0FC',
    color: '#E38BE6',
  },
  ipos: {
    label: 'IPOs',
    name: 'IPOs',
    bgColor: '#E8E0FF',
    color: '#9883D3',
  },
};

export const NEWS_DATE_RANGE = [
  {
    label: 'Last 1 Day',
    value: 1,
    default: false,
  },
  {
    label: 'Last 7 Days',
    value: 7,
    default: false,
  },
  {
    label: 'Last 14 Days',
    value: 14,
    default: false,
  },
  {
    label: 'Last 30 Days',
    value: 30,
    default: false,
  },
  {
    label: 'Last 90 Days',
    value: 90,
    default: true,
  },
];

export const SAVED_FILTER_TYPE = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Lead',
    value: 'lead',
  },
  {
    label: 'Company',
    value: 'company',
  },
  // {
  //   label: 'Technology',
  //   value: 'technology',
  // },
  // {
  //   label: 'Keyword',
  //   value: 'keyword',
  // },
];

export const FILTER_TYPE = {
  lead: {
    bgColor: '#FFFBDD',
    color: '#DDC932',
  },
  company: {
    bgColor: '#FFF1E5',
    color: '#E3A46D',
  },
  technology: {
    bgColor: '#D0F5FF',
    color: '#14A8D3',
  },
  keyword: {
    bgColor: '#26C6B8',
    color: '#E3A46D',
  },
};

export const FILTER_PAGE_MAPPER = {
  lead: 'leads',
  company: 'companies',
  technology: 'technologies',
  keyword: 'keywords',
};

export const USER_ROLES_CONSTANT = {
  5: 'FREETRIAL',
  7: 'STARTER',
  8: 'GROWTH',
  9: 'PROFESSIONAL',
  10: 'FOREVER FREE',
};

export const CAPTURE_EVENT_NAME_CONSTANT = {
  SEARCH: 'search',
  GLOBAL_SEARCH_EVENT: 'global_search_event',
};

export const TYPES_MAPPER = {
  lead: 'lead-details',
  company: 'company-details',
  keyword: 'keywords-details',
  technology: 'technologies-details',
};
