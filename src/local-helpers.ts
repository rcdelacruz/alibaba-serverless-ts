// Simple mock implementation to use in place of Jest if needed
export const mock = {
  fn: () => {
    const mockFn = (...args: any[]) => {
      mockFn.mock.calls.push(args);
      return mockFn.mock.implementation ? mockFn.mock.implementation(...args) : undefined;
    };

    mockFn.mock = {
      calls: [],
      implementation: null,
      results: [],
      instances: [],
    };

    mockFn.mockImplementation = (implementation: (...args: any[]) => any) => {
      mockFn.mock.implementation = implementation;
      return mockFn;
    };

    mockFn.mockReturnValue = (value: any) => {
      mockFn.mockImplementation(() => value);
      return mockFn;
    };

    return mockFn;
  }
};

// Simple module mocker to use in place of Jest if needed
export function mockModule(modulePath: string, mockImplementation: any) {
  // In a real implementation, this would intercept require() calls
  // For our purposes, we'll just return the mock implementation
  return mockImplementation;
}
