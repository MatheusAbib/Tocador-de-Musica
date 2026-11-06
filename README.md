
# 🎵 Vintage Music Player

O **Vintage Music Player** é uma aplicação web de reprodução musical que combina a nostalgia dos dispositivos digitais dos anos 2000 com uma experiência interativa de exploração musical.

Inspirado nas estéticas **Y2K e Frutiger Aero**, o projeto apresenta uma interface que simula um ambiente desktop retrô, com janelas de aplicativo, superfícies translúcidas, elementos cromados e um MP3 player virtual.

A aplicação permite explorar discografias, ouvir músicas, descobrir artistas, organizar favoritos e controlar a reprodução diretamente pelo navegador.

> 🔗 **Acesse o projeto online:** [Vintage Music Player](https://matheusabib.github.io/Tocador-de-Musica/)

---

## ✨ Funcionalidades

### 🎧 Exploração musical

- **Catálogo de artistas:** painel lateral com acesso direto aos artistas disponíveis.
- **Busca inteligente:** pesquisa por artistas, músicas e álbuns, com indicadores de carregamento.
- **Discografias completas:** navegação por álbuns, EPs, singles e participações musicais.
- **Visualização de álbuns:** capas, informações e listas de faixas organizadas por lançamento.
- **Resultados relacionados:** exibição de outros artistas encontrados durante a pesquisa.

### 🎶 Reprodução de músicas

- **MP3 player virtual:** dispositivo inspirado nos tocadores portáteis dos anos 2000.
- **Controles de reprodução:** reproduzir, pausar, reiniciar, avançar e retroceder faixas.
- **Barra de progresso interativa:** acompanhamento e alteração da posição da música.
- **Controle de volume:** ajuste por slider e opção de silenciar.
- **Informações em tempo real:** exibição da música atual, duração e tempo decorrido.
- **Animações sincronizadas:** elementos visuais reagem ao estado da reprodução.

### 💿 Modos de reprodução

- **Aleatório global:** reprodução de músicas de todo o catálogo.
- **Aleatório por artista:** seleção de faixas de um artista específico.
- **Aleatório por álbum:** reprodução aleatória dentro de um lançamento.
- **Histórico de reprodução:** evita repetições até que as músicas disponíveis tenham sido percorridas.
- **Reprodução sequencial:** navegação entre faixas de uma mesma seleção.

### ⭐ Favoritos e playlist

- **Favoritos interativos:** adição e remoção de músicas pelos cards e pelo player.
- **Playlist personalizada:** painel dedicado às músicas favoritas.
- **Sincronização em tempo real:** atualização dos estados de favoritos entre diferentes componentes.
- **Persistência local:** favoritos armazenados em `localStorage`.
- **Reprodução pela playlist:** acesso direto às faixas salvas.

### 🖥️ Interface e navegação

- **Desktop retrô:** interface inspirada em sistemas operacionais e softwares musicais dos anos 2000.
- **Identidade Y2K / Frutiger Aero:** gradientes, transparências, efeitos de vidro, acabamentos cromados e cores pastel.
- **Janelas interativas:** barra superior com controles funcionais.
- **Maximizar janela:** amplia a área principal e oculta temporariamente o MP3.
- **Restaurar janela:** retorna ao layout original com o MP3 ao lado.
- **Reiniciar sessão:** botão de fechar que interrompe a reprodução, limpa a pesquisa e restaura a tela inicial.
- **Player expansível:** interface do MP3 com comportamento de expansão e recolhimento.
- **Painéis independentes:** catálogo e playlist com abertura e fechamento próprios.
- **Feedback visual:** indicadores de reprodução, estados ativos e animações de interface.

### 🖼️ Carregamento de conteúdo

- **Skeleton loaders:** placeholders visuais durante o carregamento de imagens.
- **Spinners de pesquisa:** indicação do processamento das buscas.
- **Carregamento assíncrono:** preparação dos resultados antes da exibição.
- **Fallback de imagens:** alternativas visuais para capas e avatares indisponíveis.
- **Cache de avatares:** armazenamento local de imagens de artistas para reutilização.

---

## 🛠️ Tecnologias utilizadas

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Web Audio API](https://img.shields.io/badge/Web_Audio_API-008080?style=flat&logo=html5&logoColor=white)
![localStorage](https://img.shields.io/badge/localStorage-5A29E4?style=flat&logo=html5&logoColor=white)

O projeto utiliza **HTML5, CSS3 e JavaScript puro**, sem dependência de frameworks de interface.

Também utiliza:

- **Web Audio API:** análise do sinal de áudio para visualizações dinâmicas.
- **HTMLAudioElement:** gerenciamento da reprodução musical.
- **Font Awesome e Material Icons:** ícones da interface.
- **Google Fonts:** tipografias Chakra Petch, Space Grotesk e DM Mono.
- **Last.fm API:** integração opcional para obtenção de imagens de artistas.

---

## ⚙️ Funcionalidades técnicas

### Organização do catálogo

O catálogo musical é estruturado em JavaScript, com dados organizados por artista, álbum e faixa.

Cada música pode conter informações como título, arquivo de áudio, capa, álbum e artistas participantes.

Essa estrutura permite reutilizar os mesmos dados na busca, nas discografias, nos modos aleatórios e na playlist.

### Gerenciamento de reprodução

A aplicação mantém um estado central de reprodução, incluindo:

- Música e artista atuais.
- Arquivo de áudio selecionado.
- Contexto e posição da playlist.
- Modo de reprodução ativo.
- Histórico dos modos aleatórios.

Os controles do MP3 e da janela principal compartilham esse estado.

### Busca assíncrona

A pesquisa utiliza normalização de texto para facilitar a correspondência entre termos, incluindo diferenças de acentuação e letras maiúsculas ou minúsculas.

Um identificador de requisição impede que resultados de buscas anteriores substituam uma pesquisa mais recente.

### Sincronização de favoritos

A função `sincronizarEstrelasNaTela()` mantém os indicadores de favoritos consistentes entre os cards de músicas e o player.

Os dados são persistidos no navegador por meio de `localStorage`, sem necessidade de autenticação.

### Carregamento de imagens

O sistema utiliza carregamento assíncrono, placeholders e tratamento de falhas para evitar a exibição de imagens quebradas.

Avatares de artistas podem ser armazenados localmente, reduzindo a necessidade de novas consultas.

### Controles de janela

Os controles da janela principal são gerenciados por JavaScript e classes CSS.

A maximização modifica a disposição dos componentes sem recriar a interface, enquanto a restauração recupera o layout original.

A ação de reinicialização limpa o estado temporário da reprodução e da pesquisa, preservando os favoritos armazenados.

---

## 🎨 Design e experiência visual

A identidade visual combina referências de interfaces digitais dos anos 2000 com elementos característicos do **Frutiger Aero**.

Entre os principais recursos visuais estão:

- Paleta em aqua, azul, lilás e rosa.
- Superfícies translúcidas e efeitos de vidro.
- Gradientes metálicos e acabamentos cromados.
- Botões inspirados em interfaces clássicas de desktop.
- MP3 player com aparência de dispositivo físico.
- CD-ROM animado durante a reprodução.
- Tipografia tecnológica e detalhes de interface retrô.
- Transições e animações para reforçar a interação.

O objetivo é transformar um tocador de música em uma experiência visual nostálgica, sem deixar de oferecer funcionalidades práticas de navegação e reprodução.

---

## 💾 Armazenamento e privacidade

O Vintage Music Player utiliza `localStorage` para armazenar informações locais, como favoritos e cache de imagens.

- Não exige criação de conta.
- Não utiliza autenticação.
- Os favoritos permanecem disponíveis após fechar o navegador.
- As preferências armazenadas são específicas do navegador e dispositivo utilizados.

---

## 🖼️ Inspirações Visuais

A identidade visual do **Vintage Music Player** foi inspirada na estética digital dos anos 2000, combinando elementos do **Frutiger Aero**, interfaces de softwares musicais clássicos e sistemas operacionais da época.

As principais referências incluem superfícies translúcidas, gradientes azuis, acabamentos cromados, controles tridimensionais e interfaces que remetem à experiência de utilizar um computador nos anos 2000.

<table>
  <tr>
    <td width="50%" align="center">
      <img src="assets/inspirations/frutiger-aero.jpg" width="100%" alt="Estética Frutiger Aero" />
      <sub><b>Frutiger Aero</b> — Natureza, água, transparências e tecnologia.</sub>
    </td>
    <td width="50%" align="center">
      <img src="assets/inspirations/y2k-player.jpg" width="100%" alt="Music player Y2K" />
      <sub><b>Y2K Music Player</b> — Interfaces futuristas, cromados e controles físicos.</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="assets/inspirations/windows-media-player.jpg" width="100%" alt="Windows Media Player clássico" />
      <sub><b>Windows Media Player</b> — Bibliotecas musicais e navegação por álbuns.</sub>
    </td>
    <td width="50%" align="center">
      <img src="assets/inspirations/windows-vista.jpg" width="100%" alt="Windows Vista Aero" />
      <sub><b>Windows Vista</b> — Janelas translúcidas, botões e experiência desktop.</sub>
    </td>
  </tr>
</table>

---