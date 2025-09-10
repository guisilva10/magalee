# Magalee - Assistente Nutricional

## Fluxo N8N:

## Projeto Magalee – Agente Nutricional Automatizado

### 📌 Visão Geral

Este projeto implementa um fluxo automatizado no **n8n** para gerenciamento nutricional inteligente.  
O sistema recebe mensagens de usuários (texto, áudio ou imagem), processa as informações, utiliza agentes de IA para interpretação e persistência de dados, e gera relatórios personalizados em formato visual.

---

### ⚙️ Estrutura do Fluxo

### 1. **Entrada de Mensagens**

- **Webhook Trigger**: ponto inicial de comunicação.
- **Verificação de Cadastro**:
  - Consulta no banco (Google Sheets) para verificar se o usuário já está registrado.
  - Caso registrado → segue para processamento.
  - Caso não registrado → inicia fluxo de cadastro.

---

### 2. **Processamento de Inputs**

- **Input Message Router**: identifica o tipo de conteúdo recebido:
  - Texto.
  - Áudio.
  - Imagem.
  - Demais formatos → encaminhados para fallback.

- **Edit Fields / Convert to File**: normaliza mensagens de voz ou imagem para processamento.

- **Analyze Voice**:
  - Converte áudio para texto.
  - Retorna transcrição.

- **Analyze Image**:
  - Processa imagens enviadas (ex.: fotos de refeições).
  - Retorna interpretação do conteúdo visual.

- **Get Message**:
  - Padroniza o resultado dos analisadores (texto, voz ou imagem).
  - Unifica saída para os agentes de decisão.

---

### 3. **Agente Principal**

- **Magalee Agent**:
  - Recebe a mensagem padronizada.
  - Utiliza IA para interpretar intenção e dados nutricionais.
  - Decide a ação adequada (ex.: registrar refeição, atualizar cadastro, solicitar mais informações).

- **Memória Simples**:
  - Mantém contexto imediato da interação para suporte ao agente.
  - Permite continuidade em diálogos curtos.

---

### 4. **Persistência de Dados**

- **Google Sheets** (planilhas) utilizado como repositório:
  - **Append Row**: adiciona novas refeições ou cadastros.
  - **Update Row**: atualiza informações existentes.
  - **Delete Row**: remove dados quando necessário.

---

### 5. **Cadastro de Usuário**

- **Register Agent**:
  - Fluxo dedicado a coletar informações do usuário.
  - Interação orientada por IA (Google Gemini).
  - Dados armazenados em planilha (Google Sheets).

- **Informações coletadas**:
  - Nome.
  - Data de nascimento.
  - Peso, altura e gênero.
  - Objetivos nutricionais.
  - Alergias ou restrições alimentares.

---

### 6. **Relatórios Nutricionais**

- **Get Report**:
  - Coleta dados do usuário e suas refeições.
  - **Get Meals Info + Get User Info**: busca registros em planilhas.
  - **Unify + Merge**: consolida dados.

- **Generate Chart**:
  - Produz gráficos e relatórios visuais.
  - Integra métricas de alimentação e perfil.

- **Send Back**:
  - Retorna relatório ao usuário em formato de mensagem com gráfico.

---

## 🗂️ Organização Atual

- **Ferramenta de automação**: n8n.
- **IA utilizada**: Google Gemini (interpretação e cadastro).
- **Banco de dados**: Google Sheets.
- **Mídias suportadas**: texto, áudio e imagem.
- **Saída**: mensagens estruturadas + gráficos com relatório nutricional.

---

## 🚀 Fluxo Resumido

1. Usuário envia mensagem (texto, áudio, imagem).
2. Webhook recebe e identifica se usuário está cadastrado.
3. Input Message Router processa e normaliza a mensagem.
4. Magalee Agent interpreta e decide ação.
5. Dados são gravados/atualizados em Google Sheets.
6. Usuário pode solicitar relatório → sistema gera gráfico consolidado.

---

## 📄 Status Atual

- Fluxo principal implementado no **n8n**.
- Registro e atualização de usuários funcionando via **Google Sheets**.
- Processamento multimodal ativo (texto, voz, imagem).
- Relatórios básicos com gráficos já sendo gerados e enviados.

---

# Fluxo do Dashboard e Documentação do Projeto

# 📔 Diário de Bordo do Projeto: NutriDash

> Documentação da jornada de desenvolvimento de um painel de acompanhamento nutricional personalizado, construído para otimizar a gestão de pacientes e a análise de dados alimentares.

**Status do Projeto:** `Em Desenvolvimento Ativo`
**Data de Início:** `5 de Setembro de 2025`
**Última Atualização:** `10 de Setembro de 2025`

---

## 🎯 O Projeto

O **Magalee - NutriDash** nasceu da necessidade de criar uma ferramenta moderna, rápida e intuitiva para um profissional de nutrição gerenciar seus pacientes. A solução substitui métodos tradicionais, como planilhas complexas e anotações manuais, por um dashboard centralizado, acessível de qualquer lugar.

O principal objetivo é fornecer insights rápidos sobre o progresso dos pacientes, automatizar a visualização de dados e facilitar a comunicação através de relatórios personalizados.

---

## ✨ Funcionalidades Implementadas

Esta seção documenta os principais módulos e funcionalidades desenvolvidas ao longo do projeto.

#### 📊 **Dashboard Principal**

O ponto de partida da aplicação, oferecendo uma visão geral e imediata dos dados mais importantes:

- **Cards de Estatísticas**: Métricas chave como total de pacientes ativos e número de refeições registradas no dia.
- **Atividade Recente**: Um feed com as últimas refeições adicionadas por todos os pacientes.

#### 👥 **Gestão de Pacientes**

O coração do sistema, onde o profissional gerencia sua base de clientes:

- **Listagem Completa**: Visualização de todos os pacientes com suas metas calóricas e de proteína.
- **Edição Rápida**: Funcionalidade para editar as informações e metas de cada paciente através de um formulário intuitivo em um `Sheet`.

#### 📈 **Análise Detalhada por Paciente (Página Dedicada)**

Uma página dinâmica e aprofundada para cada paciente, acessada através de `admin/dashboard/patients/[id]`, contendo:

- **Análise Diária**: Uma tabela detalhada com todas as refeições de um dia específico, com um seletor de data para navegar pelo histórico.
- **Gráfico de Macronutrientes**: Um gráfico de barras que exibe a evolução do consumo de Carboidratos, Proteínas e Gorduras nos últimos 30 dias.
- **Status da Dieta**: Um _badge_ visual que classifica a performance recente do paciente (ex: "Alimentação Adequada", "Consumo Acima da Meta") com base em sua aderência às metas.
- **Relatórios via WhatsApp**: Um botão que gera e envia um relatório de performance mensal diretamente para o WhatsApp do paciente, utilizando `wa.me` для uma comunicação ágil.

#### 📂 **Gestão de Categorias de Refeições**

Uma área para analisar padrões de consumo de forma agregada:

- **Categorização Dinâmica**: As refeições são automaticamente agrupadas em categorias como "Café da manhã", "Almoço", etc., com base na descrição de cada item.
- **Gerenciamento**: Ferramentas para renomear ou excluir uma categoria inteira, atualizando todas as refeições associadas de forma segura com diálogos de confirmação.

---

## 🛠️ Arquitetura e Decisões Técnicas

A escolha da stack tecnológica foi um pilar fundamental para garantir um desenvolvimento rápido, um produto final performático e custos de manutenção praticamente nulos.

| Tecnologia         | Justificativa da Escolha                                                                                                                                                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js 15**     | Escolhido por seu **App Router**, que permite uma arquitetura moderna com Server Components, otimizando o carregamento de dados e melhorando a performance geral da aplicação.                                                           |
| **Server Actions** | Utilizadas como a camada de back-end. Essa abordagem "backendless" simplifica a arquitetura, co-localiza a lógica de mutação de dados com os componentes e elimina a necessidade de criar uma API REST tradicional.                      |
| **Google Sheets**  | Selecionado como **banco de dados** pela sua simplicidade, custo zero e familiaridade para o cliente final, que pode visualizar e até mesmo editar dados brutos facilmente se necessário. Ideal para projetos de pequena a média escala. |
| **Next-Auth v5**   | Implementado para garantir a segurança da aplicação, protegendo todas as rotas do dashboard com um sistema de autenticação robusto e fácil de configurar.                                                                                |
| **Shadcn/ui**      | Adotado para a construção da interface. Sua abordagem de componentes não estilizados, combinada com **Tailwind CSS**, permitiu a criação de uma UI consistente, bonita e acessível em tempo recorde.                                     |

---

## 🗓️ Diário de Desenvolvimento (Changelog)

Um registro das principais entregas e marcos do projeto.

- Estruturação inicial do projeto com Next.js 15 e App Router.
- Configuração da autenticação com Next-Auth e da conexão com Google Sheets.
- Criação do Dashboard principal e das páginas de Pacientes e Categorias.

- Desenvolvida a página dinâmica de detalhes do paciente.
- Adicionado gráfico de consumo de macros e tabela de refeições diárias.
- Implementado o _badge_ de status da dieta.

- Implementada a funcionalidade de envio de relatórios mensais via WhatsApp.
- Criada a documentação inicial do projeto no `README.md`.
