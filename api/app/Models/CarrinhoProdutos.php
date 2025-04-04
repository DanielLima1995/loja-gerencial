<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CarrinhoProdutos extends Model
{
    use HasFactory;

    protected $table = 'tbcarrinho_produtos';
    protected $primaryKey = 'id';

    protected $guarded = [];

    public function produto(): HasOne
    {
        return $this->HasOne(Produtos::class, 'id', 'tbproduto_id');
    }

    public function tag(): HasOne
    {
        return $this->hasOne(Tags::class, 'id', 'tbtags_id');
    }

    public function tags(): HasMany
    {
        return $this->hasMany(Tags::class, 'id', 'tbtags_id');
    }

    public function carrinho(): HasOne
    {
        return $this->hasOne(Carrinho::class, 'id', 'tbcarrinho_id');
    }

    public function tamanho(): HasOne
    {
        return $this->hasOne(Tags::class, 'id', 'tamanho_id');
    }

    
}
