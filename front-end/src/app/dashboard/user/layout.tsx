import UserLayout from '@/components/layouts/UserLayout';

export default function UserLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserLayout>
      {children}
    </UserLayout>
  );
}
