<?php
namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentMail extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;
    public $type; // 'new', 'confirmed', or 'rejected'

    public function __construct(Appointment $appointment, $type = 'new')
    {
        $this->appointment = $appointment;
        $this->type = $type;
    }

    public function envelope(): Envelope
    {
        $subject = match($this->type) {
            'confirmed' => 'Appointment Confirmed! ✅',
            'rejected'  => 'Appointment Update: Regretfully Declined ❌',
            default     => 'New Appointment Request Received! 📅',
        };

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment', // We will create this view
        );
    }
}