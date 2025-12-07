<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    /**
     * Process chatbot query
     */
    public function query(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $userMessage = $request->message;

        // First, try to find matching FAQ
        $faq = $this->searchFaq($userMessage);

        if ($faq) {
            $faq->incrementViews();

            return response()->json([
                'success' => true,
                'message' => $faq->answer,
                'type' => 'faq',
                'faq_id' => $faq->id,
                'suggested_action' => null,
            ]);
        }

        // If no FAQ found, try AI response
        $aiResponse = $this->getAIResponse($userMessage);

        if ($aiResponse) {
            return response()->json([
                'success' => true,
                'message' => $aiResponse,
                'type' => 'ai',
                'suggested_action' => 'create_ticket',
            ]);
        }

        // Fallback response
        return response()->json([
            'success' => true,
            'message' => "I couldn't find a specific answer to your question. Would you like to create a support ticket? Our team will get back to you shortly.",
            'type' => 'fallback',
            'suggested_action' => 'create_ticket',
        ]);
    }

    /**
     * Search for matching FAQ
     */
    private function searchFaq($query)
    {
        $query = strtolower($query);

        // Try exact match first
        $faq = Faq::active()
            ->whereRaw('LOWER(question) LIKE ?', ["%{$query}%"])
            ->first();

        if ($faq) {
            return $faq;
        }

        // Try keyword matching
        $keywords = ['password', 'reset', 'login', 'account', 'payment', 'billing', 'refund', 'cancel'];

        foreach ($keywords as $keyword) {
            if (str_contains($query, $keyword)) {
                $faq = Faq::active()
                    ->whereRaw('LOWER(question) LIKE ?', ["%{$keyword}%"])
                    ->orWhereRaw('LOWER(answer) LIKE ?', ["%{$keyword}%"])
                    ->first();

                if ($faq) {
                    return $faq;
                }
            }
        }

        return null;
    }

    /**
     * Get AI response (using Groq API or fallback)
     * Free AI API: https://console.groq.com
     */
    private function getAIResponse($message)
    {
        // Check if API key is configured
        $apiKey = env('GROQ_API_KEY') ?? env('HUGGINGFACE_API_KEY');

        if (!$apiKey) {
            return $this->getSmartFallback($message);
        }

        try {
            // Try Groq API first (free and fast)
            if (env('GROQ_API_KEY')) {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
                    'Content-Type' => 'application/json',
                ])->timeout(30)->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'llama-3.3-70b-versatile', // Fast and capable free model
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'You are a helpful customer support assistant. Provide concise, friendly, and accurate responses to customer queries.'
                        ],
                        [
                            'role' => 'user',
                            'content' => $message
                        ]
                    ],
                    'max_tokens' => 300,
                    'temperature' => 0.7,
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    if (isset($data['choices'][0]['message']['content'])) {
                        return trim($data['choices'][0]['message']['content']);
                    }
                }
            }

            // Fallback to OpenRouter (also free tier available)
            if (env('OPENROUTER_API_KEY')) {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . env('OPENROUTER_API_KEY'),
                    'Content-Type' => 'application/json',
                    'HTTP-Referer' => env('APP_URL', 'http://localhost'),
                ])->timeout(30)->post('https://openrouter.ai/api/v1/chat/completions', [
                    'model' => 'meta-llama/llama-3.2-3b-instruct:free',
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'You are a helpful customer support assistant. Provide concise, friendly, and accurate responses.'
                        ],
                        [
                            'role' => 'user',
                            'content' => $message
                        ]
                    ],
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    if (isset($data['choices'][0]['message']['content'])) {
                        return trim($data['choices'][0]['message']['content']);
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('AI API Error: ' . $e->getMessage());
        }

        return $this->getSmartFallback($message);
    }

    /**
     * Smart fallback responses
     */
    private function getSmartFallback($message)
    {
        $message = strtolower($message);

        $responses = [
            'thank' => "You're welcome! Is there anything else I can help you with?",
            'hello' => "Hello! How can I assist you today?",
            'hi' => "Hi there! What can I help you with?",
            'help' => "I'm here to help! You can ask me about account issues, billing, technical problems, or general questions. What do you need assistance with?",
            'problem' => "I understand you're experiencing an issue. Could you please provide more details so I can better assist you?",
            'urgent' => "I understand this is urgent. Let me help you right away. Please describe your issue in detail.",
            'price' => "For pricing information, please visit our pricing page or contact our sales team.",
            'feature' => "For feature requests or questions about specific features, please check our documentation or create a support ticket.",
        ];

        foreach ($responses as $keyword => $response) {
            if (str_contains($message, $keyword)) {
                return $response;
            }
        }

        return null;
    }

    /**
     * Get chat history
     */
    public function history(Request $request)
    {
        // For now, return empty array
        // In production, you'd store chat history in database
        return response()->json([
            'success' => true,
            'data' => [],
        ]);
    }
}
