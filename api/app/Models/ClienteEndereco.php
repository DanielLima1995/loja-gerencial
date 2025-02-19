<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClienteEndereco extends Model
{
    use HasFactory;

    protected $fillable = [
        'cep',
        'logradouro',
        'bairro',
        'localidade',
        'uf',
        'estado',
        'numero',
        'complemento',
        'ponto_referencia',
        'cliente_id'
    ];
}
