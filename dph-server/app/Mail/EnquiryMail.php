<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EnquiryMail extends Mailable
{
    use Queueable, SerializesModels;

    public $enquiry;
    public $profile;

    public function __construct($enquiry, $profile)
    {
        $this->enquiry = $enquiry;
        $this->profile = $profile;
    }

    public function build()
    {
        return $this->subject('New Enquiry/Order from ' . $this->enquiry->name)
                    ->view('emails.enquiry');
    }
}