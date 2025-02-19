<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GaleriaResource extends JsonResource
{
    public function toArray($request)
    {

        return [
            'id' => $this->id,
            'imagem' => $this->imagem_base64,
            'referencia' => $this->referencia
        ];
    }
}
