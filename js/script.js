//  const audioPlayer = document.getElementById('audioPlayer');
//         const playPauseIcon = document.getElementById('playPauseIcon');
//         let isPlaying = false;
//         let currentAudioSrc = '';

//         // Lista de músicas (simulando um banco de dados)
//         const allResults = [
// //Lisa
//             { title: 'Chill', artist: 'LISA', audioSrc: 'musica/LISA - Chill (Lyric Video) [pZh-Q8wfwU8].mp3' },
//             { title: 'Born Again', artist: 'LISA, Raye, Doja Cat', audioSrc: 'musica/LISA - Born Again feat. Doja Cat & RAYE (Lyric Video) [zcmCAo_kHmU].mp3' },
//             { title: 'New Woman', artist: 'LISA, Rosália', audioSrc: 'musica/LISA - New Woman feat ROSALÍA (Lyric Video) [qwwQlJW10uc].mp3' },
//             { title: 'Thunder', artist: 'LISA', audioSrc: 'musica/LISA - Thunder (Lyric Video) [dzqmRAec9rs].mp3' },
//             { title: 'Lifestyle', artist: 'LISA', audioSrc: 'musica/LISA - Lifestyle (Lyric Video) [XxO_6yTIi0g].mp3' },
//             { title: 'When Im With You', artist: 'LISA, Tyla', audioSrc: 'musica/LISA - When I\'m With You feat. Tyla (Lyric Video) [G3cjeH4iHwc].mp3' },
//             { title: 'Rockstar', artist: 'LISA', audioSrc: 'musica/Rockstar (Extended) [wJX65suPsVs].mp3' },
//             { title: 'Elastigirl', artist: 'LISA', audioSrc: 'musica/LISA - Elastigirl (Lyric Video) [eEbrI8O-iBs].mp3' },

// //Doja Cat
//             { title: 'Options', artist: 'Doja Cat', audioSrc: 'musica/ytmp3free.cc_doja-cat-options-visualizer-ft-jid-youtubemp3free.org.mp3' },
// 	        { title: 'Lose My Mind', artist: 'Doja Cat, Don Toliver', audioSrc: 'musica/Lose My Mind (feat. Doja Cat) [jQJWsL6Gscc].mp3' },
//             { title: 'Demons', artist: 'Doja Cat', audioSrc: 'musica/utomp3.com - Doja Cat  Demons Official Video.mp3' },
//  	        { title: 'Been like this', artist: 'Doja Cat', audioSrc: 'musica/utomp3.com - Doja Cat  Been Like This Visualizer.mp3' },
//             { title: 'Candy', artist: 'Doja Cat', audioSrc: 'musica/utomp3.com - Doja Cat  Candy Audio.mp3' },
//             { title: 'Kiss Me More', artist: 'Doja Cat, SZA', audioSrc: 'musica/Doja Cat - Kiss Me More (Lyrics) ft. SZA [Ab6E2BsuLJ0].mp3' },
//             { title: 'Casual', artist: 'Doja Cat', audioSrc: 'musica/Doja Cat - Casual (Official Audio) [dvK4Apd5m3M].mp3' },

// //Summer Walker
//             { title: 'Insane', artist: 'Summer Walker', audioSrc: 'musica/utomp3.com - Summer Walker  Insane Lyric Video.mp3' },

// //Don Toliver
//             { title: 'No Pole', artist: 'Don Toliver', audioSrc: 'musica/Don Toliver - No Pole [Official Visualizer] [fCeiUX59_FM].mp3' },
//             { title: 'Drugs N Hella Medolies', artist: 'Don Toliver, Kali Uchis', audioSrc: 'musica/Drugs N Hella Melodies (feat. Kali Uchis) [R6kkB98AZ28].mp3' },

// //Lana
//             { title: 'Tough', artist: 'Lana Del Rey, Quavo', audioSrc: 'musica/Quavo, Lana Del Rey - Tough (Visualizer) [R2hgq8j6ETY].mp3' },
//             { title: 'Brooklyn Baby', artist: 'Lana Del Rey', audioSrc: 'musica/Lana Del Rey - Brooklyn Baby (Official Audio) [T5xcnjAG8pE].mp3' },
//             { title: 'Born to Die', artist: 'Lana Del Rey', audioSrc: 'musica/Lana Del Rey - Born To Die (Lyrics) [uN46mvvLauQ].mp3' },
//             { title: 'Diet Montain Dew', artist: 'Lana Del Rey', audioSrc: 'musica/Diet Mountain Dew [sEetXo3R-aM].mp3' },
//             { title: 'The Other Woman', artist: 'Lana Del Rey', audioSrc: 'musica/The Other Woman [7KzPh_x5w14].mp3' },
//             { title: 'Once Upon a Dream', artist: 'Lana Del Rey', audioSrc: 'musica/Lana Del Rey - Once Upon a Dream [Tradução_Legendado] _ Malévola [ZnRBqBqp5aM].mp3' },
//             { title: 'Art Deco', artist: 'Lana Del Rey', audioSrc: 'musica/Art Deco [QbLGjeR9bvI].mp3' },
//             { title: 'Music To Whatch Boys To', artist: 'Lana Del Rey', audioSrc: 'musica/Lana Del Rey - Music To Watch Boys To [Lyric Video] [tqDxkPGRFK8].mp3' },
//             { title: 'Peppers', artist: 'Lana Del Rey', audioSrc: 'musica/Lana Del Rey - Peppers (Audio) ft. Tommy Genesis [hNFoCOKk7LE].mp3' },

// //Pink
//             { title: 'Tonight', artist: 'Pink Pantheress', audioSrc: 'musica/PinkPantheress - Tonight (Lyrics) [EMelE2kw07k].mp3' },
//             { title: 'Stateside', artist: 'Pink Pantheress', audioSrc: 'musica/PinkPantheress - Stateside (Lyrics) [IcjR5nxJYlw].mp3' },
//             { title: 'Nice to Meet You', artist: 'Pink Pantheress', audioSrc: 'musica/PinkPantheress - Nice to meet you (Solo Version) [KK1jj57qdBA].mp3' },
//             { title: 'Pain', artist: 'Pink Pantheress', audioSrc: 'musica/Pink Pantheress - Pain (Official Visualiser) [REzdbqfiN9o].mp3' },
//             { title: 'I Must Apologise', artist: 'Pink Pantheress', audioSrc: 'musica/PinkPantheress - I must apologise (Lyrics) [uU2wa9BbLSk].mp3' },
//             { title: 'Illegal', artist: 'Pink Pantheress', audioSrc: 'musica/PinkPantheress - Illegal (Official Lyric Video) [KcV3RByF7tQ].mp3' },

// //SZA
//             { title: 'Saturn', artist: 'SZA', audioSrc: 'musica/SZA - Saturn [V2G8ESoDXm8].mp3' },
//             { title: 'Used', artist: 'SZA, Don Toliver', audioSrc: 'musica/Don Toliver - No Pole [Official Visualizer] [fCeiUX59_FM].mp3' },
//             { title: 'Kitchen', artist: 'SZA', audioSrc: 'musica/SZA - Kitchen (Official Audio) [2kabEeizyaw].mp3' },
//             { title: 'Kill Bill', artist: 'SZA', audioSrc: 'musica/SZA - Kill Bill (Official Audio) [SQnc1QibapQ].mp3' },
//             { title: 'Shirt', artist: 'SZA', audioSrc: 'musica/SZA - Shirt (Audio) [p9rllutpWq4].mp3' },
//             { title: 'Luther', artist: 'SZA, Kendrick Lamar', audioSrc: 'musica/Kendrick Lamar - luther (Official Audio) [HfWLgELllZs].mp3' },
//             { title: 'BMF', artist: 'SZA', audioSrc: 'musica/SZA - BMF (Official Audio) [hWjwNgiLMgA].mp3' },
            
            
// //Raye
//             { title: 'Escapism', artist: 'Raye', audioSrc: 'musica/utomp3.com - RAYE 070 Shake  Escapism Official Music Video.mp3' },
//             { title: 'Flip a Switch', artist: 'Raye, Coi Leray', audioSrc: 'musica/utomp3.com - RAYE  Flip A Switch ft Coi Leray.mp3' },
//             { title: 'Escapism REMIX', artist: 'Raye', audioSrc: 'musica/utomp3.com - Escapism 4am Remix.mp3' },
//             { title: 'Hard out Here', artist: 'Raye', audioSrc: 'musica/utomp3.com - RAYE  Hard Out Here.mp3' },
//             { title: 'Genesis', artist: 'Raye', audioSrc: 'musica/RAYE - Genesis. [aOX8gyc27K4].mp3' },
//             { title: 'Prada', artist: 'Raye', audioSrc: 'musica/cassö, RAYE, D-Block Europe - Prada (Lyrics) [ZOYg4VXojCc] (1).mp3' },

// //Beyonce
//             { title: 'Bodyguard', artist: 'Beyonce', audioSrc: 'musica/utomp3.com - Beyoncé  BODYGUARD Official Lyric Video.mp3' },
//             { title: 'Haunted', artist: 'Beyonce', audioSrc: 'musica/utomp3.com - Beyoncé  Haunted Audio.mp3' },
//             { title: 'Virgos groove', artist: 'Beyonce', audioSrc: 'musica/utomp3.com - Beyoncé  VIRGOS GROOVE Official Lyric Video.mp3' },
//             { title: 'Flawless REMIX', artist: 'Beyonce, Nicki Minaj', audioSrc: 'musica/Flawless Remix [qZaLAAcehX4].mp3' },
//             { title: '6 Inch', artist: 'Beyonce, The Weeknd', audioSrc: 'musica/6 Inch [UKMmfBkrhtY].mp3' },
//             { title: 'America Has a Problem REMIX', artist: 'Beyonce, Kendrick Lamar', audioSrc: 'musica/Beyoncé - AMERICA HAS A PROBLEM (Feat. Kendrick Lamar) - (Official Lyric Video) [Q0E4wVF2a4k].mp3' },
//             { title: 'Blow', artist: 'Beyonce', audioSrc: 'musica/Blow - Beyoncé [uUEK0jlwPWU].mp3' },
//             { title: 'Breack My Soul REMIX', artist: 'Beyonce, Madonna', audioSrc: 'musica/Beyoncé, Madonna - BREAK MY SOUL (THE QUEENS REMIX - Official Visualizer) [7UgIGVDEs_8].mp3' },
//             { title: 'Alien Superstar', artist: 'Beyonce', audioSrc: 'musica/Beyoncé - ALIEN SUPERSTAR (Official Lyric Video) [e_aT9pAGQo8].mp3' },
//             { title: 'Cozy', artist: 'Beyonce', audioSrc: 'musica/Beyoncé - COZY (Official Lyric Video) [81j9gt1rXuk].mp3' },
//             { title: 'Sweet Dreams', artist: 'Beyonce', audioSrc: 'musica/Beyoncé - Sweet Dreams [WEE_eSRiZSQ].mp3' },
//             { title: 'All Night', artist: 'Beyonce', audioSrc: 'musica/Beyoncé - All Night (Lyrics) [7_iLl9YTuL4].mp3' },
//             { title: 'Jealous', artist: 'Beyonce', audioSrc: 'musica/Beyoncé - Jealous (Audio) [Py8Vzm3L3T4].mp3' },
//             { title: 'Bigger', artist: 'Beyonce', audioSrc: 'musica/Beyoncé - BIGGER (Official Audio) [14di5tJxn7c].mp3' },
// //Gorillaz
//             { title: 'Shes My Collar', artist: 'Gorillaz, Kali Uchis', audioSrc: 'musica/utomp3.com - Gorillaz  Shes My Collar HQ.mp3' },
//             { title: 'Andromeda', artist: 'Gorillaz', audioSrc: 'musica/Gorillaz - Andromeda (Official Audio) [9W44NWYwa1g].mp3' },

// //BlackPink
//             { title: 'How You Like That', artist: 'BLACKPINK', audioSrc: 'musica/BLACKPINK - How You Like That (Lyrics) [aHnHwrJjR3U].mp3' },
//             { title: 'Pink Venom', artist: 'BLACKPINK', audioSrc: 'musica/BLACKPINK - Pink Venom (Lyrics) [wcEIo-PE9Ho].mp3' },
//             { title: 'Kill This Love', artist: 'BLACKPINK', audioSrc: 'musica/BLACKPINK - Kill This Love (Lyrics) [OkmVcYtCqjw].mp3' },
//             { title: 'Shut Down', artist: 'BLACKPINK', audioSrc: 'musica/BLACKPINK Shut Down Lyrics (블랙핑크 Shut Down 가사) (Color Coded Lyrics) [Cix9CdpYS6s].mp3' },

// //Kali Uchis
//             { title: '10%', artist: 'Kali Uchis', audioSrc: 'musica/utomp3.com - KAYTRANADA  10 Official Video ft Kali Uchis.mp3' },
//             { title: 'Feel Like a Fool', artist: 'Kali Uchis', audioSrc: 'musica/utomp3.com - Feel Like A Fool.mp3' },
//             { title: 'Fall Apart,', artist: 'Kali Uchis', audioSrc: 'musica/Kali Uchis - Fall Apart, (Audio) [BRLnd0EJ-3Y].mp3' },
//             { title: 'Dead To Me', artist: 'Kali Uchis', audioSrc: 'musica/Dead To Me [OcUDK4kAUIw].mp3' },
//             { title: 'Just a Stranger', artist: 'Kali Uchis', audioSrc: 'musica/Just A Stranger - Kali Uchis ~ Lyrics [6l69L1HJeQY].mp3' },
//             { title: 'I Wish You Roses', artist: 'Kali Uchis', audioSrc: 'musica/Kali Uchis - I Wish you Roses (Official Music Video) [-Y7zc0eO26k].mp3' },
//             { title: 'Si Nos Es Contigo REMIX', artist: 'Kali Uchis', audioSrc: 'musica/Cris MJ, Kali Uchis, JHAYCO - SI NO ES CONTIGO REMIX [SqAGWRpccm0].mp3' },
//             { title: 'Deserve Me', artist: 'Kali Uchis, Summer Walker', audioSrc: 'musica/Kali Uchis, Summer Walker - Deserve Me [Official Audio] [7dq8CvY9a0g].mp3' },
//             { title: 'In My Dreams', artist: 'Kali Uchis', audioSrc: 'musica/In My Dreams [eTMLZ3HlUGE].mp3' },
//             { title: 'Heaven is a Home', artist: 'Kali Uchis', audioSrc: 'musica/Kali Uchis - Heaven Is A Home (Audio) [K2bDlogTEt0].mp3' },
//             { title: 'Fantasy', artist: 'Kali Uchis, Don Toliver', audioSrc: 'musica/Kali Uchis, Don Toliver - Fantasy [Official Audio] [KWkx5jTtZ_0].mp3' },
//             { title: 'Endlessly', artist: 'Kali Uchis', audioSrc: 'musica/Kali Uchis - Endlessly [Official Audio] [t_CLW5WTQp4].mp3' },
//             { title: 'Moral Conscience', artist: 'Kali Uchis', audioSrc: 'musica/Kali Uchis - Moral Conscience [Official Audio] [KYT93GC5NIg].mp3' },
//             { title: 'Hasta Cuando', artist: 'Kali Uchis', audioSrc: 'musica/Kali Uchis - Hasta Cuando [Official Audio] [YtbObhyCg9k].mp3' },

// //Andrea Valle
//             { title: 'Lover Girl', artist: 'Andrea Valle', audioSrc: 'musica/utomp3.com - Andrea Vallé  Lovergirl.mp3' },
//             { title: 'WIYLL', artist: 'Andrea Valle', audioSrc: 'musica/utomp3.com - WIYLL.mp3' },

// //Anitta
//             { title: 'Downtown', artist: 'Anitta, J balvin', audioSrc: 'musica/utomp3.com - Anitta  J Balvin  Downtown Official Music Video.mp3' },
//             { title: 'Maria Elegante', artist: 'Anitta', audioSrc: 'musica/utomp3.com - Anitta  Maria Elegante Feat Afro B Official Audio.mp3' },
//             { title: 'Sabana', artist: 'Anitta', audioSrc: 'musica/Anitta - Sabana (Official Audio) [KDeraV6cWZo].mp3' },
//             { title: 'Ur Baby', artist: 'Anitta, Khalid', audioSrc: 'musica/Ur Baby (feat. Khalid) [Official Audio] [2nnWB3w1rKc].mp3' },
//             { title: 'Boys Don’t Cry', artist: 'Anitta', audioSrc: 'musica/Anitta – Boys Don’t Cry (Lyrics) [NUysAPuoVVo].mp3' },

// //Billie Elish
//             { title: 'I didnt change my number', artist: 'Billie Elish', audioSrc: 'musica/utomp3.com - Billie Eilish  I Didnt Change My Number Official Lyric Video.mp3' },
//             { title: 'Chihiro', artist: 'Billie Elish', audioSrc: 'musica/Billie Eilish - CHIHIRO (Official Lyric Video) [e_AZJzYe7CU].mp3' },

// //Hotel Ugly
//             { title: 'Shut Up My Moms Calling', artist: 'Hotel Ugly', audioSrc: 'musica/utomp3.com - Hotel Ugly  Shut Up My Moms Calling.mp3' },

// //Iza
//             { title: 'Nunca Mais', artist: 'IZA', audioSrc: 'musica/utomp3.com - IZA  Nunca Mais Visualizer.mp3' },
//             { title: 'Bonzão', artist: 'IZA', audioSrc: 'musica/utomp3.com - IZA Tiwa Savage  Bomzão Visualizer.mp3' },

// //Kendrick Lamar
//             { title: 'The Recipe', artist: 'Kendrick Lamar', audioSrc: 'musica/utomp3.com - Kendrick Lamar  The Recipe Lyric Video ft Dr Dre (1).mp3' },
//             { title: 'All the stars', artist: 'Kendrick Lamar, SZA', audioSrc: 'musica/utomp3.com - Kendrick Lamar SZA  All The Stars.mp3' },
            
// //Rihanna 
// 	        { title: 'Consideration', artist: 'Rihanna,SZA', audioSrc: 'musica/utomp3.com - Consideration.mp3' },
//             { title: 'Loyalty', artist: 'Rihanna, Kendrick Lamar', audioSrc: 'musica/utomp3.com - Kendrick Lamar  LOYALTY ft Rihanna.mp3' },
//             { title: 'Same Ol’ Mistakes', artist: 'Rihanna', audioSrc: 'musica/Same Ol’ Mistakes [y3OBsTTUsjk].mp3' },
//             { title: 'Only Girl (In the World)', artist: 'Rihanna', audioSrc: 'musica/Rihanna - Only Girl (In The World) (Audio) [-ySWIyJj3I0].mp3' },
//             { title: 'Nobody’s Bussines', artist: 'Rihanna, Chris Brown', audioSrc: 'musica/Rihanna - Nobody\'s Business ft. Chris Brown LYRICS [mYftJLL4Yfo].mp3' },

// //Marina Sena
//             { title: 'Pra ficar comigo', artist: 'Marina Sena', audioSrc: 'musica/utomp3.com - Marina Sena  Pra Ficar Comigo Visualizer.mp3' },
//             { title: 'Que tal', artist: 'Marina Sena', audioSrc: 'musica/utomp3.com - Marina Sena  Que Tal feat Fleezus Visualizer.mp3' },
//             { title: 'Desmitificar', artist: 'Marina Sena', audioSrc: 'musica/Marina sena - desmitificar _ Lyrics _ [WdlIm6e9uoQ].mp3' },

// //Tame impala
//             { title: 'Borderline', artist: 'Tame Impala', audioSrc: 'musica/utomp3.com - Tame Impala  Borderline Official Audio.mp3' },

// //Jennie
//             { title: 'Start a War', artist: 'JENNIE', audioSrc: 'musica/JENNIE - start a war (Official Lyric Video) [n-KlygYrXV8].mp3' },
//             { title: 'Zen', artist: 'JENNIE', audioSrc: 'musica/JENNIE - ZEN (Official Lyric Video) [Q_pdWJMZx30].mp3' },
//             { title: 'Extral', artist: 'JENNIE, Doechii', audioSrc: 'musica/JENNIE, Doechii - ExtraL (Official Lyric Video) [oFDBWsnWt3c].mp3' },
//             { title: 'One Of The Girls', artist: 'The Weeknd, JENNIE', audioSrc: 'musica/The Weeknd, JENNIE & Lily Rose Depp - One Of The Girls (Official Audio) [f1r0XZLNlGQ].mp3' },
//             { title: 'Mantra', artist: 'JENNIE', audioSrc: 'musica/JENNIE - Mantra (Official Lyric Video) [L-xH8AZhh4w].mp3' },
//             { title: 'Like JENNIE', artist: 'JENNIE', audioSrc: 'musica/JENNIE - like JENNIE (Official Lyric Video) [aS7al94FVbk].mp3' },
//             { title: 'Seoul City', artist: 'JENNIE', audioSrc: 'musica/JENNIE - Seoul City (Official Lyric Video) [nJw2_S2fPj8].mp3' },
//             { title: 'Damn Right', artist: 'JENNIE, Kali Uchis, Childish Gambino', audioSrc: 'musica/JENNIE, Childish Gambino, Kali Uchis - Damn Right (Official Lyric Video) [PICpEtPHyZI].mp3' },

// //Tyler 
//             { title: 'Like Him', artist: 'Tyler, The Creator', audioSrc: 'musica/Like Him [dgUHE8wWhiE].mp3' },
//             { title: 'After The Storm', artist: 'Kali Uchis, Tyler, The Creator,', audioSrc: 'musica/Kali Uchis - After The Storm ft. Tyler, The Creator, Bootsy Collins [9f5zD7ZSNpQ].mp3' },
//             { title: 'See You Again', artist: 'Tyler, The Creator, Kali Uchis', audioSrc: 'musica/SEE YOU AGAIN featuring Kali Uchis [TGgcC5xg9YI].mp3' },
//             { title: 'Earfquake', artist: 'Tyler, The Creator', audioSrc: 'musica/Tyler, The Creator - Earfquake [Aztdmq1tYY8].mp3' },

// //The Weeknd
//             { title: 'Popular', artist: 'The Weeknd, Madonna', audioSrc: 'musica/utomp3.com - The Weeknd Playboi Carti Madonna  Popular Official Audio.mp3' },
//             { title: 'São Paulo', artist: 'The Weeknd, Anitta', audioSrc: 'musica/São Paulo [p8_ugAjWI5I].mp3' },
//             { title: 'The Abyss', artist: 'The Weeknd, Lana Del Rey', audioSrc: 'musica/The Weeknd, Lana Del Rey - The Abyss (Audio) [S3ncfrQPpjs].mp3' },
//             { title: 'In Your Eyes', artist: 'The Weeknd, Doja Cat', audioSrc: 'musica/The Weeknd - In Your Eyes Remix feat. Doja Cat (Audio) [ozMBCFd7fFM].mp3' },

// //Madonna
//             { title: 'Vogue', artist: 'Madonna', audioSrc: 'musica/Vogue - Madonna (Lyrics) [tYHr4Ffk2PM].mp3' },
//             { title: 'La Isla Bonita', artist: 'Madonna', audioSrc: 'musica/La Isla Bonita [gq9RlmsiTwQ].mp3' },
//             { title: 'Like a Prayer', artist: 'Madonna', audioSrc: 'musica/Like a Prayer [UadtlXKk1ek].mp3' },
//             { title: 'Bad Girl', artist: 'Madonna', audioSrc: 'musica/Madonna - Bad Girl + Lyrics [GkbCF-zyFG0].mp3' },

// //Ethel Cain
//             { title: 'Strangers', artist: 'Ethel Cain', audioSrc: 'musica/Strangers - Ethel Cain (Lyrics) [AIH2qd4rl90].mp3' },
//             { title: 'House in Nebraska', artist: 'Ethel Cain', audioSrc: 'musica/YouTube [cT7T5Sz9Lww].mp3' },
//             { title: 'Nettles', artist: 'Ethel Cain', audioSrc: 'musica/Ethel Cain - Nettles (Official Visualizer) [sP0us82q1ck].mp3' },
//             { title: 'Fuck My Eyes', artist: 'Ethel Cain', audioSrc: 'musica/Ethel Cain - Fuck Me Eyes (Official Visualizer) [H4h1rsPRwOg].mp3' },
//             { title: 'Sun Bleached Filies', artist: 'Ethel Cain', audioSrc: 'musica/Sun Bleached Flies - Ethel Cain (Official Visualizer) [P1ecmtqd7LE].mp3' },

// //FKA
//             { title: 'Oh My Love', artist: 'FKA Twigs', audioSrc: 'musica/FKA twigs - oh my love (audio) [snuVJEFZBns].mp3' },
//             { title: 'Drums of Death', artist: 'FKA Twigs', audioSrc: 'musica/FKA twigs - Drums of Death (choreography glitch) [8PDiORfADeQ].mp3' },
//             { title: 'Perfect Stranger', artist: 'FKA Twigs', audioSrc: 'musica/FKA Twigs - Perfect Stranger _ Lyrics [i5enaEtsa1Y].mp3' },
//             { title: 'Childlike', artist: 'FKA Twigs, North West', audioSrc: 'musica/FKA twigs, North West - Childlike Things [EjchyxshPNw].mp3' },

// //Charli XCX
//             { title: 'Guess REMIX', artist: 'Charli xcx, Billie Elish', audioSrc: 'musica/Charli xcx - Guess featuring billie eilish (official video) [huGd4efgdPA].mp3' },
//             { title: 'Everything is Romantic', artist: 'Charli xcx', audioSrc: 'musica/Charli xcx - Everything is romantic (official lyric video) [FTIvFD7TCVg].mp3' },
//             { title: 'Talk Talk REMIX', artist: 'Charli xcx, Troye Sivan', audioSrc: 'musica/Charli xcx - Talk talk featuring troye sivan (official lyric video) [K5jyIoPbu4M].mp3' },
//             { title: '365 REMIX', artist: 'Charli xcx, Shygirl', audioSrc: 'musica/Charli xcx - 365 featuring shygirl (official audio) [oslpP-s_w4E].mp3' },
//             { title: 'Von Dutch', artist: 'Charli xcx', audioSrc: 'musica/Charli xcx - Von dutch (official lyric video) [RaiRdSlwsks].mp3' },
//             { title: 'Dreamer', artist: 'Charli xcx, Raye', audioSrc: 'musica/Charli XCX - Dreamer feat. Starrah and RAYE [Official Audio] [WqEIiwnJXUI].mp3' },
// //Lady Gaga
//             { title: 'Abracadabra', artist: 'Lady Gaga', audioSrc: 'musica/Lady Gaga - Abracadabra (Official Audio) [LXuSOkf2M3c].mp3' },
//             { title: 'ZombieBoy', artist: 'Lady Gaga', audioSrc: 'musica/Lady Gaga - Zombieboy (Official Audio) [xWS0aRqzP6E].mp3' },
//             { title: 'Sour Candy', artist: 'Lady Gaga, BLACKPINK', audioSrc: 'musica/Lady Gaga, BLACKPINK - Sour Candy (Audio) [fnPn6At3v28].mp3' },
//             { title: 'Judas', artist: 'Lady Gaga', audioSrc: 'musica/Lady Gaga - Judas (Audio) [UaozB9_ufa8].mp3' },
//             { title: 'Telephone', artist: 'Lady Gaga, Beyonce', audioSrc: 'musica/Lady Gaga - Telephone ft. Beyoncé (Audio) [Zwnvgz3ey78].mp3' },
//             { title: 'Scheibe', artist: 'Lady Gaga', audioSrc: 'musica/Lady Gaga - Scheiße (Official Audio) [_sNi9nIXxVo].mp3' },
//             { title: 'Babylon', artist: 'Lady Gaga', audioSrc: 'musica/Lady Gaga - Babylon (Audio) [bOuuMmlf_DE].mp3' },
//             { title: 'Replay', artist: 'Lady Gaga', audioSrc: 'musica/Lady Gaga - Replay (Official Audio) [ZTwpCLZLdRs].mp3' },
//             { title: 'Shadow Of a Men', artist: 'Lady Gaga', audioSrc: 'musica/Lady Gaga - Shadow Of A Man (Official Audio) [LJEED4n1dP4].mp3' },
//             { title: 'Vanish Into You', artist: 'Lady Gaga', audioSrc: 'musica/Lady Gaga - Vanish Into You (Official Audio) [tQHLIRCcfio].mp3' },

// //Miley Cyrus
//             { title: 'Reborn', artist: 'Miley Cyrus', audioSrc: 'musica/Miley Cyrus - Reborn (Official Lyric Video) [id3gaI4gD_8].mp3' },
//             { title: 'Nothing Breaks Like a Heart', artist: 'Miley Cyrus', audioSrc: 'musica/Mark Ronson - Nothing Breaks Like a Heart (Lyrics) Ft. Miley Cyrus [JsjbNtO84JU].mp3' },
//             { title: 'Psycho Killer', artist: 'Miley Cyrus', audioSrc: 'musica/Miley Cyrus - Psycho Killer (Official Visualizer) [_Lq7ov51bnE].mp3' },
//             { title: 'Mother Doughter', artist: 'Miley Cyrus', audioSrc: 'musica/Miley Cyrus - Mother\'s Daughter (Audio) [gVE2la0ENwU].mp3' },
// //Tyla
//             { title: 'Truth or Dare', artist: 'Tyla', audioSrc: 'musica/utomp3.com - Tyla  Truth or Dare Official Lyric Video.mp3' },
//             { title: 'Push 2 Start', artist: 'Tyla', audioSrc: 'musica/Tyla - PUSH 2 START (Official Audio) [TcknaZhnO88].mp3' },
//             { title: 'Shake Ah', artist: 'Tyla', audioSrc: 'musica/Tyla - SHAKE AH (Official Audio) ft. Tony Duardo, Optimist Music ZA, Ez Maestro [dl9r_fgnhNU].mp3' },

// //Doechii
//             { title: 'Anxiety', artist: 'Doechii', audioSrc: 'musica/Doechii - Anxiety (Lyrics) [1EF0VOd3WGA].mp3' },
//             { title: 'Alter Ego', artist: 'Doechii', audioSrc: 'musica/Doechii & JT - Alter Ego (Audio) [x-4uwdtB6eY].mp3' },
//             { title: 'Boiled Peanuts', artist: 'Doechii', audioSrc: 'musica/Doechii - BOILED PEANUTS (Audio) [YzizrbBFTak].mp3' },

// //Sevdaliza
//             { title: 'Messiah', artist: 'Sevdaliza', audioSrc: 'musica/SEVDALIZA - MESSIAH (OFFICIAL MUSIC VIDEO) [e8EwHTqeQKU].mp3' },
//             { title: 'High Alone', artist: 'Sevdaliza', audioSrc: 'musica/SEVDALIZA - HIGH ALONE [qSmGNqkzC5M].mp3' },
//             { title: 'Hubris', artist: 'Sevdaliza', audioSrc: 'musica/SEVDALIZA - HUBRIS [aYXZoxltYuU].mp3' },
//             { title: 'Bluecid', artist: 'Sevdaliza', audioSrc: 'musica/SEVDALIZA - Bluecid (legendado_tradução) [NB7U_XUIgLI].mp3' },
//             { title: 'Alibi', artist: 'Sevdaliza, Pabllo Vittar, Yseult', audioSrc: 'musica/SEVDALIZA - ALIBI FT. PABLLO VITTAR & YSEULT (OFFICIAL MUSIC VIDEO) [qVqFuokjRMc].mp3' },
//             { title: 'Ride Or Die', artist: 'Sevdaliza, Tokischa, Villano', audioSrc: 'musica/Sevdaliza - Ride Or Die Pt. 2 Ft. Tokischa & Villano Antillano (Letra_Lyrics) [qq_aCp70jb0].mp3' },

// //Urias
//             { title: 'Foi Mal', artist: 'Urias', audioSrc: 'musica/Urias - Foi Mal (letra) [IzTKOaDHJZs].mp3' },
//             { title: 'Neo Thang', artist: 'Urias', audioSrc: 'musica/URIAS - NEO THANG (OFFICIAL MUSIC VIDEO) [HLcBgVljOM8].mp3' },
//             { title: 'Cuntelectual', artist: 'Urias', audioSrc: 'musica/URIAS - CUNTELECTUAL ( OFFICIAL VIDEODANCE) [WAfg7ggM-lU].mp3' },
  
//         ];


//          function playSound(soundId) {
//             const sound = document.getElementById(soundId);
//             sound.currentTime = 0;
//             sound.play().catch(e => console.log("Não foi possível tocar o som:", e));
//         }

//         // Atualização da barra de progresso
// function updateProgress(e) {
//     const { duration, currentTime } = e.srcElement;
//     const progressPercent = (currentTime / duration) * 100;
//     document.getElementById('progressBar').style.width = `${progressPercent}%`;
    
//     // Atualiza o tempo atual
//     document.getElementById('currentTime').textContent = formatTime(currentTime);
// }

// // Formata o tempo (segundos para MM:SS)
// function formatTime(seconds) {
//     const minutes = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
// }

// // Configura o tempo total quando a música pode ser tocada
// function setTotalTime() {
//     const duration = audioPlayer.duration;
//     document.getElementById('duration').textContent = formatTime(duration);
// }

// // Pula para o ponto clicado na barra de progresso
// function setProgress(e) {
//     const width = this.clientWidth;
//     const clickX = e.offsetX;
//     const duration = audioPlayer.duration;
//     audioPlayer.currentTime = (clickX / width) * duration;
// }

// // Adicione estes event listeners no seu código existente:
// audioPlayer.addEventListener('timeupdate', updateProgress);
// audioPlayer.addEventListener('canplay', setTotalTime);
// audioPlayer.addEventListener('ended', () => {
//     document.getElementById('progressBar').style.width = '0%';
//     document.getElementById('currentTime').textContent = '0:00';
// });

// document.querySelector('.progress-container').addEventListener('click', setProgress);

//         // Função para verificar se uma música está favoritada
//         function isMusicaFavorita(title, artist) {
//             const favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
//             return favoriteMusics.some(music => music.title === title && music.artist === artist);
//         }

//         // Função para adicionar música aos favoritos
//         function addMusicaFavorita(title, artist) {
//     const favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
    
//     // Verifica se já não está na playlist
//     if (!favoriteMusics.some(music => music.title === title && music.artist === artist)) {
//         favoriteMusics.push({ title, artist });
//         localStorage.setItem('favoriteMusics', JSON.stringify(favoriteMusics));
//     }
// }

// function removeFromPlaylist(event, title, artist) {
//     event.stopPropagation();
//     removeMusicaFavorita(title, artist);
//     playSound('star-off-sound');
//     atualizarPlaylist();
// }

//         // Função para remover música dos favoritos
//         function removeMusicaFavorita(title, artist) {
//             let favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
//             favoriteMusics = favoriteMusics.filter(music => !(music.title === title && music.artist === artist));
//             localStorage.setItem('favoriteMusics', JSON.stringify(favoriteMusics));
//             atualizarPlaylist();
//         }

//         // Função para tocar música diretamente da playlist
// function playFromPlaylist(title, artist) {
//     playSound('click-sound');
    
//     // Encontra a música na lista completa
//     const music = allResults.find(result => 
//         result.title === title && result.artist === artist
//     );
    
//     if (music) {
//         playMusic(music.audioSrc, music.title, music.artist);
//         atualizarPlaylist(); // Atualiza para destacar a música atual
//     }
// }

// // Função para remover música da playlist
// function removeFromPlaylist(event, title, artist) {
//     event.stopPropagation(); // Impede que o clique no botão dispare o play
//     playSound('star-off-sound');
//     removeMusicaFavorita(title, artist);
// }

// // Atualize a função playMusic para destacar na playlist
// // Função para tocar música
// function playMusic(audioSrc, title, artist) {
//     currentAudioSrc = audioSrc;

//     if (audioPlayer.src !== audioSrc) {
//         audioPlayer.src = audioSrc;
//         document.getElementById('currentTime').textContent = '0:00';
//         document.getElementById('progressBar').style.width = '0%';
//     }

//     audioPlayer.play();
//     isPlaying = true;
//     playPauseIcon.classList.remove('fa-play');
//     playPauseIcon.classList.add('fa-pause');

//     // Faz o CD girar
//     document.querySelector('.cdrom')?.classList.add('girar');

//     // Remove o título anterior se existir
//     const previousTitle = document.querySelector('.now-playing');
//     if (previousTitle) previousTitle.remove();

//     // Mostra a música atual no player
//     document.querySelector('.music-player').insertAdjacentHTML('afterbegin', 
//         `<div class="now-playing">${title} - ${artist}</div>`);

//     atualizarPlaylist();
// }



//         // Função para favoritar/desfavoritar música
//         function favoritarMusica(starElement, event) {
//     event.stopPropagation(); // Impede que o clique ative o play da música
    
//     const resultDiv = starElement.closest('.result');
//     const title = resultDiv.querySelector('h3').textContent;
//     const artist = resultDiv.querySelector('p').textContent;
//     const starIcon = starElement.querySelector('i');
    
//     playSound('click-sound');
    
//     if (starIcon.classList.contains('fas')) { // Se já estiver favoritado
//         removeMusicaFavorita(title, artist);
//         starIcon.classList.replace('fas', 'far');
//         starIcon.style.color = '#ccc'; // Volta para cinza
//         playSound('star-off-sound');
//     } else { // Se não estiver favoritado
//         addMusicaFavorita(title, artist);
//         starIcon.classList.replace('far', 'fas');
//         starIcon.style.color = 'gold'; // Muda para dourado
//         playSound('star-on-sound');
        
//         // Efeito visual
//         starIcon.style.transform = 'rotate(360deg) scale(1.5)';
//         setTimeout(() => {
//             starIcon.style.transform = 'rotate(0) scale(1)';
//         }, 300);
//     }
    
//     // Atualiza a playlist imediatamente
//     atualizarPlaylist();
// }
//         // Função para atualizar a playlist
        
// function atualizarPlaylist() {
//     const playlistContainer = document.getElementById('playlist');
//     const favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
    
//     playlistContainer.innerHTML = '';
    
//     if (favoriteMusics.length === 0) {
//         playlistContainer.innerHTML = '<li style="text-align:center;cursor:default">Sua playlist está vazia</li>';
//         playlistContainer.classList.remove('has-scroll');
//         return;
//     }
    
//     favoriteMusics.forEach((music, index) => {
//         const listItem = document.createElement('li');
//         listItem.innerHTML = `
//             <span>${index + 1}. ${music.title} - ${music.artist}</span>
//             <button class="delete-button" onclick="removeFromPlaylist(event, '${music.title.replace("'", "\\'")}', '${music.artist.replace("'", "\\'")}')">
//                 <i class="fas fa-times"></i>
//             </button>
//         `;
//         listItem.addEventListener('click', () => {
//             playFromPlaylist(music.title, music.artist);
//         });
//         playlistContainer.appendChild(listItem);
//     });

//     // Ativa a rolagem apenas se tiver 9 ou mais músicas
//     if (favoriteMusics.length >= 9) {
//         playlistContainer.classList.add('has-scroll');
//     } else {
//         playlistContainer.classList.remove('has-scroll');
//     }
// }
//         // Função para carregar músicas favoritas
//         function loadFavoriteMusics() {
//             atualizarPlaylist();
//         }

//         // Função para buscar músicas
//        function search() {
//     const searchInput = document.getElementById('searchInput').value.toLowerCase();
//     const resultsContainer = document.getElementById('results');
    
//     // Limpa resultados anteriores
//     resultsContainer.innerHTML = '';
    
//     if (searchInput.trim() === '') {
//         return; // Não faz nada se a pesquisa estiver vazia
//     }
    
//     const filteredResults = allResults.filter(result => {
//         return result.title.toLowerCase().includes(searchInput) || 
//                result.artist.toLowerCase().includes(searchInput);
//     });
    
//     if (filteredResults.length > 0) {
//         filteredResults.forEach(result => {
//             const resultDiv = document.createElement('div');
//             resultDiv.classList.add('result');
            
//             const isFavorited = isMusicaFavorita(result.title, result.artist);
            
//            // Dentro da função search(), atualize o resultDiv.innerHTML para:
// resultDiv.innerHTML = `
//     <button class="favorite-star" onclick="favoritarMusica(this, event)">
//         <i class="${isFavorited ? 'fas' : 'far'} fa-star"></i>
//     </button>
//     <div class="result-content">
//         <h3>${result.title}</h3>
//         <p>${result.artist}</p>
//     </div>
// `;
            
//             resultDiv.addEventListener('click', (e) => {
//     // Só reproduz se não clicou na estrela
//     if (!e.target.closest('.favorite-star')) {
//         playMusic(result.audioSrc, result.title, result.artist);
//     }
// });
            
//             resultsContainer.appendChild(resultDiv);
//         });
//     } else {
//         resultsContainer.innerHTML = '<p style="text-align:center;width:100%">Nenhuma música encontrada</p>';
//     }
    
//     // Rolagem suave para os resultados
//     setTimeout(() => {
//         resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }, 100);
// }
//         // Função para tocar música
    

//         // Função para alternar play/pause
// function togglePlayPause() {
//     playSound('click-sound');

// if (isPlaying) {
//     audioPlayer.pause();
//     isPlaying = false;
//     playPauseIcon.classList.remove('fa-pause');
//     playPauseIcon.classList.add('fa-play');

//     document.querySelector('.cdrom')?.classList.remove('girar');

//     } else {
//         if (!currentAudioSrc) {
//             const firstResult = document.querySelector('.result');
//             if (firstResult) {
//                 firstResult.click();
//                     document.querySelector('.cdrom')?.classList.add('girar');

//             }
//         } else {
//             audioPlayer.play();
//             isPlaying = true;
//             playPauseIcon.classList.remove('fa-play');
//             playPauseIcon.classList.add('fa-pause');
//             document.querySelector('.cdrom')?.classList.add('girar');

//         }
//     }
// }

//         // Funções para o painel lateral
//      function abrirPainel() {
//     playSound('panel-open-sound');
    
//     // Abre o catálogo diretamente sem pausar a música
//     document.getElementById('painelInformacoes').classList.add('active');
//     document.getElementById('overlay').style.display = 'block';
//     document.getElementById('painelToggle').classList.add('hidden');
// }

// function fecharPainel() {
//     const painel = document.getElementById('painelInformacoes');
//     painel.classList.remove('active');
//     void painel.offsetWidth; // Força repaint (opcional)
//     document.getElementById('overlay').style.display = 'none';
//     document.getElementById('painelToggle').classList.remove('hidden');
// }
//     function mostrarOcultarPlaylist() {
//     const playlistContainer = document.getElementById('playlistContainer');
//     const overlay = document.getElementById('playlistOverlay');
    
//     if (playlistContainer.classList.contains('active')) {
//         playlistContainer.classList.remove('active');
//         overlay.style.display = 'none';
//     } else {
//         playlistContainer.classList.add('active');
//         overlay.style.display = 'block';
//         atualizarPlaylist();
//     }
//     playSound('click-sound');
// }

// document.getElementById('playlistOverlay').addEventListener('click', mostrarOcultarPlaylist);

//         function fecharMensagem() {
//             document.getElementById('custom-alert').style.display = 'none';
//         }

//         // Evento para quando a música terminar
//     audioPlayer.addEventListener('ended', function() {
//     isPlaying = false;
//     playPauseIcon.classList.remove('fa-pause');
//     document.querySelector('.cdrom')?.classList.remove('girar');

//     playPauseIcon.classList.add('fa-play');
//     document.getElementById('progressBar').style.width = '0%';
//     document.getElementById('currentTime').textContent = '0:00';
    
//     // Remove o destaque da playlist
//     const playingItems = document.querySelectorAll('.playlist-container li.playing');
//     playingItems.forEach(item => item.classList.remove('playing'));
// });


