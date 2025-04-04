<?php

namespace App\Http\Controllers;

use App\Models\Tags;
use App\Models\Produtos;
use Illuminate\Http\Request;
use App\Models\FotosProdutos;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Http\Resources\ProdutoResource;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\ProdutoFotosResource;

class TagsController extends Controller
{
    public function index()
    {
        die;
        $tags = QueryBuilder::for(Tags::class)->select(['tipo','descricao','cor', 'id'])
        ->allowedFilters([
            AllowedFilter::callback('isCadastro', function ($query, $tags) {
                return $query->when(
                    $tags, fn($q) => $q->whereNot('tipo', 'Preço')
                );
            })
            
        ])
        ->orderBy('descricao')
        ->get();
        $tagsOrdenadas = [];

        foreach($tags as $key => $item){
            $tagsOrdenadas[$item->tipo][] = [
                "tipo" => $item->descricao, "cor" => $item->cor, 'id' => $item->id
            ];
        }

        $keys = $tags->pluck('tipo')->unique()->values()->toArray();
        sort($keys);

        return response(Array(
            "dados" => $tagsOrdenadas,
            "chaves" => $keys
        ));
    }

    public function relacionados($quantidade = 5, $idProduto = null){
        if($idProduto != null){
            $produto = Produtos::inRandomOrder()->first();
        }else{
            $produto = Produtos::where('id', $idProduto)->first();
        }

        $produto = $produto->load(['tagsProdutos.tag']);

        if(count($produto->tagsProdutos) == 0){
            $queryProdutos = Produtos::whereNot('id', $produto->id);
        }else{
            $idTags = $produto->tagsProdutos->pluck('tbtags_id');
            $queryProdutos = Produtos::whereHas('tagsProdutos', fn($query)=> 
                    $query->whereNot('tbproduto_id', $produto->id)->whereIn('tbtags_id', $idTags)
            );
        }

        $produtos = $queryProdutos->with(['imagemPrincipal','tagsProdutos.tag'])->inRandomOrder()->take($quantidade)->get();

        
        return ProdutoResource::collection($produtos);
    }

    public function store(Request $request){
        if(auth()->user()->tipo_usuario != 1){
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $rules = [
            'tipo' => 'required|string|max:255',
            'descricao' => 'required|string|max:255',
            'cor' => 'sometimes',
        ];

        $messages = [
            'tipo.required' => 'O tipo é obrigatório.',
            'descricao.required' => 'A descriçãoé obrigatória.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tag = Tags::create([
            'cor' => $request->input('cor'), 
            'tipo' => $request->input('tipo'),
            'descricao' => $request->input('descricao'),
        ]);

        return response()->json([
            'data' => [
                'success' => true,
                'message' => 'Tag adicionada com sucesso'
            ]
        ]);
    }

    public function update(Request $request, Tags $tag){
        if(auth()->user()->tipo_usuario != 1){
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $rules = [
            'tipo' => 'required|string|max:255',
            'descricao' => 'required|string|max:255',
            'cor' => 'sometimes',
        ];

        $messages = [
            'tipo.required' => 'O tipo é obrigatório.',
            'descricao.required' => 'A descriçãoé obrigatória.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tag->tipo = $request->input('tipo');
        $tag->descricao = $request->input('descricao');
        $tag->cor = $request->input('cor');

        $tag->save();

        return response()->json([
            'data' => [
                'success' => true,
                'message' => 'Tag editada com sucesso'
            ]
        ]);
    }
}
