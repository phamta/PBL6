import StudentLayout from '@/components/layouts/StudentLayout';

export default function StudentLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentLayout>
      {children}
    </StudentLayout>
  );
}
