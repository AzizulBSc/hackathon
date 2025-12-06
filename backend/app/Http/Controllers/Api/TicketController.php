<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    /**
     * Get all tickets (filtered by role)
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Ticket::with(['customer', 'agent', 'messages']);

        // Filter based on user role
        if ($user->role === 'customer') {
            $query->where('created_by', $user->id);
        } elseif ($user->role === 'agent') {
            $query->where(function ($q) use ($user) {
                $q->where('assigned_to', $user->id)
                    ->orWhereNull('assigned_to');
            });
        }
        // Admin sees all tickets

        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        $tickets = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $tickets,
        ]);
    }

    /**
     * Create a new ticket
     */
    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'sometimes|in:low,medium,high,urgent',
        ]);

        $ticket = Ticket::create([
            'subject' => $request->subject,
            'description' => $request->description,
            'priority' => $request->priority ?? 'medium',
            'status' => 'open',
            'created_by' => $request->user()->id,
        ]);

        // Create initial message
        Message::create([
            'ticket_id' => $ticket->id,
            'sender_id' => $request->user()->id,
            'message' => $request->description,
            'is_internal' => false,
            'is_bot' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ticket created successfully',
            'data' => $ticket->load(['customer', 'messages']),
        ], 201);
    }

    /**
     * Get single ticket details
     */
    public function show(Request $request, $id)
    {
        $ticket = Ticket::with(['customer', 'agent', 'messages.sender'])->findOrFail($id);

        // Check access
        $user = $request->user();
        if ($user->role === 'customer' && $ticket->created_by !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($user->role === 'agent' && $ticket->assigned_to !== $user->id && $ticket->assigned_to !== null) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $ticket,
        ]);
    }

    /**
     * Update ticket (status, priority, assignment)
     */
    public function update(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);

        $request->validate([
            'status' => 'sometimes|in:open,in_progress,resolved,closed',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'assigned_to' => 'sometimes|exists:users,id',
        ]);

        if ($request->has('status')) {
            $ticket->status = $request->status;
        }

        if ($request->has('priority')) {
            $ticket->priority = $request->priority;
        }

        if ($request->has('assigned_to')) {
            $ticket->assigned_to = $request->assigned_to;
        }

        $ticket->save();

        return response()->json([
            'success' => true,
            'message' => 'Ticket updated successfully',
            'data' => $ticket->load(['customer', 'agent']),
        ]);
    }

    /**
     * Reply to a ticket
     */
    public function reply(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string',
            'is_internal' => 'sometimes|boolean',
        ]);

        $ticket = Ticket::findOrFail($id);

        $message = Message::create([
            'ticket_id' => $ticket->id,
            'sender_id' => $request->user()->id,
            'message' => $request->message,
            'is_internal' => $request->is_internal ?? false,
            'is_bot' => false,
        ]);

        // Update ticket status if customer replies to resolved ticket
        if ($ticket->status === 'resolved' && $request->user()->role === 'customer') {
            $ticket->status = 'open';
            $ticket->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Reply sent successfully',
            'data' => $message->load('sender'),
        ], 201);
    }

    /**
     * Get dashboard statistics
     */
    public function stats(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'customer') {
            $stats = [
                'total' => Ticket::where('created_by', $user->id)->count(),
                'open' => Ticket::where('created_by', $user->id)->where('status', 'open')->count(),
                'in_progress' => Ticket::where('created_by', $user->id)->where('status', 'in_progress')->count(),
                'resolved' => Ticket::where('created_by', $user->id)->where('status', 'resolved')->count(),
            ];
        } elseif ($user->role === 'agent') {
            $stats = [
                'assigned' => Ticket::where('assigned_to', $user->id)->count(),
                'in_progress' => Ticket::where('assigned_to', $user->id)->where('status', 'in_progress')->count(),
                'resolved_today' => Ticket::where('assigned_to', $user->id)
                    ->where('status', 'resolved')
                    ->whereDate('updated_at', today())
                    ->count(),
                'resolved_total' => Ticket::where('assigned_to', $user->id)->where('status', 'resolved')->count(),
            ];
        } else { // admin
            $stats = [
                'total' => Ticket::count(),
                'open' => Ticket::where('status', 'open')->count(),
                'in_progress' => Ticket::where('status', 'in_progress')->count(),
                'resolved' => Ticket::where('status', 'resolved')->count(),
                'closed' => Ticket::where('status', 'closed')->count(),
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
