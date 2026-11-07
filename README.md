# Acredita Emprega: novo website

Proposta de novo portal para o programa **Acredita Emprega** (Programa de Apoio à Produtividade) do Ministério da Juventude e Desporto, em substituição de `www.acreditaemprega.mjd.gov.mz`.

## Estrutura

```
index.html        página única com todas as secções
css/styles.css    estilos (responsivo, alto contraste, impressão)
js/data.js        lista dos 78 distritos abrangidos, por província
js/main.js        interacções: menu, pesquisa de distritos, verificador, FAQ, formulários
assets/           logótipo provisório e favicon
```

Site estático, sem dependências externas nem tipos de letra descarregados da Internet. Funciona em qualquer servidor web (Apache, Nginx, IIS) ou abrindo `index.html` directamente.

## Melhorias em relação ao site actual

- Estado da edição visível no topo (candidaturas encerradas, ligação para recuperar o código).
- Verificador de elegibilidade que corre no navegador, sem enviar dados.
- Pesquisa de distritos tolerante a acentos («gurue» encontra «Gurúè»).
- Perguntas frequentes reescritas, filtráveis por categoria.
- Calendário da edição de 2026 e números de execução.
- Aviso contra burlas e destaque da linha gratuita 116.
- Acessibilidade: ligação «Saltar para o conteúdo», aumento de texto, alto contraste, navegação por teclado, respeito pela preferência de movimento reduzido.
- Pensado para telemóveis com pouca largura de banda: página leve, sem imagens pesadas.

## Antes de publicar

1. **Logótipo e emblema**: substituir `assets/logo.svg` pelos ficheiros oficiais do MJD e do programa. Acrescentar o logótipo do Banco Mundial no rodapé, conforme as regras de visibilidade do financiador.
2. **Números**: os valores da secção de estatísticas (145 400 candidaturas, 72 000 seleccionados, 50 400 mulheres, 14 400 subvenções) vêm de notícias de Setembro de 2026. Confirmar com o MJD e retirar a nota [FONTE A CONFIRMAR].
3. **Formulários** «Informa-te» e «Expressa-te»: hoje só validam no navegador. Para enviarem dados, acrescentar `data-endpoint="https://..."` ao `<form>` com o URL da API do MJD (recebe `POST` com `FormData`).
4. **Lista de apurados**: o botão aponta para a secção do site actual. Substituir pelo endereço definitivo das listas.
5. **Ortografia**: o texto usa a grafia anterior ao Acordo Ortográfico (acção, selecção, objectivo). Ajustar se a norma editorial do Ministério for outra.

## Fontes do conteúdo

- Site oficial: https://acreditaemprega.mjd.gov.mz/
- Portal de candidaturas: https://candidaturasemprega.mjd.gov.mz/
- Evidências, 17/03/2026: lançamento com 80 mil bolsas
- Rádio Miramar, 13/03/2026: lançamento na Beira
- Jornal Económico, 06/09/2026: 72 mil jovens seleccionados
