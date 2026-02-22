<div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
    <h2 style="color: #f97316; text-transform: uppercase; italic">
        @if($type == 'new') 
            New Booking Request
        @elseif($type == 'confirmed')
            Booking Confirmed!
        @else
            Booking Update
        @endif
    </h2>

    <p>Hello <strong>{{ $type == 'new' ? $appointment->profile->user->name : $appointment->customer_name }}</strong>,</p>

    <div style="background: #f9fafb; padding: 20px; border-radius: 10px; border-left: 4px solid #f97316;">
        <p><strong>Date:</strong> {{ date('D, M j, Y', strtotime($appointment->appointment_date)) }}</p>
        <p><strong>Time:</strong> {{ $appointment->appointment_time }}</p>
        <p><strong>Status:</strong> <span style="text-transform: uppercase;">{{ $appointment->status }}</span></p>
    </div>

    <div style="margin-top: 20px;">
        <p><strong>Customer Details:</strong></p>
        <p>Name: {{ $appointment->customer_name }}<br>
           Phone: {{ $appointment->customer_phone }}<br>
           Email: {{ $appointment->customer_email }}</p>
    </div>

    <p style="font-size: 12px; color: #777; margin-top: 30px; border-top: 1px solid #eee; pt-10px;">
        Sent via NFC Digital Profile Platform.
    </p>
</div>