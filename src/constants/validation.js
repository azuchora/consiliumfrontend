export const LENGTH_LIMITS = {
    USERNAME_MIN: 3,
    USERNAME_MAX: 24,
    PASSWORD_MIN: 8,
    PASSWORD_MAX: 32,
}

export const PASSWORD_REGEX_STR = `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{${LENGTH_LIMITS.PASSWORD_MIN},${LENGTH_LIMITS.PASSWORD_MAX}}$`;
export const USER_REGEX_STR = `^[A-z0-9-_]{${LENGTH_LIMITS.USERNAME_MIN},${LENGTH_LIMITS.USERNAME_MAX}}$`;
export const PESEL_REGEX = /^\d{11}$/;
export const SURNAME_REGEX = /^[\p{Lu}][\p{L}'\- ]{1,49}$/u;
export const NAME_REGEX = /^[\p{Lu}][\p{L}'-]{0,49}$/u;
export const PWZ_REGEX = /^\d{7}$/;
