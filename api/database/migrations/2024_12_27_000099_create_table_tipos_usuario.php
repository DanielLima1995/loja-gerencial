<?php

use App\Models\TiposUsuarios;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbtipos_usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('descricao');
            $table->boolean('ativo')->default(true);
        });


       
        DB::table('tbtipos_usuarios')->insert(['descricao' => 'Admin']);
        DB::table('tbtipos_usuarios')->insert(['descricao' => 'Cliente']);
    }

};
