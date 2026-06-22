<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incident_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('incident_id')->constrained('incidents')->cascadeOnDelete();
            $table->foreignId('author_id')->constrained('users')->cascadeOnUpdate();
            $table->enum('author_role', ['reporter', 'approver', 'assignee']);
            $table->enum('log_type', [
                'created', 'approved', 'declined',
                'assigned', 'progress_update', 'resolved',
            ]);
            $table->text('message');
            $table->json('meta')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('incident_id');
            $table->index('log_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incident_logs');
    }
};