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
        Schema::create('tbcarrinho_produtos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tbcarrinho_id'); // Chave estrangeira para tbprodutos
            $table->unsignedBigInteger('tbproduto_id'); // Chave estrangeira para tbprodutos
            $table->unsignedBigInteger('tbtags_id'); // Chave estrangeira para tbprodutos
            $table->integer('quantidade');
            $table->datetime('data_inclusar')->default(now());

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('tbcarrinho_id')->references('id')->on('tbcarrinho')->onDelete('cascade');
            $table->foreign('tbproduto_id')->references('id')->on('tbprodutos')->onDelete('cascade');
            $table->foreign('tbtags_id')->references('id')->on('tbtags')->onDelete('cascade');

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
