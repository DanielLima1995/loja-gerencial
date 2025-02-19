<?php

namespace App\Models;

use App\Scopes\ActiveScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Produtos extends Model
{
    use SoftDeletes;

    protected $table = 'tbprodutos';
    protected $primaryKey = 'id';

    protected $guarded = [];

    protected static function booted()
    {
        parent::booted();

        static::addGlobalScope(new ActiveScope);
    }

    public function imagens()
    {
        return $this->hasMany(Galeria::class, 'tbproduto_id', 'id');
    }

    public function imagemPrincipal(): HasOne
    {
        return $this->hasOne(Galeria::class, 'tbproduto_id', 'id')->where('referencia', 1);
    }

    public function tagsProdutos()
    {
        return $this->hasMany(TagsProdutos::class, 'tbproduto_id', 'id')->orderBy('tbtags_id');
    }
}
