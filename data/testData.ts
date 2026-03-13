//Exported objects containing the 7 usernames, the password, and item names.

export const TEST_DATA = {
  password: 'secret_sauce',
  invalidPassword: 'invalid_password',
  users: {
    standard: 'standard_user',
    lockedOut: 'locked_out_user',
    problem: 'problem_user',
    performance: 'performance_glitch_user',
    error: 'error_user',
    visual: 'visual_user',
    notAvailable: 'not_available_user' //added for negative testing, it is not in the pre-defined list of users.
  },
  // Unique keys for the data-test attributes
  products: [
    'sauce-labs-backpack',
    'sauce-labs-bike-light',
    'sauce-labs-bolt-t-shirt',
    'sauce-labs-fleece-jacket',
    'sauce-labs-onesie',
    'test.allthethings()-t-shirt-(red)'
  ]
};