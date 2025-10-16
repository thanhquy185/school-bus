import bcrypt from "bcrypt";

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 12;

/**
 * Hash a plain text password
 * @param password - Plain text password
 * @returns Promise<string> - Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Failed to hash password');
    }
};

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error comparing password:', error);
        throw new Error('Failed to compare password');
    }
};

/**
 * Synchronous version of hashPassword (not recommended for production)
 * @param password - Plain text password
 * @returns string - Hashed password
 */
export const hashPasswordSync = (password: string): string => {
    try {
        const salt = bcrypt.genSaltSync(SALT_ROUNDS);
        const hashedPassword = bcrypt.hashSync(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password synchronously:', error);
        throw new Error('Failed to hash password');
    }
};

/**
 * Synchronous version of comparePassword (not recommended for production)
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns boolean - True if passwords match, false otherwise
 */
export const comparePasswordSync = (password: string, hashedPassword: string): boolean => {
    try {
        const isMatch = bcrypt.compareSync(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error comparing password synchronously:', error);
        throw new Error('Failed to compare password');
    }
};