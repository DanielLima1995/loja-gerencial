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
        Schema::create('tbvendas_produtos_tags', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('venda_produto_id');
            $table->unsignedBigInteger('tag_id');

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('venda_produto_id')->references('id')->on('tbvendas_produtos');
            $table->foreign('tag_id')->references('id')->on('tbtags');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbvendas_produtos_tags');
    }
};
