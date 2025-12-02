'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";

export default function Home() {
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    const checkAPI = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
        const data = await response.json();
        setApiStatus('✅ Connected');
        setApiData(data);
      } catch (error) {
        setApiStatus('❌ Disconnected');
        console.error('API Error:', error);
      }
    };

    checkAPI();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 font-sans p-8">
      <main className="flex flex-col items-center justify-center max-w-4xl w-full">
        <div className="mb-8">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={37}
            priority
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Hackathon Project
          </h1>

          <p className="text-center text-gray-600 dark:text-gray-300 mb-8 text-lg">
            Laravel + Next.js Full Stack Application
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Frontend</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ Next.js 16 (Latest)</li>
                <li>✅ React 19</li>
                <li>✅ JavaScript</li>
                <li>✅ Tailwind CSS</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Backend</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ Laravel 10</li>
                <li>✅ PHP</li>
                <li>✅ RESTful API</li>
                <li>✅ Laravel Sanctum</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              API Connection Status
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Backend API:</span>
              <span className="font-semibold text-lg">{apiStatus}</span>
            </div>
            {apiData && (
              <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto">
                  {JSON.stringify(apiData, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              className="flex h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-white font-semibold transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
              href="http://localhost:8000"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Backend
            </a>
            <a
              className="flex h-12 items-center justify-center rounded-lg border-2 border-gray-300 dark:border-gray-600 px-6 font-semibold transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
          Start building your amazing application! 🚀
        </p>
      </main>
    </div>
  );
}
