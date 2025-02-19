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
            $table->enum('forma_pagamento', ['Boleto','Cartão de Crédito','Cartão de Débito', 'Pix'])->default('Pix')->after('data_compra');
            $table->float('valor_final')->after('forma_pagamento');
        });


    }

};
