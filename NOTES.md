# Notas de Desenvolvimento e Testes PWA

## Checklist de Testes (Chrome Desktop/Android)

1. **Verificação Inicial**:
   - Abra o DevTools (F12) > Aba **Application**.
   - Em **Service Workers**, verifique se `/service-worker.js` está "Activated and running".
   - Em **Cache Storage**, verifique se existe o cache `jornada-biblica-v1.0.0` com os arquivos iniciais.

2. **Simular Atualização**:
   - Altere a constante `CACHE_VERSION` no arquivo `public/service-worker.js` (ex: para `v1.0.1`).
   - Recarregue a página.
   - O console deve mostrar "Nova versão detectada, recarregando...".
   - Verifique no Cache Storage se o cache antigo foi removido e o novo criado.

3. **Teste Offline**:
   - No DevTools, marque a opção **Offline** na aba Network.
   - Recarregue a página. O app deve carregar normalmente via cache.

4. **Limpeza Manual**:
   - Se algo travar, use o botão **Clear site data** na aba Application > Storage.

## Deploy (GitHub + Cloudflare Pages)

- **Automação**: Ao fazer push para o GitHub, o Cloudflare Pages detecta a mudança e inicia o build automaticamente.
- **Configuração**: Certifique-se de que o diretório de saída no Cloudflare está configurado como `dist`.
- **Headers**: O Cloudflare serve arquivos da pasta `public` (que vão para o root do build) com os tipos MIME corretos automaticamente.