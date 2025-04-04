<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VendasProdutosTags extends Model
{
    protected $table = 'tbvendas_produtos_tags';
    protected $primaryKey = 'id';

    protected $guarded = [];

    public function detalhes(): HasOne{
        return $this->hasOne(Tags::class, 'id', 'tag_id');
    }
}
