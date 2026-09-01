Quero que você crie um web app chamado “Nosso Ritmo”, desenvolvido em React e pensado prioritariamente para celulares.

## Objetivo do projeto

O aplicativo deve ajudar a mim, Breno, e à minha noiva, Letícia, a seguir uma rotina semanal de academia e aprender a executar corretamente cada exercício.

Somos iniciantes, então os treinos devem ser simples, seguros, equilibrados e possíveis de realizar em uma academia convencional. Evite exercícios excessivamente técnicos ou que exijam equipamentos incomuns.

Antes de montar os treinos, pesquise na internet recomendações atuais e confiáveis sobre:

* Divisão semanal de treinos para iniciantes;
* Quantidade adequada de exercícios, séries, repetições e descanso;
* Frequência semanal recomendada para cada grupo muscular;
* Execução correta e erros comuns de cada exercício;
* Progressão de carga para iniciantes;
* Aquecimento e cuidados básicos de segurança.

Priorize fontes confiáveis, como organizações de saúde, educação física, medicina esportiva e profissionais reconhecidos. Não use apenas blogs genéricos. Registre no projeto os links das principais fontes consultadas e não invente informações.

## Planejamento semanal

Crie inicialmente uma rotina de quatro dias de treino por semana, com possibilidade de alteração posteriormente.

O treino precisa ser equilibrado. Não deixe grupos musculares importantes de fora apenas porque não foram mencionados.

### Treino do Breno

Meu objetivo inicial é desenvolver o corpo de maneira geral, com maior atenção para:

* Peito;
* Costas;
* Bíceps;
* Pernas.

Inclua também exercícios adequados para ombros, tríceps e abdômen, para que o treino não fique desequilibrado.

### Treino da Letícia

O treino da Letícia deve desenvolver o corpo todo, mas com maior atenção para:

* Pernas;
* Glúteos;
* Posterior de coxa;
* Abdômen.

Inclua também exercícios para costas, peito, braços e ombros. Não trate exercícios como exclusivamente “masculinos” ou “femininos”; a diferença deve estar na prioridade dos objetivos e na distribuição do volume de treino.

Para cada pessoa, monte uma divisão semanal clara. Por exemplo:

* Segunda-feira: grupos musculares trabalhados;
* Terça-feira: grupos musculares trabalhados;
* Quinta-feira: grupos musculares trabalhados;
* Sexta-feira: grupos musculares trabalhados.

A divisão definitiva deve ser baseada na pesquisa realizada. Considere o descanso adequado entre treinos do mesmo grupo muscular.

## Informações de cada treino

Para cada dia, exiba:

* Nome e objetivo do treino;
* Grupos musculares trabalhados;
* Duração estimada;
* Aquecimento recomendado;
* Exercícios em ordem de execução;
* Número de séries;
* Faixa de repetições ou tempo;
* Intervalo de descanso;
* Orientação básica sobre escolha de carga;
* Observações de segurança;
* Alongamento ou finalização, quando fizer sentido.

## Informações de cada exercício

Cada exercício deve possuir uma página ou modal com:

* Nome;
* Grupo muscular principal;
* Músculos secundários;
* Equipamento necessário;
* GIF, imagem ou vídeo demonstrativo;
* Explicação passo a passo;
* Postura inicial;
* Como executar o movimento;
* Como respirar;
* Erros mais comuns;
* Dicas para iniciantes;
* Alternativa mais fácil;
* Exercício substituto caso o equipamento esteja ocupado;
* Alerta para interromper o exercício se houver dor incomum.

Use apenas imagens, GIFs e vídeos que possam ser utilizados legalmente. Não copie ou hospede conteúdo protegido sem autorização. Quando necessário, utilize vídeos incorporados de fontes confiáveis ou mídias com licença compatível, mantendo os créditos e links de origem.

## Funcionalidades

O aplicativo deve possuir:

1. Uma aba “Breno” com meu calendário e meus treinos;
2. Uma aba “Letícia” com o calendário e os treinos dela;
3. Tela inicial mostrando o treino do dia;
4. Visualização da semana completa;
5. Marcação de exercícios e treinos concluídos;
6. Registro da carga utilizada em cada exercício;
7. Registro de repetições realizadas;
8. Histórico simples de cargas e treinos;
9. Cronômetro de descanso entre as séries;
10. Botão para substituir um exercício;
11. Campo para anotações;
12. Persistência dos dados no navegador;
13. Opção de reiniciar ou editar a semana;
14. Interface fácil de usar durante o treino.

Também quero que o aplicativo explique brevemente:

* Como escolher a carga inicial;
* Quando aumentar a carga;
* Quanto descansar;
* Por que não é necessário treinar até a falha em todas as séries;
* Diferença entre dor muscular normal e um possível sinal de lesão.

Inclua um aviso deixando claro que o aplicativo tem finalidade educativa e não substitui a avaliação de um profissional de educação física ou médico.

## Design e experiência

O design deve ser:

* Mobile-first;
* Bonito, moderno e minimalista;
* Fácil de usar com uma mão;
* Com textos legíveis e botões grandes;
* Adequado para o ambiente de academia;
* Com modo escuro;
* Com identidade visual própria para cada pessoa, sem exagerar em estereótipos de gênero;
* Responsivo também para desktop.

Na tela do treino, destaque o exercício atual e permita avançar facilmente para o próximo.

## Requisitos técnicos

* Utilize React com TypeScript;
* Organize o projeto em componentes reutilizáveis;
* Separe os dados dos treinos da interface;
* Crie tipos para pessoas, semanas, dias, exercícios, séries e registros;
* Armazene inicialmente os dados com localStorage ou IndexedDB;
* Estruture o projeto para permitir a inclusão futura de autenticação e sincronização;
* Evite dependências desnecessárias;
* Garanta acessibilidade básica;
* Adicione tratamento para ausência ou falha no carregamento das mídias;
* Não dependa de links frágeis ou de hotlinking de imagens;
* Crie dados iniciais completos para os dois treinos.

Antes de começar a implementação, apresente:

1. Um resumo da pesquisa realizada, com fontes;
2. As premissas adotadas;
3. A divisão semanal proposta para Breno e Letícia;
4. Uma lista das principais telas;
5. A estrutura dos dados;
6. Um plano breve de implementação.

Depois disso, implemente o aplicativo completo, execute os testes e verifique se ele funciona corretamente em uma tela de celular. Faça escolhas razoáveis quando algum detalhe não estiver definido e registre essas escolhas no README.

