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
        Schema::create('tbvendas', function (Blueprint $table) {
            $table->id();
            $table->enum('status', ['Em Processamento', 'Pagamento Aprovado', 'Separação', 'Enviado', 'Em Trânsito', 'Entregue']);
            $table->unsignedBigInteger('cliente_id');
            $table->datetime('data_compra')->default(now());
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('cliente_id')->references('id')->on('usuarios');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbvendas');
    }
};
