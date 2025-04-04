<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TagsController;
use App\Http\Controllers\VendasController;
use App\Http\Controllers\CarrinhoController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ClienteEnderecoController;
use App\Http\Controllers\ProdutosController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::get('/tags', [TagsController::class, 'index']);
Route::get('/produtos', [ProdutosController::class, 'index']);
Route::get('/produto/detalhes/{produto}', [ProdutosController::class, 'show']);
Route::get('/produtos/relacionados/{quantidade}/{idProduto?}', [TagsController::class, 'relacionados']);
Route::get('/produto-fotos/{idproduto}/{principal?}', [ProdutosController::class, 'fotos']);
Route::get('/carrinho', [CarrinhoController::class, 'index']);
Route::get('/carrinho/produtos/dados', [CarrinhoController::class, 'produtosSemLogin']);
Route::post('/cadastro', [AuthController::class, 'cadastro']);

Route::middleware('auth:api')->group(function () {
    Route::post('/produtos/cadastrar', [ProdutosController::class, 'store']);
    Route::post('/produto/carrinho', [CarrinhoController::class, 'store']);
    Route::post('/carrinho/editar/produto', [CarrinhoController::class, 'update']);
    Route::delete('/carrinho/excluir/produto/{produto}', [CarrinhoController::class, 'delete']);
    Route::post('/produto', [ProdutosController::class, 'store']);
    Route::post('/produto/{produto}', [ProdutosController::class, 'update']);
    Route::delete('/produto/{produto}', [ProdutosController::class, 'delete']);
    Route::post('/tag', [TagsController::class, 'store']);
    Route::post('/tag/{tag}', [TagsController::class, 'update']);
    Route::get('/vendas', [VendasController::class, 'index']);
    Route::post('/venda/{venda}/status', [VendasController::class, 'alteraStatus']);
    Route::get('/venda/{venda}', [VendasController::class, 'show']);
    Route::post('/endereco', [ClienteEnderecoController::class, 'store']);
    Route::put('/endereco/{endereco}', [ClienteEnderecoController::class, 'update']);
    Route::get('/endereco/{endereco}', [ClienteEnderecoController::class, 'show']);
    Route::get('/enderecos', [ClienteEnderecoController::class, 'index']);
    Route::get('/checkout', [CheckoutController::class, 'index']);
    Route::get('/usuario', [AuthController::class, 'show']);
    Route::post('/checkout', [CheckoutController::class, 'store']);
});

