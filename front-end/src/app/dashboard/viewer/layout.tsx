import ViewerLayout from '@/components/layouts/ViewerLayout';

export default function ViewerLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewerLayout>
      {children}
    </ViewerLayout>
  );
}
