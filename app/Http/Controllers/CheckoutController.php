<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Vendas;
use App\Models\Carrinho;
use App\Models\TagsProdutos;
use Illuminate\Http\Request;
use App\Models\VendasProdutos;
use App\Models\ClienteEndereco;
use App\Models\VendasProdutosTags;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\CarrinhoResource;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\CarrinhoController;

class CheckoutController extends Controller
{
    public function index(Request $request)
    {
        $carrinho = new CarrinhoController();

        $enderecos = ClienteEndereco::where('cliente_id', auth()->user()->id)->get();
        $carrinho = new CarrinhoResource($carrinho->index());

        return response()->json([
            'data' => [
                'carrinho' => new CarrinhoResource($carrinho),
                'enderecos' => $enderecos
            ]
        ], 201);
    }

    public function store(Request $request){

        $rules = [
            'endereco' => 'required|numeric|max:255',
        ];

        $messages = [
            'endereco.required' => 'O endereço de entrega é obrigatório.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $produtos = Carrinho::with([
            'carrinhoProdutos' => fn($q) => $q->with(['tags','produto', 'tamanho'])
        ])->first();

        $produtos->valor_total = 0;

        foreach($produtos->carrinhoProdutos as $produto){
            $produtos->valor_total += ($produto->quantidade * $produto->produto->tbprodutos_valor); 
        }

        try{
            DB::beginTransaction();

            $venda = Vendas::create([
                'status' => 'Em Processamento',
                'cliente_id' => auth()->user()->id,
                'data_compra' => now(),
                'forma_pagamento' => 'Cartão de Crédito',
                'valor_final' => $produtos->valor_total,
                'endereco_id' => $request->endereco,
            ]);
    
    
            foreach($produtos->carrinhoProdutos as $produto){
                $vendaProduto = VendasProdutos::create([
                    'venda_id' => $venda->id,
                    'produto_id' => $produto->tbproduto_id,
                    'quantidade' => $produto->quantidade,
                    'tbprodutos_valor_unitario' => $produto->produto->tbprodutos_valor
                ]);

                $produtoTamanho = VendasProdutosTags::create([
                    'venda_produto_id' => $vendaProduto->id,
                    'tag_id' => $produto->tamanho->id
                ]);
    
                foreach($produto->tags as $tag){
    
                    $produtoTag = VendasProdutosTags::create([
                        'venda_produto_id' => $vendaProduto->id,
                        'tag_id' => $tag->id
                    ]);
    
                }


                DB::commit();

            }
        }catch(Exception $e){
            DB::rollBack();
            return response()->json(['error' => 'Falha ao finalizar a compra usuário.', 'details' => $e->getMessage()], 500);
        }

        return response()->json([
            'data' => [
                'success' => true,
                'message' => 'Compra realizada com sucesso'
            ]
        ]);
    }
}
