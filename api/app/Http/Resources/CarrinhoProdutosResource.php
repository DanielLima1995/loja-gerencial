<?php

namespace App\Http\Resources;

use App\Http\Resources\TagsResource;
use App\Models\CarrinhoProdutos;
use App\Models\Produtos;
use App\Models\Tags;
use Illuminate\Http\Resources\Json\JsonResource;

class CarrinhoProdutosResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'cor' => $this->tbtags_id,
            'quantidade' => $this->quantidade,
            'tamanho' => $this->tamanho_id,
            'produto' => new ProdutoResource($this->whenLoaded('produto')),
            'tag' => new TagsResource($this->whenLoaded('tag')),
            'tamanho_detalhes' => new TagsResource($this->whenLoaded('tamanho')),

        ];
    }
}
