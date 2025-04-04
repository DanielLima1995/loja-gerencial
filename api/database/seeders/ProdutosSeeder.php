<?php

namespace Database\Seeders;

use App\Models\Tags;
use App\Models\Galeria;
use App\Models\Produtos;
use Illuminate\Support\Str;
use App\Models\ImagensTeste;
use App\Models\TagsProdutos;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProdutosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        $titulos = [
            'Camisa Jeans',
            'Vestido de Linho',
            'Calça Jeans',
            'Blusa de Algodão',
            'Jaqueta de Couro',
            'Saia Plissada',
            'Shorts de Sarja',
            'Casaco de Lã',
            'Camisa Social',
            'Macacão Jeans',
            'Suéter de Lã',
            'Legging Esportiva',
            'Blazer Feminino',
            'Moletom Unissex',
            'Regata de Algodão',
            'Polo Masculina',
            'Saída de Praia',
            'Bermuda de Tecido',
            'Camisa Polo',
            'Vestido Longo'
        ];

        // Inserindo dados em Produtos e Galeria
        foreach ($titulos as $titulo) {
            // Criando descrição básica e detalhada baseadas no título
            $descricaoBasica = "Produto de alta qualidade: " . $titulo . ". Ideal para diversas ocasiões.";
            $descricaoDetalhada = "O(a) " . $titulo . " é confeccionado(a) com materiais de excelente qualidade, garantindo conforto e durabilidade. Perfeito para o seu estilo.";

            // Criando registro no model Produtos
            $produto = Produtos::create([
                'tbprodutos_titulo' => $titulo,
                'tbprodutos_descricao_basica' => Str::limit($descricaoBasica, 150),
                'tbprodutos_descricao' => $descricaoDetalhada,
                'tbprodutos_valor' => rand(1000, 100000) / 100, // Valores entre 10.00 e 1000.00
                'tbusuarios_id' => 2
            ]);

            // Recuperando 4 imagens aleatórias do model ImagensTeste
            $imagens = ImagensTeste::inRandomOrder()->take(4)->get();

            // Criando registros no model Galeria
            foreach ($imagens as $key => $imagem) {
                Galeria::create([
                    'imagem_base64' => $imagem->imagem_base64,
                    'tbproduto_id' => $produto->id,
                    'referencia' => ($key + 1)
                ]);
            }

            $cores = Tags::inRandomOrder()->where('tipo', 'Cores')->take(7)->get();
            $tamanhos = Tags::inRandomOrder()->where('tipo', 'Tamanho')->take(4)->get();
            $estilo = Tags::inRandomOrder()->where('tipo', 'Estilo')->take(2)->get();
            $material = Tags::inRandomOrder()->where('tipo', 'Material')->take(2)->get();
            $comprimento = Tags::inRandomOrder()->where('tipo', 'Comprimento')->take(1)->get();

            // Criando registros no model TagsProdutos para cores
            foreach ($cores as $cor) {
                TagsProdutos::create([
                    'tbproduto_id' => $produto->id,
                    'tbtags_id' => $cor->id,
                ]);
            }

            // Criando registros no model TagsProdutos para tamanhos
            foreach ($tamanhos as $tamanho) {
                TagsProdutos::create([
                    'tbproduto_id' => $produto->id,
                    'tbtags_id' => $tamanho->id,
                ]);
            }

            // Criando registros no model TagsProdutos para estilo
            foreach ($estilo as $itemEstilo) {
                TagsProdutos::create([
                    'tbproduto_id' => $produto->id,
                    'tbtags_id' => $itemEstilo->id,
                ]);
            }

            // Criando registros no model TagsProdutos para material
            foreach ($material as $itemMaterial) {
                TagsProdutos::create([
                    'tbproduto_id' => $produto->id,
                    'tbtags_id' => $itemMaterial->id,
                ]);
            }

            // Criando registro no model TagsProdutos para comprimento
            foreach ($comprimento as $itemComprimento) {
                TagsProdutos::create([
                    'tbproduto_id' => $produto->id,
                    'tbtags_id' => $itemComprimento->id,
                ]);
            }
        }
    }
}
