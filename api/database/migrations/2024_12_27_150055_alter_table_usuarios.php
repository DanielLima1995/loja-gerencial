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
        Schema::table('usuarios', function (Blueprint $table) {
            $table->unsignedBigInteger('tipo_usuario')->after('remember_token')->default(2);
            $table->foreign('tipo_usuario')->references('id')->on('tbtipos_usuarios');
        });


    }

};
