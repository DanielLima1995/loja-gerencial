<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('tbcarrinho', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('usuario_id'); // Chave estrangeira para tbprodutos
            $table->enum('status', ['Inativo', 'Ativo', 'Venda Finalizada'])->default('Ativo'); // Chave estrangeira para tbprodutos
            
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('usuario_id')->references('id')->on('usuarios')->onDelete('cascade');
           
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbtags');
    }
};
