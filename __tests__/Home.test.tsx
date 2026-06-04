import { render, screen } from '@testing-library/react';

const SimpleComponent = () => <div>Hello Jest</div>;

describe('Environment Verification', () => {
  it('renders a simple component to verify Jest and React Testing Library setup', () => {
    render(<SimpleComponent />);
    const textElement = screen.getByText(/Hello Jest/i);
    expect(textElement).toBeInTheDocument();
  });
});
