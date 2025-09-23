interface layoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: layoutProps) {
  return (
    <>
      <header className='shadow w-full h-20 justify-center items-center flex mb-6'>
        <h1 className='text-2xl font-semibold text-center'>
          Product Management
        </h1>
      </header>
      <main className='container mx-auto px-4'>
          {children}
      </main>
      <footer>
      <div className='text-center p-4 text-gray-500'>
            &copy; {new Date().getFullYear()} Product Management. 
      </div>
      </footer>
    </>
  );
}