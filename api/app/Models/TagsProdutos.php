<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TagsProdutos extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'tbtags_produtos';
    protected $primaryKey = 'id';

    protected $guarded = [];

    public function tag(): HasOne
    {
        return $this->hasOne(Tags::class, 'id', 'tbtags_id');
    }

    public function tags(): HasOne
    {
        return $this->hasOne(Tags::class, 'id', 'tbtags_id');
    }
}
