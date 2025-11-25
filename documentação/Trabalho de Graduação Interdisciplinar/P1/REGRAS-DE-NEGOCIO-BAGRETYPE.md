# Regras de Negócio - BagreType

## Histórico - Revisão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| [DATA] | 1 | Regras de negócio identificadas no levantamento de requisitos – 1ª investigação. | [Seu Nome] |

---

## RN01 - Email Único

**Nome da Regra de Negócio:** Email Único  
**Código:** RN01

**Descrição:**
Cada usuário deve cadastrar um e-mail único no sistema. O sistema não permite cadastro de e-mails duplicados.

**Caso de Uso/Origem:**
UC01

---

## RN02 - Força da Senha

**Nome da Regra de Negócio:** Força da Senha  
**Código:** RN02

**Descrição:**
Senha deve ter no mínimo 6 caracteres e no máximo 100 caracteres. O sistema valida o comprimento da senha durante o cadastro.

**Caso de Uso/Origem:**
UC01

---

## RN03 - Credenciais Válidas

**Nome da Regra de Negócio:** Credenciais Válidas  
**Código:** RN03

**Descrição:**
Somente e-mail e senha corretos permitem efetuar o login. O sistema valida as credenciais antes de autenticar o usuário.

**Caso de Uso/Origem:**
UC02

---

## RN04 - Email Verificado para Funcionalidades Sensíveis

**Nome da Regra de Negócio:** Email Verificado para Funcionalidades Sensíveis  
**Código:** RN04

**Descrição:**
O usuário só pode participar da coleta de dados, visualizar resultados, iniciar jornada de aprendizado e gerar layouts após confirmar o e-mail via link de verificação enviado após o cadastro.

**Caso de Uso/Origem:**
UC01, UC03, UC04, UC05, UC08

---

## RN05 - Timeout de Sessão

**Nome da Regra de Negócio:** Timeout de Sessão  
**Código:** RN05

**Descrição:**
Sessões inativas por mais de 15 dias são encerradas automaticamente. O usuário precisará fazer login novamente.

**Caso de Uso/Origem:**
UC02

---

## RN06 - Validação de Email

**Nome da Regra de Negócio:** Validação de Email  
**Código:** RN06

**Descrição:**
O sistema valida o formato do e-mail durante o cadastro. E-mails temporários ou descartáveis podem ser bloqueados. O e-mail deve ter formato válido (exemplo: usuario@dominio.com).

**Caso de Uso/Origem:**
UC01

---

## RN07 - Limite de Tentativas de Cadastro

**Nome da Regra de Negócio:** Limite de Tentativas de Cadastro  
**Código:** RN07

**Descrição:**
O sistema limita o número de tentativas de cadastro por período para prevenir abuso. Após muitas tentativas, o usuário deve aguardar antes de tentar novamente.

**Caso de Uso/Origem:**
UC01

---

## RN08 - Expiração de Token de Recuperação

**Nome da Regra de Negócio:** Expiração de Token de Recuperação  
**Código:** RN08

**Descrição:**
Token de recuperação de senha expira após um período determinado. O usuário deve solicitar nova recuperação se o token expirar.

**Caso de Uso/Origem:**
UC11

---

## RN09 - Logout ao Alterar Senha

**Nome da Regra de Negócio:** Logout ao Alterar Senha  
**Código:** RN09

**Descrição:**
Ao alterar ou recuperar a senha, todas as sessões ativas do usuário são encerradas por segurança. O usuário precisará fazer login novamente.

**Caso de Uso/Origem:**
UC11

---

## RN10 - Coleta de Dados Mínima

**Nome da Regra de Negócio:** Coleta de Dados Mínima  
**Código:** RN10

**Descrição:**
Para participar da coleta de dados, o usuário deve completar o questionário inicial e realizar pelo menos uma sequência de teste de digitação. O sistema não permite visualizar resultados sem dados coletados.

**Caso de Uso/Origem:**
UC03, UC04

---

## RN11 - Salvamento Automático de Progresso

**Nome da Regra de Negócio:** Salvamento Automático de Progresso  
**Código:** RN11

**Descrição:**
A cada sessão de digitação completada (coleta de dados, lição ou prática livre), o progresso é salvo automaticamente no banco de dados associado ao usuário autenticado.

**Caso de Uso/Origem:**
UC03, UC06, UC07, UC14

---

## RN12 - Validação de Sequências de Digitação

**Nome da Regra de Negócio:** Validação de Sequências de Digitação  
**Código:** RN12

**Descrição:**
Durante a coleta de dados, o sistema registra apenas sequências válidas. Sequências com mais de 50% de erros são marcadas para análise, mas ainda são armazenadas para fins de pesquisa.

**Caso de Uso/Origem:**
UC03

---

## RN13 - Limite de Sequências por Sessão

**Nome da Regra de Negócio:** Limite de Sequências por Sessão  
**Código:** RN13

**Descrição:**
Cada sessão de coleta de dados coleta um número determinado de sequências de caracteres. O usuário pode realizar múltiplas sessões para aumentar a quantidade de dados coletados.

**Caso de Uso/Origem:**
UC03

---

## RN14 - Baseline Obrigatório para Aprendizado

**Nome da Regra de Negócio:** Baseline Obrigatório para Aprendizado  
**Código:** RN14

**Descrição:**
O usuário deve completar uma avaliação baseline (teste inicial) antes de iniciar a jornada de aprendizado. O baseline é usado para personalizar as lições conforme o nível do usuário.

**Caso de Uso/Origem:**
UC05

---

## RN15 - Progressão Sequencial de Lições

**Nome da Regra de Negócio:** Progressão Sequencial de Lições  
**Código:** RN15

**Descrição:**
As lições devem ser completadas em ordem sequencial. O usuário só pode acessar a próxima lição após completar a anterior com precisão mínima de 80%.

**Caso de Uso/Origem:**
UC05, UC06

---

## RN16 - Precisão Mínima para Conclusão de Lição

**Nome da Regra de Negócio:** Precisão Mínima para Conclusão de Lição  
**Código:** RN16

**Descrição:**
Uma lição só é considerada concluída se o usuário atingir pelo menos 80% de precisão. Caso contrário, o usuário deve repetir a lição.

**Caso de Uso/Origem:**
UC06

---

## RN17 - Limite de Histórico de Sessões

**Nome da Regra de Negócio:** Limite de Histórico de Sessões  
**Código:** RN17

**Descrição:**
O histórico de sessões de digitação exibe no máximo as últimas 100 sessões por usuário. Sessões mais antigas são mantidas no banco de dados mas não aparecem no histórico visual.

**Caso de Uso/Origem:**
UC04, UC10

---

## RN18 - Dados Mínimos para Geração de Layout

**Nome da Regra de Negócio:** Dados Mínimos para Geração de Layout  
**Código:** RN18

**Descrição:**
Para gerar um layout otimizado, o sistema requer que o usuário tenha coletado dados suficientes (mínimo de sequências de digitação) ou que existam dados agregados do sistema de ML baseados em outros usuários.

**Caso de Uso/Origem:**
UC08

---

## RN19 - Idioma da Interface

**Nome da Regra de Negócio:** Idioma da Interface  
**Código:** RN19

**Descrição:**
O sistema suporta dois idiomas: Português (pt-BR) e Inglês (en). O usuário pode alternar entre idiomas a qualquer momento. A preferência é salva no perfil do usuário.

**Caso de Uso/Origem:**
UC13

---

## RN20 - Validação de Movimentos de Teclas

**Nome da Regra de Negócio:** Validação de Movimentos de Teclas  
**Código:** RN20

**Descrição:**
Durante os testes de digitação, o sistema registra apenas teclas válidas pressionadas. Teclas de controle (ESC, Tab, etc.) são tratadas de forma especial e não contam como erros na sequência.

**Caso de Uso/Origem:**
UC03, UC06, UC07

---

## RN21 - Tempo Máximo de Reação

**Nome da Regra de Negócio:** Tempo Máximo de Reação  
**Código:** RN21

**Descrição:**
Tempos de reação superiores a 5 segundos para uma única tecla são considerados inválidos e descartados da análise, pois indicam que o usuário não estava prestando atenção ao teste.

**Caso de Uso/Origem:**
UC03

---

## RN22 - Privacidade de Dados Compartilhados

**Nome da Regra de Negócio:** Privacidade de Dados Compartilhados  
**Código:** RN22

**Descrição:**
Dados compartilhados para pesquisa são sempre anonimizados. Informações pessoais identificáveis são removidas antes de serem utilizadas pelo sistema de ML para otimização de layouts.

**Caso de Uso/Origem:**
UC03

---

## RN23 - Comparação de Layouts

**Nome da Regra de Negócio:** Comparação de Layouts  
**Código:** RN23

**Descrição:**
O usuário pode comparar diferentes layouts de teclado (QWERTY, Dvorak, Colemak, layouts gerados) apenas se tiver dados de digitação coletados suficientes para análise comparativa.

**Caso de Uso/Origem:**
UC09

---

## RN24 - Atualização de Estatísticas

**Nome da Regra de Negócio:** Atualização de Estatísticas  
**Código:** RN24

**Descrição:**
As estatísticas do perfil são atualizadas automaticamente após cada sessão de digitação concluída. O cálculo considera velocidade média (WPM), precisão média e consistência.

**Caso de Uso/Origem:**
UC10, UC14

---

## RN25 - Sessões de Prática Livre

**Nome da Regra de Negócio:** Sessões de Prática Livre  
**Código:** RN25

**Descrição:**
Sessões de prática livre podem ser realizadas sem autenticação, mas os resultados só são salvos se o usuário estiver autenticado. Usuários não autenticados podem praticar mas não têm histórico salvo.

**Caso de Uso/Origem:**
UC07

---

## RN26 - Geração de Layout por Idioma

**Nome da Regra de Negócio:** Geração de Layout por Idioma  
**Código:** RN26

**Descrição:**
Layouts otimizados podem ser gerados de forma universal (múltiplos idiomas) ou específica para um idioma. Layouts específicos requerem dados linguísticos do idioma selecionado.

**Caso de Uso/Origem:**
UC08

---

## RN27 - Validação de Texto Customizado

**Nome da Regra de Negócio:** Validação de Texto Customizado  
**Código:** RN27

**Descrição:**
Textos customizados para prática livre devem ter no mínimo 10 caracteres e no máximo 10.000 caracteres. Textos muito curtos ou muito longos são rejeitados.

**Caso de Uso/Origem:**
UC07

---

## RN28 - Rate Limiting de Requisições

**Nome da Regra de Negócio:** Rate Limiting de Requisições  
**Código:** RN28

**Descrição:**
O sistema limita o número de requisições por minuto para prevenir abuso. Usuários autenticados têm limites mais altos que usuários não autenticados.

**Caso de Uso/Origem:**
UC08, UC09

---

## RN29 - Exportação de Dados

**Nome da Regra de Negócio:** Exportação de Dados  
**Código:** RN29

**Descrição:**
Usuários autenticados podem solicitar exportação de seus dados pessoais de digitação em formato JSON ou CSV. A exportação é processada e disponibilizada para download.

**Caso de Uso/Origem:**
UC10

---

## RN30 - Retenção de Dados

**Nome da Regra de Negócio:** Retenção de Dados  
**Código:** RN30

**Descrição:**
Dados de digitação são mantidos no sistema por período indeterminado para fins de pesquisa e análise. Usuários podem solicitar exclusão de dados pessoais a qualquer momento.

**Caso de Uso/Origem:**
UC03, UC10

