<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    /**
     * Get all FAQs
     */
    public function index(Request $request)
    {
        $query = Faq::query();

        // Only show active FAQs for customers
        if (!$request->user() || $request->user()->role === 'customer') {
            $query->active();
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('question', 'like', "%{$search}%")
                    ->orWhere('answer', 'like', "%{$search}%");
            });
        }

        $faqs = $query->orderBy('views', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $faqs,
        ]);
    }

    /**
     * Get single FAQ
     */
    public function show($id)
    {
        $faq = Faq::findOrFail($id);
        $faq->incrementViews();

        return response()->json([
            'success' => true,
            'data' => $faq,
        ]);
    }

    /**
     * Get FAQ categories
     */
    public function categories()
    {
        $categories = Faq::select('category')
            ->distinct()
            ->pluck('category');

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }
}
