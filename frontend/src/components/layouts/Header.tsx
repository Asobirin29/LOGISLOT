'use client';

interface HeaderProps {
  title: string;
  user: any;
}

export default function Header({ title, user }: HeaderProps) {
  return (
    <header className="bg-surface-container-lowest font-headline-sm text-headline-sm h-16 border-b border-outline-variant flex justify-between items-center px-gutter max-w-container-max w-full z-10 shrink-0">
      <div className="flex items-center">
        <h2 className="font-headline-sm text-headline-sm font-bold text-primary">{title}</h2>
      </div>
      <div className="flex items-center gap-md">
        <button className="text-on-surface-variant hover:bg-surface-container transition-colors duration-200 ease-in-out p-sm rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:bg-surface-container transition-colors duration-200 ease-in-out p-sm rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined">apps</span>
        </button>
        <div className="w-8 h-8 rounded-full ml-sm bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm uppercase">
          {user?.nama ? user.nama.substring(0, 2) : 'US'}
        </div>
      </div>
    </header>
  );
}
