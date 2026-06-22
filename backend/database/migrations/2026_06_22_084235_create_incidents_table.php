<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->text('description');
            $table->enum('category', ['IT', 'Facility', 'HR', 'Security', 'Other']);
            $table->enum('priority', ['Low', 'Medium', 'High', 'Critical']);
            $table->enum('status', ['Pending_Approval', 'In_Progress', 'Resolved', 'Rejected'])
                  ->default('Pending_Approval');
            $table->string('location', 255)->nullable();
            $table->string('attachment_url', 500)->nullable();
            $table->foreignId('reporter_id')->constrained('users')->cascadeOnUpdate();
            $table->foreignId('approver_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('rejection_reason')->nullable();
            $table->text('approval_notes')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('priority');
            $table->index('reporter_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};