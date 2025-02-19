<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VendasProdutosTagsResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'vendaProdutoId' => $this->venda_produto_id,
            'detalhes' => new TagsResource($this->whenloaded('detalhes')) ,
        ];
    }
}
