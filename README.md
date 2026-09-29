# 🎵 Tocador de Música Online

**Vintage Music Player** é uma aplicação web para ouvir músicas de forma prática e interativa, com uma interface retrô inspirada em toca-discos.

> 🔗 **Acesse o projeto online:** [matheusabib.github.io/Tocador-de-Musica](https://matheusabib.github.io/Tocador-de-Musica/)

## Funcionalidades

- **🎧 Catálogo de Artistas**: Navegue por uma aba lateral com todos os artistas disponíveis.
- **🔍 Busca Inteligente**: Pesquise pelo nome do artista com loader real e resultados carregados só quando tudo estiver pronto.
- **📀 Discografia por Artista**: Visualize álbuns, EPs, singles e participações em outras faixas.
- **❤️ Favoritos Sincronizados**: Adicione ou remova músicas da playlist — as estrelas do player e dos cards sincronizam em tempo real.
- **⏯️ Controle de Reprodução**: Play, pause, pular faixa, reiniciar e arrastar a barra de progresso.
- **🎲 Modo Aleatório Completo**: Aleatório global, por artista ou por álbum, sem repetir até esgotar.
- **📋 Playlist Persistente**: Favoritos salvos em `localStorage` e acessíveis mesmo após fechar o navegador.
- **🎨 Player Expansível**: Botão que colapsa/expande o player a qualquer momento.
- **🖼️ Loaders Visuais**: Skeleton + spinner em todas as capas e avatares enquanto carregam.

## Tecnologias Utilizadas

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![localStorage](https://img.shields.io/badge/localStorage-5A29E4?style=flat&logo=html5&logoColor=white)
![Web Audio API](https://img.shields.io/badge/Web_Audio_API-008080?style=flat&logo=html5&logoColor=white)

## Funcionalidades Técnicas

- **Catálogo em JSON**: banco de dados de músicas separado em `js/database.js` com artista → álbum → faixas, capas e artistas convidados.
- **Cache de imagens**: avatares de artistas são cacheados em `localStorage` após a primeira busca.
- **Loaders reais**: tempo mínimo configurável (500ms) + espera do carregamento real das imagens.
- **Compatibilidade Safari**: uso de `-webkit-backdrop-filter` para efeitos de vidro fosco.
- **Aleatório sem repetição**: fila de histórico por artista/álbum para evitar tocar a mesma música duas vezes seguidas.
- **Sincronização de favoritos**: uma função central (`sincronizarEstrelasNaTela`) mantém player, cards e playlist sempre coerentes.
