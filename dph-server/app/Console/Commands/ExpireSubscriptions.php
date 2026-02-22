<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;
use Carbon\Carbon;

class ExpireSubscriptions extends Command
{
    protected $signature = 'subscriptions:expire';
    protected $description = 'Expire outdated subscriptions';

    public function handle()
    {
        $expired = Subscription::where('end_date', '<', Carbon::now())
            ->where('status', 'active')
            ->get();

        foreach ($expired as $subscription) {
            $subscription->update(['status' => 'expired']);

            $subscription->user->profile->update([
                'is_active' => false
            ]);
        }

        $this->info('Expired subscriptions updated successfully.');
    }
}
