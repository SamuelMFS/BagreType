
# Como Usar o Diagrama PlantUML

## O que é PlantUML?
PlantUML é uma ferramenta que transforma código texto em diagramas UML. Você escreve código e gera imagens bonitas automaticamente!

## Opções para Usar:

### OPÇÃO 1: Online (Mais Fácil - Recomendado) 🌐

1. **Acesse o site:** http://www.plantuml.com/plantuml/uml/
   
2. **Copie o conteúdo** do arquivo `diagrama-casos-uso.puml`

3. **Cole no editor** do site PlantUML

4. **Clique em "Submit"** ou aguarde a renderização automática

5. **Baixe a imagem:**
   - Clique com botão direito na imagem gerada
   - Selecione "Salvar imagem como..."
   - Salve como PNG ou SVG

### OPÇÃO 2: Extensão no VS Code 💻

1. **Instale a extensão:**
   - Abra o VS Code
   - Vá em Extensions (Ctrl+Shift+X)
   - Procure por "PlantUML"
   - Instale a extensão "PlantUML" (por jebbs)

2. **Instale Java** (necessário):
   - Baixe em: https://www.java.com/download/
   - Instale normalmente

3. **Use o arquivo:**
   - Abra o arquivo `diagrama-casos-uso.puml`
   - Pressione `Alt+D` para visualizar
   - Ou clique com botão direito > "Preview PlantUML"

4. **Exportar:**
   - Clique com botão direito no preview
   - Selecione "Export Current Diagram"
   - Escolha PNG ou SVG

### OPÇÃO 3: Plugin no IntelliJ/Android Studio 🚀

1. **Instale o plugin:**
   - File > Settings > Plugins
   - Procure "PlantUML"
   - Instale e reinicie

2. **Use:**
   - Abra o arquivo `.puml`
   - O diagrama aparece automaticamente
   - Clique com botão direito > "Export Diagram"

### OPÇÃO 4: Via Terminal (Avançado) ⚙️

1. **Instale Java** (se não tiver)

2. **Baixe PlantUML:**
   - Acesse: https://plantuml.com/download
   - Baixe o arquivo `plantuml.jar`

3. **Execute no terminal:**
   ```bash
   java -jar plantuml.jar diagrama-casos-uso.puml
   ```

4. **Resultado:** Será gerado um arquivo PNG automaticamente

## Recomendação 💡

**Use a OPÇÃO 1 (Online)** - É a mais rápida e não precisa instalar nada!

## Dicas:

- Se quiser editar o diagrama, edite o arquivo `.puml` e re-renderize
- PNG é melhor para documentos Word
- SVG é melhor para qualidade (pode aumentar/diminuir sem perder qualidade)

## Problemas Comuns:

**"Erro ao renderizar"**
- Verifique se copiou todo o código
- Certifique-se que começou com `@startuml` e terminou com `@enduml`

**"Não aparece nada"**
- Aguarde alguns segundos (pode demorar na primeira vez)
- Recarregue a página

**"Quero mudar cores/formato"**
- Edite o arquivo `.puml` - posso te ajudar com isso!
