// Mock the stripe library

export const stripe = {
  // Mock the create method of the charges object
  charges: {
    // Mock the create method
    create: jest.fn().mockResolvedValue({}),
  },
};
