import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Manufacturing ERP',
  description: 'Enterprise Manufacturing Resource Planning Authentication Portal',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
