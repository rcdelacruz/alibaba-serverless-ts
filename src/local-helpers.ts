// Simple mock implementation to use in place of Jest if needed
export const mock = {
  fn: () => {
    type MockFunction = {
      (...args: any[]): any;
      mock: {
        calls: any[][];
        implementation: (((...args: any[]) => any) | null);
        results: any[];
        instances: any[];
      };
      mockImplementation: (implementation: (...args: any[]) => any) => MockFunction;
      mockReturnValue: (value: any) => MockFunction;
    };

    const mockFn = ((...args: any[]): any => {
      mockFn.mock.calls.push(args);
      return mockFn.mock.implementation ? mockFn.mock.implementation(...args) : undefined;
    }) as MockFunction;

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
export function mockModule(modulePath: string, mockImplementation: any): any {
  // In a real implementation, this would intercept require() calls
  // For our purposes, we'll just return the mock implementation
  return mockImplementation;
}
