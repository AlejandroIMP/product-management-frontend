import { Layout } from '../../Layouts/layout';


function NotFound() {
  return(
    <Layout>
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <h1 className='text-6xl font-bold text-gray-800 mb-4'>404</h1>
        <p className='text-xl text-gray-600 mb-8'>Page Not Found</p>
        <a href='/' className='px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 lg:px-8 lg:py-4 lg:text-lg'>
          Go to Home
        </a>
      </div>
    </Layout>
  );
}

export default NotFound
