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
        Schema::create('tbtags', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo', ['Gênero', 'Tamanho', 'Cores', 'Estilo', 'Material', 'Comprimento', 'Preço']);
            $table->string('descricao');
            $table->string('cor')->nullable(); // Adiciona a coluna para valores de cor em hexadecimal
            $table->timestamps();
            $table->softDeletes();
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
