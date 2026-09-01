# MOVI

MOVI é um web app mobile-first para Breno e Letícia seguirem uma rotina de academia de quatro dias, aprenderem os movimentos e registrarem a própria evolução. O nome original do briefing foi substituído por **MOVI**, como solicitado.

## Pesquisa e decisões

### Resumo da pesquisa

As recomendações do app foram construídas a partir destas fontes consultadas em 01/09/2026:

- [Physical Activity Guidelines for Americans — 2nd edition](https://odphp.health.gov/sites/default/files/2019-09/Physical_Activity_Guidelines_2nd_edition.pdf): adultos devem praticar fortalecimento muscular envolvendo os grandes grupos musculares em pelo menos dois dias por semana e aumentar a atividade gradualmente.
- [ACSM — Progression Models in Resistance Training for Healthy Adults](https://acsm.org/wp-content/uploads/2025/01/Progression-Models-in-Resistance-Training-for-Healthy-Adults-Simplified.pdf): iniciantes podem começar com 1–3 séries; a progressão deve ser gradual, priorizando técnica, e o descanso pode ser maior nos exercícios compostos.
- [WHO — Global recommendations on physical activity for health](https://www.who.int/docs/default-source/physical-activity/information-sheet-global-recommendations-on-physical-activity-for-health/physical-activity-recommendations-18-64years.pdf): fortalecimento dos grandes grupos musculares em dois ou mais dias por semana e aumento progressivo para pessoas inativas.
- [ACE — Exercise Library](https://www.acefitness.org/resources/everyone/exercise-library/): referência visual e de técnica para fichas de exercícios, padrões de movimento e erros comuns.
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
- O conteúdo de mídia não depende de hotlinking de imagens. Cada ficha usa uma ilustração nativa do app como fallback visual e aponta para a biblioteca ACE como referência externa.

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
- **Detalhe do treino:** aquecimento, exercícios na ordem, check de conclusão, carga, repetições, timer, troca, observações e finalização.
- **Biblioteca:** busca por exercício, músculo ou equipamento e ficha detalhada.
- **Histórico:** sessões concluídas, contagem de exercícios e visão simples de consistência.
- **Guia:** carga inicial, progressão, descanso, falha, aquecimento, dor e aviso educativo.
- **Configurações:** modo claro/escuro, edição dos dias e reinício do progresso da semana.

## Estrutura dos dados

- `Person`: `breno | leticia`.
- `Exercise`: técnica, músculos, equipamento, alternativas, erros e fonte externa.
- `WorkoutDay`: objetivo, duração, grupos, aquecimento, segurança, finalização e sequência de `WorkoutExercise`.
- `WorkoutExercise`: exercício, séries, repetições, descanso e dica curta.
- `ExerciseLog`: carga, repetições feitas e data da atualização.
- `HistoryEntry`: pessoa, treino, data e quantidade de exercícios concluídos.
- `AppState`: preferências, marcações, registros, notas, substituições, histórico e agenda editável.

Os dados de treino ficam em `src/data.ts`; os tipos ficam em `src/types.ts`; o estado de uso é persistido em `localStorage` por `src/storage.ts`. A separação permite adicionar autenticação e sincronização sem misturar a fonte dos treinos com os componentes visuais.

## Implementação

O projeto usa React + TypeScript + Vite, sem dependências de UI desnecessárias. A interface é responsiva, funciona em toque, possui navegação inferior no celular e sidebar no desktop, e suporta modo escuro/claro. A ilustração nativa de exercício é um fallback visual controlado pelo app; o link de referência ACE abre em nova aba.

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

## Aviso de saúde

O MOVI tem finalidade educativa e não substitui a avaliação de um profissional de educação física ou médico. Pessoas com condições de saúde, lesões, gravidez ou sintomas novos devem buscar orientação individual antes de iniciar ou adaptar os exercícios.

