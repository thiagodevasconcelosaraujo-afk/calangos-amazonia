# Gerar o APK na nuvem (sem computador)

1. Crie uma conta gratuita em github.com e um repositório novo (ex.: `desafio-calangos`).
2. Envie os arquivos do projeto **descompactados** (o GitHub não abre .zip):
   - No celular, abra o repositório no navegador, ative "Site para computador" e use **Add file → Upload files**, enviando as pastas `src`, `.github`, `index.html`, `package.json`, `vite.config.js`, `capacitor.config.json`, `.gitignore`.
   - Alternativa: abra `github.dev` no repositório (editor web) e arraste os arquivos.
   - A pasta `.github/workflows/build-apk.yml` precisa manter esse caminho exato.
3. Ao confirmar (**Commit**) na branch `main`, a aba **Actions** inicia o workflow "Build APK" sozinho (cerca de 5 a 10 minutos). Também dá para rodar manualmente em Actions → Build APK → Run workflow.
4. Quando ficar verde, abra **Releases** (coluna direita do repositório) e toque em `desafio-dos-calangos.apk` para baixar direto no celular. O arquivo também fica em Actions → o build → Artifacts.
5. No Android, permita "Instalar apps desconhecidos" para o navegador e abra o APK. É um APK de debug: funciona offline e não precisa de loja.

## iOS
Gerar o app iOS exige Mac com Xcode e conta Apple Developer: `npm install && npm run build && npx cap add ios && npx cap open ios`. Não há como instalar IPA sem assinatura da Apple, por isso o workflow gera só o APK.
