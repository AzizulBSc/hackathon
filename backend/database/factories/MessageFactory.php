<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ticket_id' => \App\Models\Ticket::factory(),
            'sender_id' => \App\Models\User::factory(),
            'message' => fake()->paragraph(2),
            'is_internal' => fake()->boolean(20), // 20% internal notes
            'is_bot' => fake()->boolean(30), // 30% bot messages
            'created_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
