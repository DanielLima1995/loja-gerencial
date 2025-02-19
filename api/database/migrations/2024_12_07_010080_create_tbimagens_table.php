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
        Schema::create('tbimagens', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tbproduto_id'); // Chave estrangeira para tbprodutos
            $table->text('imagem_base64'); // Coluna para armazenar o base64 da imagem
            $table->integer('referencia'); // Coluna para armazenar o base64 da imagem
            $table->timestamps();

            $table->softDeletes();
            // Definindo a chave estrangeira
            $table->foreign('tbproduto_id')->references('id')->on('tbprodutos')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('tbimagens');
    }
};
