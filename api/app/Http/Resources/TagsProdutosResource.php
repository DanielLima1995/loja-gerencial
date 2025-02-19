<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TagsProdutosResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'tags' => new TagsResource($this->whenloaded('tag'))
        ];
    }
}
