# MOVI

MOVI é um web app mobile-first para Breno e Letícia seguirem uma rotina de academia de quatro dias, aprenderem os movimentos e registrarem a própria evolução. O nome original do briefing foi substituído por **MOVI**, como solicitado.

## Pesquisa e decisões

### Resumo da pesquisa

As recomendações do app foram construídas a partir destas fontes consultadas em 03/09/2026:

- [Physical Activity Guidelines for Americans — 2nd edition](https://odphp.health.gov/sites/default/files/2019-09/Physical_Activity_Guidelines_2nd_edition.pdf): adultos devem praticar fortalecimento muscular envolvendo os grandes grupos musculares em pelo menos dois dias por semana e aumentar a atividade gradualmente.
- [ACSM — Resistance Training Guidelines 2026](https://acsm.org/resistance-training-guidelines-update-2026/): a atualização reforça que consistência, individualização e esforço sustentável importam mais que programas complexos; máquinas, pesos livres, elásticos e peso corporal podem funcionar.
- [WHO — Physical activity](https://www.who.int/initiatives/behealthy/physical-activity): adultos devem acumular pelo menos 150 minutos semanais de atividade moderada (ou equivalente) e fortalecer os grandes grupos musculares em dois ou mais dias por semana.
- [ACE — Exercise Library](https://www.acefitness.org/resources/everyone/exercise-library/): referência visual e de técnica para fichas de exercícios, padrões de movimento e erros comuns.
- [Exercise Gym GIFs DB](https://jahelcuadrado.github.io/ExerciseGymGifsDB/): catálogo público versionado usado para exibir duas demonstrações por movimento, com variação de equipamento, pegada ou ângulo quando disponível.
- [NHS — Warming-up and cooling-down exercises](https://www.wsh.nhs.uk/CMS-Documents/Patient-leaflets/Physiotherapy/6655-1-Warming-up-and-cooling-down-exercises.pdf): aquecimento gradual para elevar a temperatura corporal e preparação antes do exercício.
- [NHS — Safety Notice](https://www.leicspart.nhs.uk/wp-content/uploads/2017/11/134-Falls-service-stretching-and-strengthening-exercises.pdf): interrupção diante de sintomas novos, piora ou dor persistente e busca de orientação profissional quando necessário.

Essas fontes orientam o produto, mas não transformam o app em prescrição clínica. As faixas, descansos e escolha dos exercícios são uma implementação conservadora para dois adultos iniciantes e devem ser adaptados com um profissional quando necessário.

### Premissas adotadas

- A rotina começa em quatro dias: segunda, terça, quinta e sexta, com quarta e fim de semana como recuperação ou atividade leve.
- Cada sessão tem cerca de 48–60 minutos, incluindo aquecimento curto.
- A maior parte do treino usa máquinas, cabos e halteres porque são equipamentos comuns e oferecem mais estabilidade para iniciantes.
- A referência inicial é 2–3 séries de 8–15 repetições, ou tempo controlado no core, com 45–120 segundos de descanso.
- A pessoa começa com uma carga que preserva a técnica e deixa aproximadamente 2–3 repetições possíveis. Ao alcançar o topo da faixa sem perder a forma, pode subir cerca de 2–5%.
- “Breno” e “Letícia” têm identidades visuais diferentes, mas os exercícios não são tratados como masculinos ou femininos; a diferença está na prioridade e no volume distribuído.
- Todas as sessões terminam com duas opções de aeróbico de baixo impacto; a pessoa escolhe uma, começando por 8–15 minutos em intensidade leve a moderada. Na rotina da Letícia, esse bloco apoia o objetivo de emagrecimento sem transformar o treino em uma sessão exaustiva.
- A Letícia mantém todos os movimentos originais, mas começa com volume e descansos mais acessíveis. O emagrecimento não é atribuído ao aeróbico isoladamente: depende do conjunto de atividade, alimentação, sono e consistência.
- O botão **Trocar** oferece alternativas equivalentes por padrão de movimento, incluindo uma opção marcada como “Mais fácil” quando há uma versão cadastrada.
- Cada ficha exibe dois GIFs demonstrativos por meio do catálogo público versionado Exercise Gym GIFs DB; a galeria identifica a fonte de cada mídia e mantém a ilustração nativa do app como fallback quando necessário.
- Cada ficha foi ampliada com “o que você deve sentir” e pontos de conferência de postura, além da descrição, respiração, erros comuns e dicas para iniciantes já existentes.
- Para facilitar a revisão em vídeo, cada ficha oferece uma busca específica no YouTube com o nome exato do movimento e os termos “execução correta” e “vídeo curto”. Como resultados do YouTube podem ser removidos ou mudar, o app não fixa um vídeo de terceiro sem confirmação de disponibilidade.

### Divisão semanal

| Dia | Breno | Letícia |
| --- | --- | --- |
| Segunda | Base de cima — peito, costas, ombros, tríceps e core | Pernas & glúteos — quadríceps, glúteos, posterior e core |
| Terça | Pernas base — quadríceps, posterior, glúteos, panturrilhas e core | Parte de cima — costas, peito, ombros, bíceps e tríceps |
| Quarta | Recuperação | Recuperação |
| Quinta | Tronco completo — costas, peito, bíceps, tríceps, ombros e core | Posterior & glúteos — posterior, glúteos, quadríceps, panturrilhas e core |
| Sexta | Pernas posterior — posterior, glúteos, quadríceps, panturrilhas e core | Corpo todo & core — pernas, glúteos, peito, costas, ombros e core |

## Telas principais

- **Início:** treino do dia, progresso da semana, próximo treino e atalhos para guia/biblioteca.
- **Treinos:** calendário completo de Breno ou Letícia, prioridades e acesso a cada sessão.
- **Detalhe do treino:** aquecimento, exercícios na ordem, check de conclusão, carga, repetições, timer, trocas equivalentes, duas opções de aeróbico no final, observações e finalização.
- **Biblioteca:** busca por exercício, músculo ou equipamento e ficha detalhada.
- **Histórico:** sessões concluídas, contagem de exercícios e visão simples de consistência.
- **Guia:** carga inicial, progressão, descanso, falha, aquecimento, dor e aviso educativo.
- **Configurações:** modo claro/escuro, edição dos dias e reinício do progresso da semana.

## Estrutura dos dados

- `Person`: `breno | leticia`.
- `Exercise`: técnica, músculos, equipamento, alternativas, erros e fonte externa.
- `WorkoutDay`: objetivo, duração, grupos, aquecimento, segurança, finalização e sequência de `WorkoutExercise`.
- `CardioOption`: modalidade, duração, intensidade sugerida e instrução prática para a finalização.
- `WorkoutExercise`: exercício, séries, repetições, descanso e dica curta.
- `ExerciseLog`: carga, repetições feitas e data da atualização.
- `HistoryEntry`: pessoa, treino, data e quantidade de exercícios concluídos.
- `AppState`: preferências, marcações, registros, notas, substituições, histórico e agenda editável.

Os dados de treino ficam em `src/data.ts`; os tipos ficam em `src/types.ts`; o estado de uso é persistido em `localStorage` por `src/storage.ts`. A separação permite adicionar autenticação e sincronização sem misturar a fonte dos treinos com os componentes visuais.

## Implementação

O projeto usa React + TypeScript + Vite, sem dependências de UI desnecessárias. A interface é responsiva, funciona em toque, possui navegação inferior no celular e sidebar no desktop, e suporta modo escuro/claro. A ficha de exercício prioriza uma galeria de dois GIFs, informa a origem das mídias e oferece fallback visual controlado pelo app; o link de referência ACE abre em nova aba. Os cartões de exercício permanecem estáveis durante a digitação para preservar o foco dos campos de carga e repetições; modais usam viewport dinâmica, rolagem interna e áreas seguras para iPhone.

Os GIFs são consumidos por uma versão fixada do CDN do Exercise Gym GIFs DB, sem serem baixados ou re-hospedados pelo app. O próprio catálogo informa que os GIFs pertencem aos respectivos autores; por isso, para um lançamento público/comercial, confirme os termos atuais e substitua as URLs por arquivos licenciados diretamente para o projeto, se necessário.

Para rodar:

```bash
npm install
npm run dev
```

Para validar a compilação:

```bash
npm run test
npm run build
```

## Instalar como app

O MOVI é um PWA. Em produção, abra o endereço usando HTTPS e escolha “Instalar app” ou “Adicionar à tela de início” no menu do navegador. No Android/Chrome, a seção **Configurações → Usar como aplicativo** mostra o botão de instalação quando o navegador disponibiliza o prompt; no iPhone/iPad, use **Compartilhar → Adicionar à Tela de Início** no Safari.

## Aviso de saúde

O MOVI tem finalidade educativa e não substitui a avaliação de um profissional de educação física ou médico. Pessoas com condições de saúde, lesões, gravidez ou sintomas novos devem buscar orientação individual antes de iniciar ou adaptar os exercícios.
