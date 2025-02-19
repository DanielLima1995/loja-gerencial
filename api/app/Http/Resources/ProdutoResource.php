<?php

namespace App\Http\Resources;

use App\Http\Resources\TagsResource;
use App\Models\TagsProdutos;
use Illuminate\Http\Resources\Json\JsonResource;

class ProdutoResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'titulo' => $this->tbprodutos_titulo,
            'descricao_basica' => $this->tbprodutos_descricao_basica,
            'descricao' => $this->tbprodutos_descricao,
            'valor' => $this->tbprodutos_valor,
            'ativo' => $this->tbprodutos_ativo,
            'data' => $this->tbprodutos_data_cadastro,
            'imagens' => GaleriaResource::collection($this->whenLoaded('imagens')),
            'imagemPrincipal' => new GaleriaResource($this->whenLoaded('imagemPrincipal')),
            'tagsProdutos' => TagsProdutosResource::collection($this->whenLoaded('tagsProdutos')),
            
        ];
    }
}
