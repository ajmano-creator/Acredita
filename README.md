# Acredita Emprega: novo website

Nova versão do portal https://www.acreditaemprega.mjd.gov.mz, do programa **Acredita Emprega** (Programa de Apoio à Produtividade) do Ministério da Juventude e Desporto.

Reúne todos os conteúdos do site actual, com a mesma estrutura de menu e a identidade visual do programa (logótipo, cores, fotografia, mapa e cartazes oficiais), e acrescenta funcionalidades novas.

## Estrutura

```
index.html                   página única com todas as secções
css/styles.css               estilos (responsivo, alto contraste, impressão)
js/data.js                   os 78 distritos abrangidos, por província
js/main.js                   menu, submenu, pesquisa de distritos, verificador, FAQ, formulários, cartazes
assets/img/logo.png          logótipo MJD + Acredita Emprega (do site oficial)
assets/img/hero.jpg          fotografia do banner (do site oficial, comprimida de 2,3 MB para 198 KB)
assets/img/mapa-distritos.png mapa dos distritos abrangidos (do site oficial)
assets/img/banco-mundial.png logótipo do parceiro
assets/posts/                cartazes de Notícias & Eventos (do site oficial, redimensionados)
assets/favicon.svg           ícone do separador
```

Site estático, sem dependências externas. Funciona em qualquer servidor web (Apache, Nginx, IIS) ou abrindo `index.html` directamente. Peso total aproximado: 900 KB.

## Correspondência com o site actual

| Site actual | Novo site |
|---|---|
| Menu: Início, Sobre (O Programa, Critérios, Perguntas), Concorrer, Lista de Apurados, Notícias & Eventos, Parceiros, Contactos | Igual, com submenu acessível por teclado; todas as ligações funcionam (no actual, várias apontam para `#`) |
| Banner «Candidate-se a uma Bolsa de Formação» com Informa-te, Resultados, Expressa-te | Igual, com aviso de candidaturas encerradas |
| Nível de candidaturas submetidas (sem número) | Mostra os números divulgados e «Ver listas» |
| Requisitos: idade, nacionalidade, nível académico, localização | Igual, mais situação laboral e disponibilidade para formação presencial (do cartaz oficial) e verificador interactivo |
| Distritos abrangidos (mapa e lista) | Mapa, lista e pesquisa sem acentos |
| Como funciona (só em imagem) | As seis etapas passam a texto, legível por motores de busca e leitores de ecrã |
| Notícias & Eventos (três cartazes sem título) | Cartazes com título, resumo e ampliação |
| Informa-te & Expressa-te | Iguais, com validação |
| Parceiro: Banco Mundial | Igual, com referência ao projecto EAGER |
| Perguntas frequentes | Iguais, revistas, sem a pergunta duplicada, filtráveis por categoria |
| Reclamações | Igual |
| Contactos | Igual, mais redes sociais |
| Texto sobre o EMPREGA (17% assalariados, 21% desemprego jovem urbano) | Integrado em «O que é o Acredita Emprega» |

## Antes de publicar

1. **Números**: 145 400 candidaturas e 72 000 seleccionados vêm de notícias de Setembro de 2026. Confirmar com o MJD e retirar a nota [FONTE A CONFIRMAR].
2. **Formulários**: hoje só validam no navegador. Para enviarem dados, acrescentar `data-endpoint="https://..."` ao `<form>` com o URL do serviço do MJD (recebe `POST` com `FormData`).
3. **Lista de apurados**: o botão aponta para a secção do site actual. Substituir pelo endereço definitivo das listas.
4. **Redes sociais**: os cartazes indicam `mjdoficial` em todas as redes. Confirmar os endereços exactos para os tornar ligações.
5. **Datas das notícias**: o site actual mostra 19/11/2022 nos cartazes de 2026. Não foram copiadas; indicar as datas certas se forem necessárias.
6. **Ortografia**: o texto usa a grafia anterior ao Acordo Ortográfico (acção, selecção, actividade). Ajustar se a norma editorial do Ministério for outra.
