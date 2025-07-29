import Link from 'next/link';

export function SharedFooter() {
  return (
    <footer className="bg-background/80 relative z-10 flex w-full flex-row gap-2 py-3 backdrop-blur-sm px-6">
      <p className="text-muted-foreground text-xs">© 2025 FleetFusion. All rights reserved.</p>
      <nav className="flex gap-4 sm:ml-auto sm:gap-6">
        <Link className="text-xs underline-offset-4 hover:underline" href="/terms">
          Terms of Service
        </Link>
        <Link className="text-xs underline-offset-4 hover:underline" href="/privacy">
          Privacy
        </Link>
      </nav>
    </footer>
  );
}
