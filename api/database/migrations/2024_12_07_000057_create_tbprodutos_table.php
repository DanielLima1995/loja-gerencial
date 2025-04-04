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
        if (!Schema::hasTable('tbprodutos')) {
            Schema::create('tbprodutos', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('tbusuarios_id'); // Usar unsignedBigInteger para chave estrangeira
                $table->string('tbprodutos_titulo');
                $table->string('tbprodutos_descricao_basica')->nullable();
                $table->string('tbprodutos_descricao')->nullable();
                $table->float('tbprodutos_valor');
                $table->boolean('tbprodutos_ativo')->default(1);
                $table->timestamp('tbprodutos_data_cadastro');
                $table->timestamps();
                $table->softDeletes();

                // Definir chave estrangeira para tbusuarios_id
                $table->foreign('tbusuarios_id')->references('id')->on('usuarios')->onDelete('cascade'); // Relacionamento com a tabela tbusuarios
            });
            
        }
       
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
