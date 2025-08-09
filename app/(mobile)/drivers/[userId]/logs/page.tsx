import LogForm from './log-form';

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function DriverLogsPage({ params }: PageProps) {
  const { userId } = await params;

  return (
    <div className="mx-auto max-w-md p-4 space-y-4">
      <h1 className="text-lg font-semibold">Driver Logs</h1>
      <LogForm userId={userId} />
    </div>
  );
}
