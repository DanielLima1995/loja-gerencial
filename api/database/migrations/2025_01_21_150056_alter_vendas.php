<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tbvendas', function (Blueprint $table) {
            $table->unsignedBigInteger('endereco_id')->after('cliente_id');
            $table->foreign('endereco_id')->references('id')->on('cliente_enderecos');
        });


    }

};
