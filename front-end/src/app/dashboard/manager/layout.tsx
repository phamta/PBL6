import ManagerLayout from '@/components/layouts/ManagerLayout';

export default function ManagerLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ManagerLayout>
      {children}
    </ManagerLayout>
  );
}
