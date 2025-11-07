import '@testing-library/jest-dom';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { priority, ...rest } = props;
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return require('react').createElement('img', rest);
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = 'https://test.example.com';
