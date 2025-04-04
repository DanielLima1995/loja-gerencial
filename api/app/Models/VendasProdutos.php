<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VendasProdutos extends Model
{
    protected $table = 'tbvendas_produtos';
    protected $primaryKey = 'id';

    protected $guarded = [];

    public function tags(): HasMany{
        return $this->hasMany(VendasProdutosTags::class, 'venda_produto_id', 'id');
    }

    public function produto(): HasOne{
        return $this->hasOne(Produtos::class, 'id', 'produto_id');
    }
}
