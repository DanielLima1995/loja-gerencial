<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ImagensTeste extends Model
{
    use HasFactory;

    protected $table = 'table_imagens';
    protected $primaryKey = 'id';

    protected $guarded = [];

}
