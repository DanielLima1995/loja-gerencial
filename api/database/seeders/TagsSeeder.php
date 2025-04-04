<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tags = [
            'Gênero' => [
                ['descricao' => 'Feminino', 'cor' => null],
                ['descricao' => 'Masculino', 'cor' => null],
                ['descricao' => 'Infantil', 'cor' => null],
            ],
            'Tamanho' => [
                ['descricao' => 'PP', 'cor' => null],
                ['descricao' => 'P', 'cor' => null],
                ['descricao' => 'M', 'cor' => null],
                ['descricao' => 'G', 'cor' => null],
                ['descricao' => 'GG', 'cor' => null],
                ['descricao' => '30', 'cor' => null],
                ['descricao' => '32', 'cor' => null],
                ['descricao' => '34', 'cor' => null],
                ['descricao' => '36', 'cor' => null],
                ['descricao' => '38', 'cor' => null],
                ['descricao' => '40', 'cor' => null],
                ['descricao' => '42', 'cor' => null],
                ['descricao' => '44', 'cor' => null],
                ['descricao' => '46', 'cor' => null],
                ['descricao' => '48', 'cor' => null],
                ['descricao' => '50', 'cor' => null],
            ],
            'Cores' => [
                ['descricao' => 'Amarelo', 'cor' => '#FFFF00'],
                ['descricao' => 'Azul', 'cor' => '#0000FF'],
                ['descricao' => 'Bege', 'cor' => '#F5F5DC'],
                ['descricao' => 'Branco', 'cor' => '#FFFFFF'],
                ['descricao' => 'Cinza', 'cor' => '#808080'],
                ['descricao' => 'Laranja', 'cor' => '#FFA500'],
                ['descricao' => 'Marrom', 'cor' => '#A52A2A'],
                ['descricao' => 'Preto', 'cor' => '#000000'],
                ['descricao' => 'Rosa', 'cor' => '#FFC0CB'],
                ['descricao' => 'Roxo', 'cor' => '#800080'],
                ['descricao' => 'Verde', 'cor' => '#008000'],
                ['descricao' => 'Vermelho', 'cor' => '#FF0000'],
            ],
            'Estilo' => [
                ['descricao' => 'Casual', 'cor' => null],
                ['descricao' => 'Esportivo', 'cor' => null],
                ['descricao' => 'Formal', 'cor' => null],
                ['descricao' => 'Moderno', 'cor' => null],
                ['descricao' => 'Retrô', 'cor' => null],
                ['descricao' => 'Romântico', 'cor' => null],
            ],
            'Material' => [
                ['descricao' => 'Algodão', 'cor' => null],
                ['descricao' => 'Couro', 'cor' => null],
                ['descricao' => 'Jeans', 'cor' => null],
                ['descricao' => 'Linho', 'cor' => null],
                ['descricao' => 'Poliéster', 'cor' => null],
                ['descricao' => 'Seda', 'cor' => null],
                ['descricao' => 'Veludo', 'cor' => null],
            ],
            'Comprimento' => [
                ['descricao' => 'Curto', 'cor' => null],
                ['descricao' => 'Médio', 'cor' => null],
                ['descricao' => 'Longo', 'cor' => null],
            ],
            'Preço' => [
                ['descricao' => 'Até R$50', 'cor' => null],
                ['descricao' => 'R$50 a R$100', 'cor' => null],
                ['descricao' => 'R$100 a R$200', 'cor' => null],
                ['descricao' => 'Acima de R$200', 'cor' => null],
            ],
        ];

        foreach ($tags as $tipo => $items) {
            foreach ($items as $item) {
                DB::table('tbtags')->insert([
                    'tipo' => $tipo,
                    'descricao' => $item['descricao'],
                    'cor' => $item['cor'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
