<?php

namespace App\Http\Controllers;

use App\Models\Tags;
use App\Models\Vendas;
use App\Models\Produtos;
use Illuminate\Http\Request;
use App\Models\FotosProdutos;
use Spatie\QueryBuilder\QueryBuilder;
use App\Http\Resources\VendasResource;
use Spatie\QueryBuilder\AllowedFilter;
use App\Http\Resources\ProdutoResource;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\ProdutoFotosResource;

class VendasController extends Controller
{
    public function index()
    {
        $vendas = Vendas::with(['vendaProdutos' => fn($q) =>
            $q->with(['tags.detalhes','produto.imagemPrincipal'])
        ,'cliente']);


        if(auth()->user()->tipo_usuario != 1){
            $vendas->where('cliente_id',auth()->user()->id );
        }



        $vendas=  $vendas->orderBy('id', 'desc')->paginate();

        return VendasResource::collection($vendas);

    }

    public function alteraStatus(Request $request, Vendas $venda){
        if(auth()->user()->tipo_usuario != 1){
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $rules = [
            'status' => 'required|string|max:255',
        ];

        $messages = [
            'status.required' => 'O status é obrigatório.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $venda->status = $request->input('status');
        $venda->save();

        return response()->json([
            'data' => [
                'success' => true,
                'message' => 'Status atualizado com sucesso'
            ]
        ]);
    }

    public function show(Vendas $venda)
    {


        $venda = $venda->load(['vendaProdutos' => fn($q) =>
            $q->with(['tags.detalhes','produto.imagemPrincipal'])
        ,'cliente']);

        if(auth()->user()->tipo_usuario != 1 && auth()->user()->id != $venda->cliente_id){
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return new VendasResource($venda);

    }

}
