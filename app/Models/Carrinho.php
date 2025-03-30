<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Carrinho extends Model
{
    protected $table = 'tbcarrinho';
    protected $primaryKey = 'id';

    protected $guarded = [];

    public function carrinhoProdutos(): HasMany{
        return $this->hasMany(CarrinhoProdutos::class, 'tbcarrinho_id', 'id');
    }
}
