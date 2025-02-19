<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProdutoFotosResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->tbprodutos_id,
            'idProduto' => $this->tbprodutos_id,
            'imagem' => $this->tbprodutos_fotos_imagem,
            'posicao' => $this->tbprodutos_fotos_posicao
        ];
    }
}
