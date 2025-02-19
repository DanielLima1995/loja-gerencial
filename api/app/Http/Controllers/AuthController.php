<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Usuarios;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UsuarioResource;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Função para cadastrar um novo usuário.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function cadastro(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:usuarios,email',
            'cpf' => 'required|string|max:14|unique:usuarios,documento', 
            'senha' => 'required|string|min:8', 
        ]);

        if ($validator->fails()) {

            return response()->json([
                'errors' => $validator->errors()
            ], 400);
        }


        $user = Usuarios::create([
            'nome' => $request->nome,
            'email' => $request->email,
            'documento' => $request->cpf,
            'senha' => Hash::make($request->senha), 
        ]);

        return response()->json([
            'message' => 'Usuário cadastrado com sucesso!',
            'user' => $user
        ], 201); 
    }
    public function login(Request $request){
        $request->validate([
            'email' => 'required',
            'senha' => 'required'
        ]);

        $credentials = $request->only('email', 'senha');

        $user = Usuarios::where('email', $credentials['email'])->with('tipo')->first();
    
        if (!$user || !Hash::check($credentials['senha'], $user->senha)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if (!$token = JWTAuth::fromUser($user)) {
            return response()->json(['error' => 'Could not create token'], 500);
        }

        $expires_in = JWTAuth::factory()->getTTL() * 60;
        $expiration_time = Carbon::now()->addSeconds($expires_in); 

        return response()->json([
            'data' => [
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => $expires_in,
                'expires_at' => $expiration_time->toDateTimeString(),
                'usuario' => new UsuarioResource($user)
            ]
        ]);
    }

    public function show(){
        $usuario = Usuarios::where('id', auth()->user()->id)->with(['tipo'])->first();
        return new UsuarioResource($usuario);
    }
}
