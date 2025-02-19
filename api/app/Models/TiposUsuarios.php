<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TiposUsuarios extends Model
{
    protected $table = 'tbtipos_usuarios';
    protected $primaryKey = 'id';

    protected $guarded = [];
}
