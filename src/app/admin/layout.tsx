export const metadata = {
  title: 'Jackpools | POS Admin',
  description: 'Point of Sales and Order Management',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-brand-amber/30">
      {/* Simple Admin Header */}
      <header className="border-b border-white/10 bg-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-wider">
            JACK<span className="text-brand-amber">POOLS</span> <span className="text-white/40 font-normal ml-2">| POS SYSTEM</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white/70">System Online</span>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
