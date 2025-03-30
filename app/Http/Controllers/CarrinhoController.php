<?php

namespace App\Http\Controllers;

use App\Models\Carrinho;
use App\Models\Produtos;
use Illuminate\Http\Request;
use App\Models\CarrinhoProdutos;
use App\Http\Resources\ProdutoResource;
use App\Http\Resources\CarrinhoResource;
use Illuminate\Support\Facades\Validator;

class CarrinhoController extends Controller
{
    public function index()
    {
        $dados = Carrinho::with([
            'carrinhoProdutos.tag',
            'carrinhoProdutos.produto.imagemPrincipal',
            'carrinhoProdutos.produto.tagsProdutos.tag',
            'carrinhoProdutos.tamanho'
        ])
        ->where('status','Ativo')
        ->where('usuario_id', auth()->user()->id)
        ->first();

        return new CarrinhoResource($dados);
    }

    public function produtosSemLogin(Request $request)
    {
        $produtos = $request->all()['produtos'];
        $produtos = explode(',', $produtos);

        $dados = Produtos::with(['imagemPrincipal','tagsProdutos.tag'])
        ->whereIn('id', $produtos)
        ->get();

        return  ProdutoResource::collection($dados);
    }

    public function delete(CarrinhoProdutos $produto){
        $produto = $produto->load(['carrinho']);
        
        if($produto->carrinho->usuario_id != auth()->user()->id){
            return response()->json(['error' => 'Unauthorized'], 401);
        }


        $produto->delete();

        return response()->json([
            'data' => [
                'success' => true,
                'message' => 'Produto excluido do carrinho'
            ]
        ]);
    }

    public function store(Request $request){
        $data = $request->all();
        
        $validator = Validator::make($data, [
            '*.id' => 'required|exists:tbprodutos,id',
            '*.cor' => 'required|exists:tbtags,id',    
            '*.quantidade' => 'required|integer|min:1',  
            '*.tamanho' => 'required|exists:tbtags,id'
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'data' => [
                    'success' => false,
                    'message' => 'Erro na validação dos dados',
                    'errors' => $validator->errors(),
                ],
            ], 422);
        }

        $carrinhoAtivo = Carrinho::where('usuario_id', auth()->user()->id)->first();

        foreach($data as $key => $item){
            if($carrinhoAtivo){
                $produtos = CarrinhoProdutos::where('tbcarrinho_id', $carrinhoAtivo->id)->where('tbproduto_id', data_get($item, 'id'))->where('tbtags_id',  data_get($item, 'cor'))->where('tamanho_id',  data_get($item, 'tamanho'))->first();
                if($produtos){
                    $produtos->quantidade += data_get($item, 'quantidade', 0);
                    $produtos->save();
                }else{
                    CarrinhoProdutos::create([
                        'tbcarrinho_id' => $carrinhoAtivo->id,
                        'tbproduto_id' => data_get($item, 'id'),
                        'tbtags_id' => data_get($item, 'cor'),
                        'quantidade' =>  data_get($item, 'quantidade'),
                        'tamanho_id' => data_get($item, 'tamanho')
                    ]);
                }
            }else{
                $carrinho = Carrinho::create([
                    'usuario_id' => auth()->user()->id
                ]);
    
                CarrinhoProdutos::create([  
                    'tbcarrinho_id' => $carrinho->id,
                    'tbproduto_id' => data_get($data, 'id'),
                    'tbtags_id' => data_get($data, 'cor'),
                    'quantidade' =>  data_get($data, 'quantidade'),
                    'tamanho_id' => data_get($item, 'tamanho')
                ]);
            }
        }
        

        return response()->json([
            'data' => [
                'success' => true,
                'message' => 'Produto adicionado com sucesso'
            ]
        ]);
    }

    public function update(Request $request){
        $data = $request->all();

    $validator = Validator::make($data, [
        'id' => 'required|integer|exists:tbcarrinho_produtos,id',
        'ref' => 'required|string|in:cor,tamanho,quantidade',
        'valor' => 'required',                         
    ]);

    if ($validator->fails()) {
        return response()->json([
            'data' => [
                'success' => false,
                'message' => 'Erro na validação dos dados',
                'errors' => $validator->errors(),
            ],
        ], 422);
    }

        $carrinho = Carrinho::where('usuario_id', auth()->user()->id)->first();
        $produto = CarrinhoProdutos::where('tbcarrinho_id', $carrinho->id)->where('id', $data['id'])->first();

        if(!$produto){
            return response()->json([
                'data' => [
                    'success' => false,
                    'message' => 'Falha ao encontrar produto'
                ]
            ], 404);
        }

        switch($data['ref']) :
            case('cor') :
                $reference = 'tbtags_id';
                break;
            case('tamanho') :
                $reference = 'tamanho_id';
                break;
            default:
                $reference = $data['ref'];
                break;
        endswitch;

        $produto[$reference] = $data['valor'];
        $produto->save();

        return response()->json([
            'data' => [
                'success' => true,
                'message' => 'Produto atualizado com sucesso'
            ]
        ]);
    }
}
