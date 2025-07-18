// Utility for generating IDs in the {prefix}_{32char_alphanum} format
// Prefix must match the domain object (e.g., 'user', 'orgmem')

const ALPHANUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateDomainId(prefix: string): string {
  let id = '';
  for (let i = 0; i < 32; i++) {
    id += ALPHANUM.charAt(Math.floor(Math.random() * ALPHANUM.length));
  }
  return `${prefix}_${id}`;
}

// Example usage:
// const userId = generateDomainId('user');
// const orgMemId = generateDomainId('orgmem');
