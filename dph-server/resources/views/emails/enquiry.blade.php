<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
    <h2 style="color: #f97316;">You have a new lead!</h2>
    <p>Hello <strong>{{ $profile->user->name }}</strong>,</p>
    <p>Someone just filled out the enquiry form on your digital profile <strong>({{ $profile->username }})</strong>.</p>
    
    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> {{ $enquiry->name }}</p>
        <p><strong>Email:</strong> {{ $enquiry->email }}</p>
        <p><strong>Phone:</strong> {{ $enquiry->phone ?? 'Not provided' }}</p>
        <p><strong>Details:</strong></p>
        <p style="white-space: pre-line;">{{ $enquiry->message }}</p>
    </div>

    <p style="font-size: 12px; color: #64748b;">This email was sent automatically from your NFC Digital Profile platform.</p>
</div>