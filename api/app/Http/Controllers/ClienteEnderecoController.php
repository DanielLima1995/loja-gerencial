<?php

namespace App\Http\Controllers;

use App\Models\ClienteEndereco;
use Illuminate\Http\Request;

class ClienteEnderecoController extends Controller
{
    public function index(Request $request)
    {
        $endereco = ClienteEndereco::where('cliente_id', auth()->user()->id)->get();
        return response()->json($endereco, 201);
    }

    public function show(Request $request, ClienteEndereco $endereco)
    {
        if($endereco->cliente_id != auth()->user()->id){
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        return response()->json($endereco, 201);
    }

    public function store(Request $request)
    {

        $request->validate([
            'cep' => 'required|string',
            'logradouro' => 'required|string',
            'bairro' => 'required|string',
            'localidade' => 'required|string',
            'uf' => 'required|string',
            'estado' => 'required|string',
            'numero' => 'required|string',
        ]);

        $insert = $request->all();
        $insert['cliente_id'] = auth()->user()->id;


        $endereco = ClienteEndereco::create($insert);

        return response()->json($endereco, 201);
    }

    public function update(Request $request, ClienteEndereco $endereco)
    {

        if($endereco->cliente_id != auth()->user()->id){
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'cep' => 'required|string',
            'logradouro' => 'required|string',
            'bairro' => 'required|string',
            'localidade' => 'required|string',
            'uf' => 'required|string',
            'estado' => 'required|string',
            'numero' => 'required|string',
        ]);

        $endereco->update($request->all());

        return response()->json($endereco);
    }
}
