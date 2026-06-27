// lib/country-codes.ts
export interface CountryDialCode {
  name: string;
  code: string;  // ISO 3166-1 alpha-2
  dial: string;  // e.g. "+254"
  flag: string;  // emoji
}

export const COUNTRY_DIAL_CODES: CountryDialCode[] = [
  { name: "Afghanistan",            code: "AF", dial: "+93",   flag: "🇦🇫" },
  { name: "Albania",                code: "AL", dial: "+355",  flag: "🇦🇱" },
  { name: "Algeria",                code: "DZ", dial: "+213",  flag: "🇩🇿" },
  { name: "Argentina",              code: "AR", dial: "+54",   flag: "🇦🇷" },
  { name: "Australia",              code: "AU", dial: "+61",   flag: "🇦🇺" },
  { name: "Austria",                code: "AT", dial: "+43",   flag: "🇦🇹" },
  { name: "Belgium",                code: "BE", dial: "+32",   flag: "🇧🇪" },
  { name: "Brazil",                 code: "BR", dial: "+55",   flag: "🇧🇷" },
  { name: "Canada",                 code: "CA", dial: "+1",    flag: "🇨🇦" },
  { name: "China",                  code: "CN", dial: "+86",   flag: "🇨🇳" },
  { name: "Denmark",                code: "DK", dial: "+45",   flag: "🇩🇰" },
  { name: "Egypt",                  code: "EG", dial: "+20",   flag: "🇪🇬" },
  { name: "Ethiopia",               code: "ET", dial: "+251",  flag: "🇪🇹" },
  { name: "Finland",                code: "FI", dial: "+358",  flag: "🇫🇮" },
  { name: "France",                 code: "FR", dial: "+33",   flag: "🇫🇷" },
  { name: "Germany",                code: "DE", dial: "+49",   flag: "🇩🇪" },
  { name: "Ghana",                  code: "GH", dial: "+233",  flag: "🇬🇭" },
  { name: "India",                  code: "IN", dial: "+91",   flag: "🇮🇳" },
  { name: "Ireland",                code: "IE", dial: "+353",  flag: "🇮🇪" },
  { name: "Italy",                  code: "IT", dial: "+39",   flag: "🇮🇹" },
  { name: "Japan",                  code: "JP", dial: "+81",   flag: "🇯🇵" },
  { name: "Kenya",                  code: "KE", dial: "+254",  flag: "🇰🇪" },
  { name: "Mexico",                 code: "MX", dial: "+52",   flag: "🇲🇽" },
  { name: "Morocco",                code: "MA", dial: "+212",  flag: "🇲🇦" },
  { name: "Mozambique",             code: "MZ", dial: "+258",  flag: "🇲🇿" },
  { name: "Namibia",                code: "NA", dial: "+264",  flag: "🇳🇦" },
  { name: "Netherlands",            code: "NL", dial: "+31",   flag: "🇳🇱" },
  { name: "New Zealand",            code: "NZ", dial: "+64",   flag: "🇳🇿" },
  { name: "Nigeria",                code: "NG", dial: "+234",  flag: "🇳🇬" },
  { name: "Norway",                 code: "NO", dial: "+47",   flag: "🇳🇴" },
  { name: "Poland",                 code: "PL", dial: "+48",   flag: "🇵🇱" },
  { name: "Portugal",               code: "PT", dial: "+351",  flag: "🇵🇹" },
  { name: "Rwanda",                 code: "RW", dial: "+250",  flag: "🇷🇼" },
  { name: "Saudi Arabia",           code: "SA", dial: "+966",  flag: "🇸🇦" },
  { name: "South Africa",           code: "ZA", dial: "+27",   flag: "🇿🇦" },
  { name: "Spain",                  code: "ES", dial: "+34",   flag: "🇪🇸" },
  { name: "Sweden",                 code: "SE", dial: "+46",   flag: "🇸🇪" },
  { name: "Switzerland",            code: "CH", dial: "+41",   flag: "🇨🇭" },
  { name: "Tanzania",               code: "TZ", dial: "+255",  flag: "🇹🇿" },
  { name: "Uganda",                 code: "UG", dial: "+256",  flag: "🇺🇬" },
  { name: "United Arab Emirates",   code: "AE", dial: "+971",  flag: "🇦🇪" },
  { name: "United Kingdom",         code: "GB", dial: "+44",   flag: "🇬🇧" },
  { name: "United States",          code: "US", dial: "+1",    flag: "🇺🇸" },
  { name: "Zambia",                 code: "ZM", dial: "+260",  flag: "🇿🇲" },
  { name: "Zimbabwe",               code: "ZW", dial: "+263",  flag: "🇿🇼" },
];

export const DESTINATION_OPTIONS = [
  "Masai Mara, Kenya",
  "Amboseli, Kenya",
  "Ol Pejeta, Kenya",
  "Samburu, Kenya",
  "Tsavo East, Kenya",
  "Tsavo West, Kenya",
  "Lake Nakuru, Kenya",
  "Serengeti, Tanzania",
  "Ngorongoro Crater, Tanzania",
  "Tarangire, Tanzania",
  "Zanzibar, Tanzania",
];

export const HOLIDAY_TYPES = [
  "Wildlife Safari",
  "Gorilla Trekking",
  "Beach & Safari Combo",
  "Birding Safari",
  "Photography Safari",
  "Honeymoon Safari",
  "Family Safari",
  "Walking Safari",
  "Cultural Safari",
  "Luxury Safari",
  "Budget Safari",
];

export const ACCOMMODATION_CLASSIFICATIONS = [
  { value: "Economy",       label: "Economy",        description: "Comfortable, well-run camps & lodges" },
  { value: "Comfort",     label: "Comfort",      description: "Mid-range quality with excellent service" },
  { value: "Luxury",       label: "Luxury",        description: "Premium camps with exceptional amenities" },
  { value: "Superior Luxury", label: "Superior Luxury",  description: "Exclusive, world-class safari properties" },
];

export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria",
  "Belgium", "Brazil", "Canada", "China", "Denmark", "Egypt", "Ethiopia",
  "Finland", "France", "Germany", "Ghana", "Greece", "Hungary", "Iceland",
  "India", "Ireland", "Italy", "Japan", "Kenya", "Luxembourg", "Mexico",
  "Morocco", "Mozambique", "Namibia", "Netherlands", "New Zealand", "Nigeria",
  "Norway", "Poland", "Portugal", "Rwanda", "Saudi Arabia", "South Africa",
  "Spain", "Sweden", "Switzerland", "Tanzania", "Uganda",
  "United Arab Emirates", "United Kingdom", "United States", "Zambia", "Zimbabwe",
];