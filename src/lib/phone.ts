// Australian phone numbers, in the formats customers actually type:
// spaces, brackets, dashes and the +61 country code are all accepted.

const AU_PHONE_PATTERNS = [
    /^04\d{8}$/,           // mobile             0412 345 678
    /^0[2378]\d{8}$/,      // landline           (02) 9876 5432
    /^1(?:300|800)\d{6}$/, // business/service   1300 123 456
];

export const PHONE_ERROR_MESSAGE = "The mobile number must be a valid Australian mobile number (e.g., 04xxxxxxxx or +614xxxxxxxx).";
// export const PHONE_ERROR_MESSAGE = "Please enter a valid Australian phone number";

/** Strips formatting characters — this is the shape the API expects. */
export const cleanSpaces = (value: string) => value?.replace(/[^\d+]/g, '');

/** Rewrites a +61 number into its national (leading 0) form so one set of rules covers both. */
const toNationalFormat = (phone: string) => {
    const cleaned = cleanSpaces(phone) ?? '';
    if (!cleaned.startsWith('+61')) return cleaned;

    const national = cleaned.slice(3);
    // +61 412 … drops the trunk 0, but +61 (0)412 … and +61 1300 … already carry their own prefix.
    return national.startsWith('0') || national.startsWith('1') ? national : `0${national}`;
};

export const isPhoneValid = (phone: string) =>
    AU_PHONE_PATTERNS.some((pattern) => pattern.test(toNationalFormat(phone)));
