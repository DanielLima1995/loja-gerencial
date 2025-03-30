<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Galeria extends Model
{
    use SoftDeletes;

    use HasFactory;
    protected $table = 'tbimagens';
    protected $primaryKey = 'id';

    protected $guarded = [];

}
