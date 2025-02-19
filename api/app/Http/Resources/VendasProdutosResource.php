<?php

namespace App\Http\Resources;

use App\Models\VendasProdutosTags;
use Illuminate\Http\Resources\Json\JsonResource;

class VendasProdutosResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'quantidade' => $this->quantidade,
            'valorUnitario' => $this->tbprodutos_valor_unitario,
            'tags' => VendasProdutosTagsResource::collection($this->whenloaded('tags')) ,
            'produto' => new ProdutoResource($this->whenloaded('produto'))
        ];
    }
}
