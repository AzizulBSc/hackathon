<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Faq>
 */
class FaqFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Account', 'Billing', 'Technical', 'General', 'Product', 'Shipping'];

        return [
            'category' => fake()->randomElement($categories),
            'question' => fake()->sentence() . '?',
            'answer' => fake()->paragraph(3),
            'is_active' => fake()->boolean(90), // 90% active
            'views' => fake()->numberBetween(0, 1000),
        ];
    }
}
