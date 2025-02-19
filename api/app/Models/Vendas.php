<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vendas extends Model
{
    protected $table = 'tbvendas';
    protected $primaryKey = 'id';

    protected $guarded = [];

    public function vendaProdutos(): HasMany{
        return $this->hasMany(VendasProdutos::class, 'venda_id', 'id');
    }

    public function cliente(): HasOne{
        return $this->hasOne(Usuarios::class, 'id', 'cliente_id');
    }
}
