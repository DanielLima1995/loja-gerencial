<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VendasResource extends JsonResource
{
    public function toArray($request)
    {

        return [
            'id' => $this->id,
            'status' => $this->status,
            'data_compra' => $this->data_compra,
            'forma_pagamento' => $this->forma_pagamento,
            'valor' => $this->valor_final,
            'vendaProdutos' => VendasProdutosResource::collection($this->whenloaded('vendaProdutos')),
            'cliente' => new UsuarioResource($this->whenloaded('cliente')),
            'quantidadeTotal' => $this->whenloaded('vendaProdutos') ? $this->vendaProdutos->sum('quantidade') : 0
        ];
    }
}
