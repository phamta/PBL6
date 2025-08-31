import SpecialistLayout from '@/components/layouts/SpecialistLayout';

export default function SpecialistLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SpecialistLayout>
      {children}
    </SpecialistLayout>
  );
}
