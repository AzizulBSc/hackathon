<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        $admin = \App\Models\User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create Agents (3)
        $agents = \App\Models\User::factory()->count(3)->create([
            'role' => 'agent',
            'is_active' => true,
            'password' => bcrypt('password'),
        ]);

        // Create additional specific agent
        $agent1 = \App\Models\User::factory()->create([
            'name' => 'Agent Smith',
            'email' => 'agent@test.com',
            'password' => bcrypt('password'),
            'role' => 'agent',
            'is_active' => true,
        ]);

        // Create Customers (10)
        $customers = \App\Models\User::factory()->count(10)->create([
            'role' => 'customer',
            'is_active' => true,
            'password' => bcrypt('password'),
        ]);

        // Create specific customer for testing
        $customer1 = \App\Models\User::factory()->create([
            'name' => 'John Customer',
            'email' => 'customer@test.com',
            'password' => bcrypt('password'),
            'role' => 'customer',
            'is_active' => true,
        ]);

        // Combine all agents for assignment
        $allAgents = $agents->push($agent1);

        // Create FAQs (20)
        $faqs = [
            [
                'category' => 'Account',
                'question' => 'How do I reset my password?',
                'answer' => 'To reset your password, click on "Forgot Password" on the login page. Enter your email address and you will receive a password reset link.',
                'is_active' => true,
                'views' => 150,
            ],
            [
                'category' => 'Account',
                'question' => 'How do I update my profile information?',
                'answer' => 'Go to your profile settings and click Edit Profile. You can update your name, email, and other personal information.',
                'is_active' => true,
                'views' => 89,
            ],
            [
                'category' => 'Billing',
                'question' => 'What payment methods do you accept?',
                'answer' => 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers.',
                'is_active' => true,
                'views' => 234,
            ],
            [
                'category' => 'Billing',
                'question' => 'How do I download my invoice?',
                'answer' => 'Go to Billing > Invoices in your dashboard. Click on any invoice to view and download it as a PDF.',
                'is_active' => true,
                'views' => 167,
            ],
            [
                'category' => 'Technical',
                'question' => 'The application is running slowly. What should I do?',
                'answer' => 'Try clearing your browser cache and cookies. If the issue persists, please contact our support team with details about your browser and operating system.',
                'is_active' => true,
                'views' => 98,
            ],
            [
                'category' => 'Technical',
                'question' => 'How do I enable two-factor authentication?',
                'answer' => 'Go to Settings > Security > Two-Factor Authentication. Follow the on-screen instructions to set up 2FA using your preferred authenticator app.',
                'is_active' => true,
                'views' => 203,
            ],
            [
                'category' => 'General',
                'question' => 'What are your support hours?',
                'answer' => 'Our support team is available Monday to Friday, 9 AM to 6 PM EST. For urgent issues, please mark your ticket as "Urgent".',
                'is_active' => true,
                'views' => 312,
            ],
            [
                'category' => 'General',
                'question' => 'How do I contact support?',
                'answer' => 'You can contact support by creating a ticket through your dashboard, or by using our AI chatbot for instant assistance.',
                'is_active' => true,
                'views' => 445,
            ],
            [
                'category' => 'Product',
                'question' => 'What features are included in the free plan?',
                'answer' => 'The free plan includes up to 3 support tickets per month, access to our AI chatbot, and email support within 48 hours.',
                'is_active' => true,
                'views' => 278,
            ],
            [
                'category' => 'Product',
                'question' => 'Can I upgrade my plan at any time?',
                'answer' => 'Yes, you can upgrade your plan at any time from your dashboard. The upgrade will take effect immediately.',
                'is_active' => true,
                'views' => 156,
            ],
        ];

        foreach ($faqs as $faq) {
            \App\Models\Faq::create($faq);
        }

        // Create additional random FAQs
        \App\Models\Faq::factory()->count(10)->create();

        // Create Tickets with realistic scenarios
        // Open tickets (5) - assigned to agents
        foreach (range(1, 5) as $i) {
            $ticket = \App\Models\Ticket::factory()->create([
                'status' => 'open',
                'priority' => fake()->randomElement(['medium', 'high', 'urgent']),
                'created_by' => $customers->random()->id,
                'assigned_to' => $allAgents->random()->id,
                'created_at' => now()->subDays(rand(1, 5)),
            ]);

            // Add initial message from customer
            \App\Models\Message::factory()->create([
                'ticket_id' => $ticket->id,
                'sender_id' => $ticket->created_by,
                'message' => $ticket->description,
                'is_internal' => false,
                'is_bot' => false,
                'created_at' => $ticket->created_at,
            ]);
        }

        // In Progress tickets (8) - with messages
        foreach (range(1, 8) as $i) {
            $ticket = \App\Models\Ticket::factory()->create([
                'status' => 'in_progress',
                'priority' => fake()->randomElement(['low', 'medium', 'high']),
                'created_by' => $customers->random()->id,
                'assigned_to' => $allAgents->random()->id,
                'created_at' => now()->subDays(rand(1, 10)),
            ]);

            // Initial customer message
            \App\Models\Message::factory()->create([
                'ticket_id' => $ticket->id,
                'sender_id' => $ticket->created_by,
                'message' => $ticket->description,
                'is_internal' => false,
                'is_bot' => false,
                'created_at' => $ticket->created_at,
            ]);

            // Agent response
            \App\Models\Message::factory()->create([
                'ticket_id' => $ticket->id,
                'sender_id' => $ticket->assigned_to,
                'message' => 'Thank you for contacting us. I\'m looking into this issue and will get back to you shortly.',
                'is_internal' => false,
                'is_bot' => false,
                'created_at' => $ticket->created_at->addHours(2),
            ]);

            // Maybe add more messages
            if (rand(0, 1)) {
                \App\Models\Message::factory()->count(rand(1, 3))->create([
                    'ticket_id' => $ticket->id,
                    'sender_id' => fake()->randomElement([$ticket->created_by, $ticket->assigned_to]),
                    'is_internal' => false,
                    'is_bot' => false,
                ]);
            }
        }

        // Resolved tickets (12)
        foreach (range(1, 12) as $i) {
            $createdAt = now()->subDays(rand(5, 30));
            $ticket = \App\Models\Ticket::factory()->create([
                'status' => 'resolved',
                'priority' => fake()->randomElement(['low', 'medium', 'high']),
                'created_by' => $customers->random()->id,
                'assigned_to' => $allAgents->random()->id,
                'resolved_at' => $createdAt->copy()->addDays(rand(1, 3)),
                'created_at' => $createdAt,
            ]);

            // Create conversation
            \App\Models\Message::factory()->count(rand(2, 5))->create([
                'ticket_id' => $ticket->id,
                'sender_id' => fake()->randomElement([$ticket->created_by, $ticket->assigned_to]),
                'is_internal' => false,
                'is_bot' => false,
            ]);
        }

        // Closed tickets (5)
        foreach (range(1, 5) as $i) {
            $createdAt = now()->subDays(rand(15, 60));
            $ticket = \App\Models\Ticket::factory()->create([
                'status' => 'closed',
                'priority' => fake()->randomElement(['low', 'medium']),
                'created_by' => $customers->random()->id,
                'assigned_to' => $allAgents->random()->id,
                'resolved_at' => $createdAt->copy()->addDays(rand(1, 4)),
                'created_at' => $createdAt,
            ]);

            // Create conversation
            \App\Models\Message::factory()->count(rand(3, 6))->create([
                'ticket_id' => $ticket->id,
                'sender_id' => fake()->randomElement([$ticket->created_by, $ticket->assigned_to]),
                'is_internal' => false,
                'is_bot' => false,
            ]);
        }

        $this->command->info('Database seeded successfully!');
        $this->command->info('');
        $this->command->info('Demo Accounts:');
        $this->command->info('Admin: admin@test.com / password');
        $this->command->info('Agent: agent@test.com / password');
        $this->command->info('Customer: customer@test.com / password');
    }
}
