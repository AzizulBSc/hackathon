# 🤖 AI Chatbot Setup Guide

## Overview

The SmartSupport chatbot now supports multiple free AI providers after Hugging
Face Inference API was deprecated.

## Supported AI Providers

### 1. ✅ Groq API (Recommended - FREE)

**Why Groq?**

- ✅ Completely free
- ✅ Super fast inference (500+ tokens/sec)
- ✅ Great models (Llama 3.3, Mixtral, Gemma)
- ✅ No credit card required
- ✅ Generous free tier

**Setup:**

1. **Get API Key:**

   - Visit: https://console.groq.com
   - Sign up (free, no credit card)
   - Go to "API Keys" section
   - Create new API key
   - Copy the key

2. **Configure Laravel:**

   ```bash
   # Add to your .env file
   GROQ_API_KEY=gsk_your_api_key_here
   ```

3. **Available Models:**
   - `llama-3.3-70b-versatile` (Default - Best for chat)
   - `llama-3.1-70b-versatile` (Good alternative)
   - `mixtral-8x7b-32768` (Long context)
   - `gemma2-9b-it` (Fast and efficient)

**Rate Limits (Free Tier):**

- 30 requests per minute
- 14,400 requests per day
- More than enough for most applications!

---

### 2. 🔄 OpenRouter (Backup - FREE)

**Setup:**

1. **Get API Key:**

   - Visit: https://openrouter.ai
   - Sign up (free)
   - Go to "Keys" section
   - Create new key
   - Copy the key

2. **Configure Laravel:**

   ```bash
   # Add to your .env file
   OPENROUTER_API_KEY=sk_or_your_api_key_here
   ```

3. **Free Models Available:**
   - `meta-llama/llama-3.2-3b-instruct:free`
   - `google/gemma-2-9b-it:free`
   - `mistralai/mistral-7b-instruct:free`

---

## How It Works

The chatbot follows this priority:

1. **FAQ Search** (Fastest)

   - Searches local FAQ database
   - Instant response
   - No API calls

2. **Groq AI** (Primary AI)

   - If FAQ not found
   - Uses Groq API
   - Fast responses

3. **OpenRouter** (Fallback)

   - If Groq fails
   - Uses OpenRouter
   - Free tier models

4. **Smart Fallback** (Last Resort)
   - Keyword-based responses
   - No API required
   - Always available

---

## Testing

### Test Chatbot API:

```bash
curl -X POST http://localhost:8000/api/chatbot/query \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I reset my password?"}'
```

### Expected Response:

```json
{
  "success": true,
  "message": "AI generated response here...",
  "type": "ai",
  "suggested_action": "create_ticket"
}
```

---

## Configuration Options

### Change AI Model (Groq):

Edit `ChatbotController.php`:

```php
'model' => 'llama-3.3-70b-versatile', // Change this
```

**Available Models:**

- `llama-3.3-70b-versatile` - Best overall (default)
- `llama-3.1-70b-versatile` - Good alternative
- `mixtral-8x7b-32768` - Long context (32k tokens)
- `llama3-groq-70b-8192-tool-use-preview` - Function calling
- `gemma2-9b-it` - Fastest, smaller model

### Adjust Response Quality:

```php
'max_tokens' => 300,     // Response length (100-1000)
'temperature' => 0.7,    // Creativity (0.0-1.0)
```

**Temperature Guide:**

- `0.0-0.3` - More factual, consistent
- `0.4-0.7` - Balanced (recommended)
- `0.8-1.0` - More creative, varied

---

## Troubleshooting

### Issue: "AI API Error" in logs

**Solution:**

1. Check API key is correct
2. Verify internet connection
3. Check API provider status
4. Ensure `.env` is properly configured

### Issue: Slow responses

**Solution:**

1. Use Groq API (fastest)
2. Reduce `max_tokens`
3. Check your internet speed
4. Consider caching common queries

### Issue: Rate limit exceeded

**Solution:**

1. Implement caching for common questions
2. Use FAQ database more
3. Upgrade to paid tier (if needed)
4. Add rate limiting to your app

---

## Production Best Practices

### 1. Enable Caching:

```php
// Cache AI responses for common queries
$cacheKey = 'ai_response_' . md5($message);
return Cache::remember($cacheKey, 3600, function() use ($message) {
    return $this->getAIResponse($message);
});
```

### 2. Add Rate Limiting:

```php
// In routes/api.php
Route::middleware('throttle:chatbot')->group(function () {
    Route::post('/chatbot/query', [ChatbotController::class, 'query']);
});
```

### 3. Monitor Usage:

```php
// Log API calls
Log::info('Chatbot query', [
    'message' => $message,
    'type' => $responseType,
    'user_id' => auth()->id(),
]);
```

### 4. Fallback Gracefully:

The system automatically falls back to:

- FAQ database → Groq → OpenRouter → Smart fallback

This ensures the chatbot always responds, even if AI APIs fail.

---

## Cost Comparison

| Provider         | Free Tier     | Paid Tier            | Speed      | Quality    |
| ---------------- | ------------- | -------------------- | ---------- | ---------- |
| **Groq**         | 30 req/min    | $0.10-0.30/1M tokens | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ |
| **OpenRouter**   | Limited       | Varies by model      | ⚡⚡⚡     | ⭐⭐⭐⭐   |
| **Hugging Face** | ❌ Deprecated | N/A                  | ⚡⚡       | ⭐⭐⭐     |

---

## Quick Start Checklist

- [ ] Sign up for Groq account
- [ ] Get Groq API key
- [ ] Add `GROQ_API_KEY` to `.env`
- [ ] Test chatbot endpoint
- [ ] Verify responses in frontend
- [ ] (Optional) Set up OpenRouter as backup
- [ ] (Optional) Implement caching
- [ ] Deploy to production

---

## Support

For issues or questions:

- Groq Documentation: https://console.groq.com/docs
- OpenRouter Docs: https://openrouter.ai/docs
- Project Issues: GitHub repository

---

## Example .env Configuration

```bash
# Recommended setup
GROQ_API_KEY=gsk_your_groq_key_here
OPENROUTER_API_KEY=sk_or_your_openrouter_key_here

# Legacy (not recommended)
HUGGINGFACE_API_KEY=
```

---

## Migration from Hugging Face

If you were using Hugging Face:

1. **Remove old key:**

   ```bash
   # Remove from .env
   HUGGINGFACE_API_KEY=
   ```

2. **Add Groq key:**

   ```bash
   GROQ_API_KEY=gsk_your_key_here
   ```

3. **That's it!** The code automatically uses Groq now.

---

**Updated:** December 2025  
**Status:** ✅ Production Ready
