<?php

namespace App\Http\Controllers;

use App\Models\Galeria;
use App\Models\Produtos;
use Illuminate\Http\Request;
use App\Models\FotosProdutos;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Http\Resources\ProdutoResource;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\ProdutoFotosResource;
use App\Models\TagsProdutos;
use Exception;

class ProdutosController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page');
        $produtos = QueryBuilder::for(Produtos::class)
        ->with(['imagemPrincipal', 'tagsProdutos.tag'])
        ->allowedFilters([
            AllowedFilter::callback('tags', function ($query, $tags) {
                $tagsArray = is_array($tags) ? $tags : explode(',', $tags); 

                return $query->whereHas('tagsProdutos', function ($query) use ($tagsArray) {
                    $query->whereIn('tbtags_produtos.tbtags_id', $tagsArray);
                })
                ->when(count($tagsArray) > 1, function($q) use ($tagsArray){
                    $q->whereHas('tagsProdutos', function ($query) use ($tagsArray) {
                        $query->havingRaw('COUNT(DISTINCT tbtags_produtos.tbtags_id) >= ?', [count($tagsArray)]);
                    })
                    ->whereDoesntHave('tagsProdutos', function ($query) use ($tagsArray) {
                        $query->whereNotIn('tbtags_produtos.tbtags_id', $tagsArray);
                    });
                });
            }),
            AllowedFilter::partial('busca', 'tbprodutos_titulo')
            
        ])
        ->orderBy('id', 'desc')
        ->paginate($perPage);
        




    

        
        return ProdutoResource::collection($produtos);
    }

    public function store(Request $request)
    {
        $rules = [
            'titulo' => 'required|string|max:255',
            'descricao_basica' => 'required|string|max:255',
            'descricao' => 'required|string',
            'valor' => 'required|string',
            'imagens.*' => 'required|string',
            'tags.*' => 'required|array'
        ];

        $messages = [
            'titulo.required' => 'O título é obrigatório.',
            'descricao_basica.required' => 'A descrição básica é obrigatória.',
            'descricao.required' => 'A descrição é obrigatória.',
            'valor.required' => 'O valor é obrigatório.'
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        
        $produto = Produtos::create([
            'tbusuarios_id' => auth()->user()->id, 
            'tbprodutos_titulo' => $request->input('titulo'),
            'tbprodutos_descricao_basica' => $request->input('descricao_basica'),
            'tbprodutos_descricao' => $request->input('descricao'),
            'tbprodutos_valor' => str_replace(['.', ','], ['', '.'], $request->input('valor')) 
        ]);

        if ($produto) {
            if($request->input('imagens')){
                foreach($request->input('imagens') as $key => $foto){
                        Galeria::create([
                            'tbproduto_id' => $produto->id,
                            'imagem_base64' => $foto,
                            'referencia' => ($key + 1)
                        ]);                    
                }
            }

            if($request->input('tags')){
                $tags = collect($request->input('tags'))->map(
                    fn($item) =>
                        collect($item)->map(
                            fn($subitem) => [
                                'tbtags_id' => $subitem['id'] ?? $subitem,
                            ]
                        )
                )->pluck('*.tbtags_id')->flatten();
                
                foreach($tags as $tag){
                    TagsProdutos::create([
                        'tbproduto_id' => $produto->id,
                        'tbtags_id' => $tag
                    ]);
                }

            }
            return response()->json(['produto' => $produto], 201);
        } else {
            return response()->json(['error' => 'Falha ao cadastrar o produto.'], 500);
        }
    }

    public function fotos(Request $request, $idproduto, $principal = 1){
        $fotos = FotosProdutos::where('tbprodutos_id', $idproduto)
        ->when(
            $principal === 1, fn($q) => $q->where('tbprodutos_fotos_posicao', 1)
        )
        ->get();

        return ProdutoFotosResource::collection($fotos);

    }

    public function show(Produtos $produto){
        $produto = $produto->load(['imagens','tagsProdutos.tag']);
        
        $tagsOrdenadas = []; 
        foreach($produto?->tagsProdutos as $relacao){
            if(data_get($relacao, 'tag')){
                $tagsOrdenadas[$relacao->tag->tipo][] = $relacao->tag;
            }
        }
        
        return response([
            'data' => [
                'produto' => new ProdutoResource($produto),
            'tags' => $tagsOrdenadas
            ]
            ]);
    }

    public function update(Request $request, Produtos $produto ){
        $produto->load(['imagens']);

        $rules = [
            'titulo' => 'required|string|max:255',
            'descricao_basica' => 'required|string|max:255',
            'descricao' => 'required|string',
            'valor' => 'required|string',
            'imagens.*' => 'required|string',
            'tags.*' => 'required|array'
        ];

        $messages = [
            'titulo.required' => 'O título é obrigatório.',
            'descricao_basica.required' => 'A descrição básica é obrigatória.',
            'descricao.required' => 'A descrição é obrigatória.',
            'valor.required' => 'O valor é obrigatório.'
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $produto->tbprodutos_titulo = $request->input('titulo');
        $produto->tbprodutos_descricao_basica = $request->input('descricao_basica');
        $produto->tbprodutos_descricao = $request->input('descricao');
        $produto->tbprodutos_valor = str_replace(['.', ','], ['', '.'], $request->input('valor'));

        $produto->save();

        if ($produto) {
             $imagensAtuais = $produto->imagens->keyBy('referencia');

             $imagensNovas = collect($request->input('imagens'))->keyBy(fn($item, $key) => $key + 1);
        
            foreach ($imagensNovas as $referencia => $imagemBase64) {
                if ($imagensAtuais->has($referencia)) {
                    $imagemAtual = $imagensAtuais->get($referencia);
                    $imagemAtual->update(['imagem_base64' => $imagemBase64]);
                } else {
                    Galeria::create([
                        'tbproduto_id' => $produto->id,
                        'imagem_base64' => $imagemBase64,
                        'referencia' => $referencia,
                    ]);
                }
            }
        
            $referenciasNovas = $imagensNovas->keys();
            $imagensAtuais
                ->filter(fn($imagem) => !$referenciasNovas->contains($imagem->referencia))
                ->each(fn($imagem) => $imagem->delete());
            if ($request->input('tags')) {
                $tagsNovas = collect($request->input('tags'))
                    ->map(fn($item) => collect($item)->map(fn($subitem) => $subitem['id'] ?? $subitem))
                    ->flatten();
            
                $tagsAtuais = TagsProdutos::where('tbproduto_id', $produto->id)->pluck('tbtags_id');
            
                $tagsAdicionar = $tagsNovas->diff($tagsAtuais);
            
                $tagsRemover = $tagsAtuais->diff($tagsNovas);
            
                foreach ($tagsAdicionar as $tagId) {
                    TagsProdutos::create([
                        'tbproduto_id' => $produto->id,
                        'tbtags_id' => $tagId,
                    ]);
                }
            
                TagsProdutos::where('tbproduto_id', $produto->id)
                    ->whereIn('tbtags_id', $tagsRemover)
                    ->delete();
            }
            return response()->json(['produto' => $produto], 201);
        } else {
            return response()->json(['error' => 'Falha ao cadastrar o produto.'], 500);
        }
    }

    public function delete(Request $request, Produtos $produto ){
        if(auth()->user()->tipo_usuario != 1){
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try{
            $produto->delete();
        }catch(Exception $e){
            return response()->json(['error' => 'Falha ao remover o produto.'], 500);
        }

        return response()->json(['message' => 'Produto Removido com Sucesso.']);
    }
}
