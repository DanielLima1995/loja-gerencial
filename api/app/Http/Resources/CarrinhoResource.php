<?php

namespace App\Http\Resources;

use App\Models\CarrinhoProdutos;
use App\Http\Resources\TagsResource;
use App\Http\Resources\CarrinhoProdutosResource;
use App\Models\Tags;
use Illuminate\Http\Resources\Json\JsonResource;

class CarrinhoResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'carrinhoProdutos' => CarrinhoProdutosResource::collection($this->whenLoaded('carrinhoProdutos')),
            'tags' => TagsResource::collection($this->whenLoaded('tags')),
            'tag' => new TagsResource($this->whenLoaded('tag')),

        ];
    }
}
