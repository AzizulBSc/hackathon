<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['open', 'in_progress', 'resolved', 'closed'];
        $priorities = ['low', 'medium', 'high', 'urgent'];

        return [
            'subject' => fake()->sentence(),
            'description' => fake()->paragraph(3),
            'status' => fake()->randomElement($statuses),
            'priority' => fake()->randomElement($priorities),
            'created_by' => \App\Models\User::factory(),
            'assigned_to' => fake()->boolean(70) ? \App\Models\User::factory() : null,
            'resolved_at' => function (array $attributes) {
                return in_array($attributes['status'], ['resolved', 'closed'])
                    ? fake()->dateTimeBetween('-1 month', 'now')
                    : null;
            },
            'created_at' => fake()->dateTimeBetween('-2 months', 'now'),
        ];
    }
}
