/** Full-screen message for loading, not linked and error states. */
export function StatusScreen({ title, message }: { title: string; message?: string }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 px-8 text-center">
      <h1 className="text-[20px] font-semibold">{title}</h1>
      {message ? <p className="text-[15px] text-(--app-hint)">{message}</p> : null}
    </main>
  );
}
