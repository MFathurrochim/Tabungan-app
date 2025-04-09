import React from 'react';
import Navbar from '../Navbar';
import { useAppContext } from '../contexts/AppContext';

const Layout = ({ children }) => {
  const { error, clearError, loading } = useAppContext();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark">
      <Navbar />
      
      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                  <button 
                    onClick={clearError}
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                  </button>
                </div>
              )}
              {children}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;