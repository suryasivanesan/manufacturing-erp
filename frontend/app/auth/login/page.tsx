import type { Metadata } from 'next';
import LoginPage from '@/components/auth/LoginPage';

export const metadata: Metadata = {
  title: 'Sign In | Manufacturing ERP',
  description: 'Enterprise Manufacturing Resource Planning Login Portal',
};

export default function Page() {
  return <LoginPage />;
}
