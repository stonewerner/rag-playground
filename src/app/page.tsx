export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-4 px-6">
      <h1 className="text-3xl font-semibold tracking-tight">RAG Playground</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        A retrieval evaluation lab: index documents under different configs, turn retrieval knobs,
        and measure the difference. Under construction.
      </p>
    </main>
  );
}
