<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartSupport - Setup Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h1 class="text-3xl font-bold text-center mb-2 text-blue-600">SmartSupport Setup Panel</h1>
                <p class="text-center text-gray-600 mb-8">Run setup commands via browser</p>

                <div id="output" class="mb-6 p-4 bg-gray-50 rounded-lg hidden border-2">
                    <h3 class="font-semibold mb-2">Output:</h3>
                    <pre id="outputText" class="text-sm whitespace-pre-wrap"></pre>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Quick Setup -->
                    <div class="col-span-2 bg-green-50 border-2 border-green-500 rounded-lg p-6">
                        <h2 class="text-xl font-bold mb-4 text-green-700">🚀 Quick Setup (Recommended)</h2>
                        <button onclick="runCommand('/setup/complete')"
                            class="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold">
                            Run Complete Setup (All-in-One)
                        </button>
                        <p class="text-sm text-gray-600 mt-2">This will: Generate key, Clear cache, Migrate database,
                            Seed data, Create storage link, and Optimize</p>
                    </div>

                    <!-- Database Commands -->
                    <div class="col-span-2 bg-blue-50 border border-blue-300 rounded-lg p-4">
                        <h3 class="font-bold mb-3 text-blue-700">📊 Database Commands</h3>
                        <div class="space-y-2">
                            <button onclick="runCommand('/setup/db-check')"
                                class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                                Check Database Connection
                            </button>
                            <button onclick="runCommand('/setup/migrate')"
                                class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                                Run Migrations
                            </button>
                            <button onclick="runCommand('/setup/seed')"
                                class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                                Seed Database
                            </button>
                            <button onclick="runCommand('/setup/migrate-fresh')"
                                class="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">
                                Fresh Migration (⚠️ Deletes all data)
                            </button>
                            <button onclick="runCommand('/setup/migrate-fresh-seed')"
                                class="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">
                                Fresh Migration + Seed (⚠️ Deletes all data)
                            </button>
                        </div>
                    </div>

                    <!-- Cache Commands -->
                    <div class="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                        <h3 class="font-bold mb-3 text-yellow-700">🗑️ Cache Commands</h3>
                        <div class="space-y-2">
                            <button onclick="runCommand('/setup/clear-cache')"
                                class="w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-sm">
                                Clear All Cache
                            </button>
                            <button onclick="runCommand('/setup/optimize')"
                                class="w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-sm">
                                Optimize Application
                            </button>
                        </div>
                    </div>

                    <!-- Other Commands -->
                    <div class="bg-purple-50 border border-purple-300 rounded-lg p-4">
                        <h3 class="font-bold mb-3 text-purple-700">⚙️ Other Commands</h3>
                        <div class="space-y-2">
                            <button onclick="runCommand('/setup/generate-key')"
                                class="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm">
                                Generate App Key
                            </button>
                            <button onclick="runCommand('/setup/storage-link')"
                                class="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm">
                                Create Storage Link
                            </button>
                            <button onclick="runCommand('/setup/routes')"
                                class="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm">
                                List All Routes
                            </button>
                        </div>
                    </div>
                </div>

                <div class="mt-8 p-4 bg-red-50 border border-red-300 rounded-lg">
                    <h3 class="font-bold text-red-700 mb-2">⚠️ Security Warning</h3>
                    <p class="text-sm text-gray-700">
                        These setup routes are for initial deployment only.
                        <strong>Please remove or secure these routes after setup is complete!</strong>
                    </p>
                </div>

                <div class="mt-4 text-center text-sm text-gray-500">
                    <p>SmartSupport v1.0 - Setup Panel</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        async function runCommand(url) {
            const outputDiv = document.getElementById('output');
            const outputText = document.getElementById('outputText');

            outputDiv.classList.remove('hidden');
            outputText.textContent = '⏳ Running command...';

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.success) {
                    outputText.textContent = '✅ Success!\n\n' +
                        (data.message || '') + '\n\n' +
                        (data.output || JSON.stringify(data.results || data, null, 2));
                    outputDiv.classList.add('bg-green-50', 'border-green-500');
                    outputDiv.classList.remove('bg-red-50', 'border-red-500', 'bg-gray-50');
                } else {
                    outputText.textContent = '❌ Error!\n\n' +
                        (data.message || '') + '\n\n' +
                        (data.error || '');
                    outputDiv.classList.add('bg-red-50', 'border-red-500');
                    outputDiv.classList.remove('bg-green-50', 'border-green-500', 'bg-gray-50');
                }
            } catch (error) {
                outputText.textContent = '❌ Request Failed!\n\n' + error.message;
                outputDiv.classList.add('bg-red-50', 'border-red-500');
                outputDiv.classList.remove('bg-green-50', 'border-green-500', 'bg-gray-50');
            }
        }
    </script>
</body>

</html>
