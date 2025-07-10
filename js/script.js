 const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let analyser, dataArray;
        const audioPlayer = document.getElementById('audioPlayer');
        const playPauseIcon = document.getElementById('playPauseIcon');
        let isPlaying = false;
        let currentAudioSrc = '';
        let cdRotationAngle = 0; // Armazena o ângulo atual de rotação do CD
        let cdRotationInterval; // Armazenará o intervalo de animação do CD



        // Substitua a lista allResults por esta estrutura organizada por álbuns
const musicDatabase = {
    "Gorillaz": {
        "Humanz": {
            cover: "https://tse4.mm.bing.net/th/id/OIP.syNSBXTy_qaCDfUciLO_iAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "Andromeda", audioSrc: "musica/Gorillaz - Andromeda (Official Audio) [9W44NWYwa1g].mp3" },
                { title: "She's My Collar", audioSrc: "musica/utomp3.com - Gorillaz  Shes My Collar HQ.mp3", featuredArtist: "Kali Uchis" }
            ]
        },
        "Demon Days": {
            cover: "https://i.ytimg.com/vi/LTJjQj6PkrY/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGHIgRShcMA8=&rs=AOn4CLC1-s6Y2ymRKf8km8yckMmZw8hiLg",
            songs: [
                { title: "Feel Good Inc.", audioSrc: "musica/Gorillaz - Feel Good Inc (Lyrics) [IbpOfzrNjTY].mp3" },
                { title: "DARE", audioSrc: "musica/DARE [rIq6i4-8Nww].mp3", featuredArtist: "Shaun Ryder" }
            ]
        }
    },
   "LISA": {
        "Alter Ego": {
            cover: "https://t2.genius.com/unsafe/300x300/https://images.genius.com/c58391f9537fdac8d91700c7b969ce9d.1000x1000x1.png",
            songs: [
                { title: "Chill", audioSrc: "musica/LISA - Chill (Lyric Video) [pZh-Q8wfwU8].mp3" },
                { title: "Born Again", audioSrc: "musica/LISA - Born Again feat. Doja Cat & RAYE (Lyric Video) [zcmCAo_kHmU].mp3", featuredArtist: "Raye, Doja Cat" },
                { title: "New Woman", audioSrc: "musica/LISA - New Woman feat ROSALÍA (Lyric Video) [qwwQlJW10uc].mp3", featuredArtist: "Rosália" },
                { title: "Thunder", audioSrc: "musica/LISA - Thunder (Lyric Video) [dzqmRAec9rs].mp3" },
                { title: "Lifestyle", audioSrc: "musica/LISA - Lifestyle (Lyric Video) [XxO_6yTIi0g].mp3" },
                { title: "When Im With You", audioSrc: "musica/LISA - When I'm With You feat. Tyla (Lyric Video) [G3cjeH4iHwc].mp3", featuredArtist: "Tyla" },
                { title: "Rockstar", audioSrc: "musica/Rockstar (Extended) [wJX65suPsVs].mp3" },
                { title: "Elastigirl", audioSrc: "musica/LISA - Elastigirl (Lyric Video) [eEbrI8O-iBs].mp3" }
            ]
        }
    },
    "Doja Cat": {
        "Planet Her": {
            cover: "https://m.media-amazon.com/images/I/81YJQEQPmJL._AC_SL1500_.jpg",
            songs: [
                { title: "Options", audioSrc: "musica/ytmp3free.cc_doja-cat-options-visualizer-ft-jid-youtubemp3free.org.mp3" },
                { title: "Kiss Me More", audioSrc: "musica/Doja Cat - Kiss Me More (Lyrics) ft. SZA [Ab6E2BsuLJ0].mp3", featuredArtist: "SZA" }
            ]
        },
        "Scarlet": {
            cover: "https://www.newsic.it/wp-content/uploads/2023/09/Artwork-DojaCat-Scarlet-album-2023.jpg",
            songs: [
                { title: "Demons", audioSrc: "musica/utomp3.com - Doja Cat  Demons Official Video.mp3" }
            ]
        },
        "Amala": {
            cover: "https://akamai.sscdn.co/uploadfile/letras/albuns/7/2/3/4/966811683720662.jpg",
            songs: [
                { title: "Casual", audioSrc: "musica/Doja Cat - Casual (Official Audio) [dvK4Apd5m3M].mp3" },
                { title: "Candy", audioSrc: "musica/utomp3.com - Doja Cat  Candy Audio.mp3" }
            ]
        }
    },
    "Summer Walker": {
        "Still Over It": {
            cover: "https://thatgrapejuice.net/wp-content/uploads/2021/10/summer-walker-still-over-it-cover-tgj.jpeg",
            songs: [
                { title: "Insane", audioSrc: "musica/utomp3.com - Summer Walker  Insane Lyric Video.mp3" }
            ]
        }
    },
    "Don Toliver": {
        "Love Sick": {
            cover: "https://images.genius.com/4420e25608877cc3368f04592720352d.999x999x1.png",
            songs: [
                { title: "No Pole", audioSrc: "musica/Don Toliver - No Pole [Official Visualizer] [fCeiUX59_FM].mp3" }
            ]
        },
        "Life of a Don": {
            cover: "https://www.nme.com/wp-content/uploads/2021/10/don-toliver-life-of-a-don.jpg",
            songs: [
                { title: "Drugs N Hella Melodies", audioSrc: "musica/Drugs N Hella Melodies (feat. Kali Uchis) [R6kkB98AZ28].mp3", featuredArtist: "Kali Uchis" }
            ]
        },
         "_singles": {
  "songs": [
    {
      "title": "Lose My Mind",
           audioSrc: "musica/Lose My Mind (feat. Doja Cat) [jQJWsL6Gscc].mp3",
           featuredArtist: "Doja Cat",


      "isSingle": true,
      "cover": "https://ohiodigitalnews.com/wp-content/uploads/2025/05/DON-TOLIVER-x-DOJA-CAT-IMAGE-CREDIT_-JACOB-WEBSTER-1.jpg"
    },

  ]
}
    },
    "Lana Del Rey": {
        "Ultraviolence": {
            cover: "https://64.media.tumblr.com/0b1f3c1bb39df42c2f28fdfa4a0dbaea/tumblr_n6a3hnNP4q1ty5b1do1_1280.jpg",
            songs: [
                { title: "The Other Woman", audioSrc: "musica/The Other Woman [7KzPh_x5w14].mp3" },
                { title: "Brooklyn Baby", audioSrc: "musica/Lana Del Rey - Brooklyn Baby (Official Audio) [T5xcnjAG8pE].mp3" }
            ]
        },
        "Born To Die": {
            cover: "https://images.thalia.media/07/-/70d26a9ccb3f48539e22a3ba605cc829/born-to-die-paradise-8-tracks-vinyl-lana-del-rey.jpeg",
            songs: [
                { title: "Born to Die", audioSrc: "musica/Lana Del Rey - Born To Die (Lyrics) [uN46mvvLauQ].mp3" },
                { title: "Diet Mountain Dew", audioSrc: "musica/Diet Mountain Dew [sEetXo3R-aM].mp3" }
            ]
        },
        "Honeymoon": {
            cover: "https://akamai.sscdn.co/uploadfile/letras/albuns/6/3/7/1/454921440178558.jpg",
            songs: [
                { title: "Art Deco", audioSrc: "musica/Art Deco [QbLGjeR9bvI].mp3" },
                { title: "Music To Watch Boys To", audioSrc: "musica/Lana Del Rey - Music To Watch Boys To [Lyric Video] [tqDxkPGRFK8].mp3" }
            ]
        },
        "Did You Know That There's a Tunnel Under Ocean Blvd": {
            cover: "https://tse1.mm.bing.net/th/id/OIP.RTkyzWnNL7RT1vHDeTI8nAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "Peppers", audioSrc: "musica/Lana Del Rey - Peppers (Audio) ft. Tommy Genesis [hNFoCOKk7LE].mp3" },
                
            ]
        },

    "_singles": {
  "songs": [
    {
      "title": "Once Upon a Dream",
            "audioSrc": "musica/Lana Del Rey - Once Upon a Dream [Tradução_Legendado] _ Malévola [ZnRBqBqp5aM].mp3",

      "isSingle": true,
      "cover": "https://tse4.mm.bing.net/th/id/OIP.haZhuFzidBZMNKt02iyrEQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    {
      "title": "Tough",
            "audioSrc": "musica/Quavo, Lana Del Rey - Tough (Visualizer) [R2hgq8j6ETY].mp3",
      "isSingle": true,
      "featuredArtist": "Quavo",
      "cover": "https://images.genius.com/a0f0a4c40c6bb899efad6cb813fdb2ac.1000x1000x1.png"
    }
  ]
}

    },


"The Weeknd": {
    "Hung Up Tomorrow": {
        cover: "https://the-flow.ru/uploads/images/origin/04/41/43/22/48/f3ccdd2.jpg",
        songs: [
            { title: "São Paulo", audioSrc: "musica/São Paulo [p8_ugAjWI5I].mp3", featuredArtist: "Anitta" },
            { title: "The Abyss", audioSrc: "musica/The Weeknd, Lana Del Rey - The Abyss (Audio) [S3ncfrQPpjs].mp3", featuredArtist: "Lana Del Rey" }
        ]
    },
    "After Hours": {
        cover: "https://tse1.mm.bing.net/th/id/OIP.QB7V6O6UzMFAt0fpNZmxNwHaHa?w=1200&h=1200&rs=1&pid=ImgDetMain&o=7&rm=3",
        songs: [
            { title: "In Your Eyes", audioSrc: "musica/The Weeknd - In Your Eyes Remix feat. Doja Cat (Audio) [ozMBCFd7fFM].mp3", featuredArtist: "Doja Cat" }
        ]
    },
    "Starboy": {
        cover: "https://fontsherlock.com/wp-content/uploads/2021/12/starboy-album-font-770x770.jpg",
        songs: [
            { title: "Stargirl", audioSrc: "./musica/The Weeknd - Stargirl Interlude (ft. Lana Del Rey) - Real Extended Version [i4SrBtyY3_o].mp3", featuredArtist: "Lana Del Rey" },
            { title: "One of the Girls", audioSrc: "musica/The Weeknd, JENNIE & Lily Rose Depp - One Of The Girls (Official Audio) [f1r0XZLNlGQ].mp3", featuredArtist: "JENNIE" }
        ]
    },
    "The Idol From HBO": {
        cover: "https://tse1.mm.bing.net/th/id/OIP.Y98WD-pZCNz-iPDcm71X8AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
        songs: [
            { title: "Popular", audioSrc: "musica/utomp3.com - The Weeknd Playboi Carti Madonna  Popular Official Audio.mp3",featuredArtist: "Madonna, Playboi Carti",
 },
            { title: "One of the Girls", audioSrc: "musica/The Weeknd, JENNIE & Lily Rose Depp - One Of The Girls (Official Audio) [f1r0XZLNlGQ].mp3", featuredArtist: "JENNIE, Lily Rose Depp" }
        ]
    },
   
},
        "Pink Pantheress": {
        "To Hell With It": {
            cover: "https://tse2.mm.bing.net/th/id/OIP.Pls04CghkIozcNSNLB74YgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "Pain", audioSrc: "musica/Pink Pantheress - Pain (Official Visualiser) [REzdbqfiN9o].mp3" },
                { title: "I Must Apologise", audioSrc: "musica/PinkPantheress - I must apologise (Lyrics) [uU2wa9BbLSk].mp3" }
            ]
        },
        "Heaven knows": {
            cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/05/59/17/0559179a-9f72-3384-2bc0-ebfee2c5c9e3/5054197835070.jpg/1200x1200bf-60.jpg",
            songs: [
                { title: "Nice to Meet You", audioSrc: "musica/PinkPantheress - Nice to meet you (Solo Version) [KK1jj57qdBA].mp3" }
            ]
        },
        "Fancy That": {
            cover: "https://tse4.mm.bing.net/th/id/OIP.5UH0jQV6_g2aKAGIW-m7XAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", // Substitua por URL real
            songs: [
                { title: "Tonight", audioSrc: "musica/PinkPantheress - Tonight (Lyrics) [EMelE2kw07k].mp3" },
                { title: "Illegal", audioSrc: "musica/PinkPantheress - Illegal (Official Lyric Video) [KcV3RByF7tQ].mp3" },
                { title: "Stateside", audioSrc: "musica/PinkPantheress - Stateside (Lyrics) [IcjR5nxJYlw].mp3" }
            ]
        }
    },

    "SZA": {
        "SOS LANA": {
            cover: "https://variety.com/wp-content/uploads/2024/12/albumcovertreatment-10-1.jpg?w=1000&h=562&crop=1",
            songs: [
                { title: "BMF", audioSrc: "musica/SZA - BMF (Official Audio) [hWjwNgiLMgA].mp3" },
                { title: "Kill Bill", audioSrc: "musica/SZA - Kill Bill (Official Audio) [SQnc1QibapQ].mp3" },
                { title: "Shirt", audioSrc: "musica/SZA - Shirt (Audio) [p9rllutpWq4].mp3" },
                { title: "Used", audioSrc: "musica/SZA - Used (Audio) ft. Don Toliver [Yd0IYrgrss4].mp3", featuredArtist: "Don Toliver" },
                { title: "Saturn", audioSrc: "musica/SZA - Saturn [V2G8ESoDXm8].mp3" },
                { title: "Kitchen", audioSrc: "musica/SZA - Kitchen (Official Audio) [2kabEeizyaw].mp3" },
               
            ]
        }
    },

    "RAYE": {
        "My 21st Century Blues": {
            cover: "https://ci3.googleusercontent.com/proxy/Bd2Wf-wRiB4M1J5-GXOSeg1BZP8DpPahvdlufPT6BAilUV1HtwtENnpDVwxqNkSo0D2BcgYfZ32--eEFkZtV9RgCtBRMml7uwnwvm1FrdFJ8JlQDBJNB7G9bU9ir5Dasxqphxczj5309RFzPVOgr3Ae5=s0-d-e1-ft#https://files.constantcontact.com/722dd1fd001/f678838f-9d37-4b3b-8f53-baaa05298c87.jpg?rdr=true",
            songs: [
                { title: "Escapism", audioSrc: "musica/utomp3.com - RAYE 070 Shake  Escapism Official Music Video.mp3" },
                { title: "Hard Out Here", audioSrc: "musica/utomp3.com - RAYE  Hard Out Here.mp3" },
                { title: "Escapism REMIX", audioSrc: "musica/utomp3.com - Escapism 4am Remix.mp3" },
                { title: "Flip a Switch", audioSrc: "musica/utomp3.com - RAYE  Flip A Switch ft Coi Leray.mp3", featuredArtist: "Coi Leray" },
                { title: "Genesis", audioSrc: "musica/RAYE - Genesis. [aOX8gyc27K4].mp3" },
 { 
                    title: "Prada", audioSrc: "musica/cassö, RAYE, D-Block Europe - Prada (Lyrics) [ZOYg4VXojCc] (1).mp3", featuredArtist: "D-Block Europe"
                }
                        ]
        },
    
    
    },

    "Beyoncé": {
        "RENAISSANCE": {
            cover: "https://th.bing.com/th/id/R.288f5f8083f685545df7487a9b118250?rik=CX3l5to%2b2VlYQw&pid=ImgRaw&r=0",
            songs: [
                { title: "Alien Superstar", audioSrc: "musica/Beyoncé - ALIEN SUPERSTAR (Legendado) [pm-p4D96ZRU].mp3" },
                { title: "Cozy", audioSrc: "musica/Beyoncé - COZY (Legendado) [A7J52MF6los].mp3" },
                { title: "Virgo's Groove", audioSrc: "musica/Beyoncé - VIRGO'S GROOVE (Lyrics) [MGHFF-qoHAs].mp3" },
                { title: "America Has a Problem", audioSrc: "musica/Beyoncé - AMERICA HAS A PROBLEM (Feat. Kendrick Lamar) (Legendado) [P5EDyALkViM].mp3", featuredArtist: "Kendrick Lamar" },
                { title: "Break My Soul REMIX", audioSrc: "musica/Beyoncé, Madonna - BREAK MY SOUL (THE QUEENS REMIX - Official Visualizer) [7UgIGVDEs_8].mp3", featuredArtist: "Madonna" }
            ]
        },
        "Lemonade": {
            cover: "https://images.genius.com/5fec86ce8713de9eadfe2eee65b25609.1000x1000x1.png",
            songs: [
                { title: "6 Inch", audioSrc: "musica/6 Inch [UKMmfBkrhtY].mp3", featuredArtist: "The Weeknd" },
                { title: "All Night", audioSrc: "musica/Beyoncé - All Night (Lyrics) [7_iLl9YTuL4].mp3" }
            ]
        },
        "Beyoncé": {
            cover: "https://www.billboard.com/wp-content/uploads/2024/03/Beyonce-Beyonce-album-art-billboard-1240.jpg?resize=150",
            songs: [
                { title: "Jealous", audioSrc: "musica/Beyoncé - Jealous (Audio) [Py8Vzm3L3T4].mp3" },
                { title: "Blow", audioSrc: "musica/Blow - Beyoncé [uUEK0jlwPWU].mp3" },
                { title: "Haunted", audioSrc: "musica/utomp3.com - Beyoncé  Haunted Audio.mp3" },
                { title: "Flawless REMIX", audioSrc: "musica/Flawless Remix [qZaLAAcehX4].mp3", featuredArtist: "Nicki Minaj" }
            ]
        },
        "The Lion King: The Gift": {
            cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/aa/20/73/aa207387-444f-b04d-9b7e-7ea6c687c15e/886447863329.jpg/1200x1200bf-60.jpg",
            songs: [
                { title: "Bigger", audioSrc: "musica/Beyoncé - BIGGER (Official Audio) [14di5tJxn7c].mp3" }
            ]
        },
        "Cowboy Carter": {
            cover: "https://media.kagstv.com/assets/KYTX/images/b8016018-d266-4dd6-bf8d-8b26e835e330/b8016018-d266-4dd6-bf8d-8b26e835e330_750x422.jpg", // Substitua por URL real
            songs: [
                { title: "Bodyguard", audioSrc: "musica/utomp3.com - Beyoncé  BODYGUARD Official Lyric Video.mp3" },
                { title: "Sweet Dreams", audioSrc: "musica/Beyoncé - Sweet Dreams [WEE_eSRiZSQ].mp3" }
            ]
        },
        "I AM...SASHA FIERCE": {
            cover: "https://tse4.mm.bing.net/th/id/OIP.aRaJZSi2haAyA7Bk9L3B4gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "Sweet Dreams", audioSrc: "musica/Beyoncé - Sweet Dreams [WEE_eSRiZSQ].mp3" }
            ]
        },
    },

    "BLACKPINK": {
        "THE ALBUM": {
            cover: "https://www.que.es/wp-content/uploads/2020/10/imagen-32.png",
            songs: [
                { title: "How You Like That", audioSrc: "musica/BLACKPINK - How You Like That (Lyrics) [aHnHwrJjR3U].mp3" }
            ]
        },
        "BORN PINK": {
            cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/94/b6/96/94b696c4-63be-8196-cae6-1f81be0a4cbe/22UM1IM01017.rgb.jpg/1200x1200bf-60.jpg",
            songs: [
                { title: "Pink Venom", audioSrc: "musica/BLACKPINK - Pink Venom (Lyrics) [wcEIo-PE9Ho].mp3" },
                { title: "Shut Down", audioSrc: "musica/BLACKPINK Shut Down Lyrics (블랙핑크 Shut Down 가사) (Color Coded Lyrics) [Cix9CdpYS6s].mp3" }
            ]
        },
       
         "_singles": {
  "songs": [
    {
      "title": "Kill this Love",
           audioSrc: "musica/BLACKPINK - Kill This Love (Lyrics) [OkmVcYtCqjw].mp3",

      "isSingle": true,
      "cover": "https://images-cdn.ubuy.co.in/634d182347fe0461f3441c93-blackpink-poster-merchandise-kill-this.jpg"
    },

  ]
}
       
    },

    // ... (continuar com os outros artistas seguindo o mesmo padrão)
    "Kali Uchis": {
        "Red Moon in Venus": {
            cover: "https://tse1.explicit.bing.net/th/id/OIP.ElMviHyNS2VH3HdSz84w3gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "I Wish You Roses", audioSrc: "musica/Kali Uchis - I Wish you Roses (Official Music Video) [-Y7zc0eO26k].mp3" },
                { title: "Moonlight", audioSrc: "musica/Kali Uchis - Moonlight (Official Lyric Video) [8F7Q-4PZCjA].mp3" }, 
                { title: "Moral Conscience", audioSrc: "musica/Kali Uchis - Moral Conscience [Official Audio] [KYT93GC5NIg].mp3" },
                { title: "Hasta Cuando", audioSrc: "musica/Kali Uchis - Hasta Cuando [Official Audio] [YtbObhyCg9k].mp3" },
                { title: "Endlessly", audioSrc: "musica/Kali Uchis - Endlessly [Official Audio] [t_CLW5WTQp4].mp3" },
                { title: "Fantasy", audioSrc: "musica/Kali Uchis, Don Toliver - Fantasy [Official Audio] [KWkx5jTtZ_0].mp3", featuredArtist: "Don Toliver" },
                { title: "Deserve Me", audioSrc: "musica/Kali Uchis, Summer Walker - Deserve Me [Official Audio] [7dq8CvY9a0g].mp3", featuredArtist: "Summer Walker" },

            ]
        },
        "Isolation": {
            cover: "https://tse2.mm.bing.net/th/id/OIP.hn47FzvzNK8vGOLnSX-qyQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "After The Storm", audioSrc: "musica/Kali Uchis - After The Storm ft. Tyler, The Creator, Bootsy Collins [9f5zD7ZSNpQ].mp3", featuredArtist: "Tyler, The Creator" },
                { title: "Dead To Me", audioSrc: "musica/Dead To Me [OcUDK4kAUIw].mp3" },
                { title: "In My Dreams", audioSrc: "musica/In My Dreams [eTMLZ3HlUGE].mp3" },
                { title: "Just a Stranger", audioSrc: "musica/Just A Stranger - Kali Uchis ~ Lyrics [6l69L1HJeQY].mp3" },
                { title: "Feel Like a Fool", audioSrc: "musica/utomp3.com - Feel Like A Fool.mp3" },
            ]
        },
        "Sincerly,": {
            cover: "https://images.genius.com/8642dc3f58c90b87c6d0a908cebaa723.1000x1000x1.png",
            songs: [
                { title: "Si No Es Contigo", audioSrc: "musica/Cris MJ, Kali Uchis, JHAYCO - SI NO ES CONTIGO REMIX [SqAGWRpccm0].mp3" },
                { title: "Fall Apart", audioSrc: "musica/Kali Uchis - Fall Apart, (Audio) [BRLnd0EJ-3Y].mp3" },
                { title: "Heaven is a Home", audioSrc: "musica/Kali Uchis - Heaven Is A Home (Audio) [K2bDlogTEt0].mp3" }
            ]
        },

         "_singles": {
  "songs": [
    {
      "title": "10%",
           audioSrc: "musica/utomp3.com - KAYTRANADA  10 Official Video ft Kali Uchis.mp3",

      "isSingle": true,
      "cover": "https://preview.redd.it/60557luexce81.jpg?width=1200&format=pjpg&auto=webp&s=bc41efe6faa52b5ce220744e050a74a71f45ba53"
    },
    {
      "title": "Si No Es Contigo",
            audioSrc: "musica/Cris MJ, Kali Uchis, JHAYCO - SI NO ES CONTIGO REMIX [SqAGWRpccm0].mp3",
      "isSingle": true,
      "cover": "https://images.genius.com/9115e96119d1644622bbffd5e7e9ed1b.1000x1000x1.png"
    }
  ]
}
       
    },
        // Andrea Valle
    "Andrea Valle": {
        "lovergirl": {
            cover: "https://images.genius.com/eedcccaecec5782ee838c07589313dcf.1000x1000x1.jpg",
            songs: [
                { title: "Lovergirl", audioSrc: "musica/utomp3.com - Andrea Vallé  Lovergirl.mp3" },
                { title: "WIYLL", audioSrc: "musica/utomp3.com - WIYLL.mp3" }
            ]
        }
    },

    // Anitta
    "Anitta": {
        "Versions of Me": {
            cover: "https://fiu-original.b-cdn.net/fontsinuse.com/use-images/N204/204919/204919.jpeg?filename=FTelkMkWQAIcH-K",
            songs: [
                { title: "Ur Baby", audioSrc: "musica/Ur Baby (feat. Khalid) [Official Audio] [2nnWB3w1rKc].mp3", featuredArtist: "Khalid" },
                { title: "Boys Don't Cry", audioSrc: "musica/Anitta – Boys Don’t Cry (Lyrics) [NUysAPuoVVo].mp3" },
                { title: "Maria Elegante", audioSrc: "musica/utomp3.com - Anitta  Maria Elegante Feat Afro B Official Audio.mp3" }
            ]
        },
        "Funk Generation": {
            cover: "https://midias.agazeta.com.br/2024/04/18/anitta-lanca-capa-de-funk-generation-2077509-article.jpg",
            songs: [
                { title: "Sabana", audioSrc: "musica/Anitta - Sabana (Official Audio) [KDeraV6cWZo].mp3" },
                { title: "Downtown", audioSrc: "musica/utomp3.com - Anitta  J Balvin  Downtown Official Music Video.mp3", featuredArtist: "J Balvin" }
            ]
        }
    },

    // Billie Eilish
    "Billie Eilish": {
        "Hit Me Hard and Soft": {
            cover: "https://i.discogs.com/FWlxlSC3lDca4I6iF64QvCJla6__Se-x6pyeopuXVPs/rs:fit/g:sm/q:90/h:539/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMwNzAy/Mzg1LTE3MTYyODg4/MzktOTQ3MS5qcGVn.jpeg",
            songs: [
                { title: "Chihiro", audioSrc: "musica/Billie Eilish - CHIHIRO (Official Lyric Video) [e_AZJzYe7CU].mp3" },
            ]
        },
        "Happier Than Ever": {
            cover: "https://akamai.sscdn.co/tb/letras-blog/wp-content/uploads/2021/11/dfbd850-Happier-Than_ever.-1024x1024.jpg",
            songs: [
                { title: "I Didn't Change My Number", audioSrc: "musica/utomp3.com - Billie Eilish  I Didnt Change My Number Official Lyric Video.mp3" }
            ]
        }
    },

    // Hotel Ugly
    "Hotel Ugly": {

         "_singles": {
  "songs": [
    {
      "title": "Shut Up My Moms Calling",
           audioSrc: "musica/utomp3.com - Hotel Ugly  Shut Up My Moms Calling.mp3",

      "isSingle": true,
      "cover": "https://tse2.mm.bing.net/th/id/OIP.T0GLFdlXActebOsv7ybSyQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
    },
 
  ]
}
    },

    // IZA
    "IZA": {
        "Afrodith": {
            cover: "https://billboard-com-br.s3.amazonaws.com/wp-content/uploads/2024/08/12111915/iza.png",
            songs: [
                { title: "Nunca Mais", audioSrc: "musica/utomp3.com - IZA  Nunca Mais Visualizer.mp3" },
                { title: "Bomzão", audioSrc: "musica/utomp3.com - IZA Tiwa Savage  Bomzão Visualizer.mp3" }
            ]
        }
    },

    // Kendrick Lamar
    "Kendrick Lamar": {
        "good kid, m.A.A.d city": {
            cover: "https://tse4.mm.bing.net/th/id/OIP.fTSsUbAmd7VWVuwgLGZU2AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "The Recipe", audioSrc: "musica/utomp3.com - Kendrick Lamar  The Recipe Lyric Video ft Dr Dre (1).mp3" }
            ]
        },
        "DAMN.": {
            cover: "https://s2-g1.glbimg.com/BDqHASK6RDlvKOyZKbCp25487y8=/1200x/smart/filters:cover():strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2017/N/A/Df8IcBTBmPF3ZbBHQiyw/damn-kendrick-lamar.jpg",
            songs: [
                { title: "Loyalty", audioSrc: "musica/Kendrick Lamar - LOYALTY. ft. Rihanna [i5uwTF5QeuU].mp3", featuredArtist: "Rihanna"}
            ]
        },
        "Black Panther: The Album": {
            cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/0f/7c/f9/0f7cf9a6-651f-53ae-e374-6be14630bfae/18UMGIM00001.rgb.jpg/1200x1200bf-60.jpg",
            songs: [
                { title: "All The Stars", audioSrc: "musica/utomp3.com - Kendrick Lamar SZA  All The Stars.mp3", featuredArtist: "SZA" }
            ]
        },
         "_singles": {
  "songs": [
    {
      "title": "Luther",
            audioSrc: "musica/Kendrick Lamar - luther (Official Audio) [HfWLgELllZs].mp3", featuredArtist: "SZA",
      "isSingle": true,
      "cover": "https://tse4.mm.bing.net/th/id/OIP.qGqNPmdnRS3wFa-g4DGbUAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
    },
  ]
}
    },

    // Rihanna
    "Rihanna": {
        "ANTI": {
            cover: "https://m.media-amazon.com/images/I/61IeCixjIZL._SX466_.jpg",
            songs: [
                { title: "Consideration", audioSrc: "musica/utomp3.com - Consideration.mp3", featuredArtist: "SZA"},
                { title: "Same Ol' Mistakes", audioSrc: "musica/Same Ol' Mistakes [y3OBsTTUsjk].mp3" }
            ]
        },
        "Loud": {
            cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/c6/b1/6c/c6b16cd1-5580-a214-8745-c4f6faa490d6/16UMGIM59220.rgb.jpg/1200x1200bf-60.jpg",
            songs: [
                { title: "Only Girl (In the World)", audioSrc: "musica/Rihanna - Only Girl (In The World) (Audio) [-ySWIyJj3I0].mp3" },
            ]
        },
        "Unapologetic": {
            cover: "https://www.cromosomax.com/pics/2012/11/unapoltracklist.jpg",
            songs: [
                { title: "Nobody's Business", audioSrc: "musica/Rihanna - Nobody's Business ft. Chris Brown LYRICS [mYftJLL4Yfo].mp3", featuredArtist: "Chris Brown" }
            ]
        }
    },

    // Marina Sena
    "Marina Sena": {
        "Vício Inerente": {
            cover: "https://tse4.mm.bing.net/th/id/OIP.syChjQr5dj3sOlHSNEoiBwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "Pra Ficar Comigo", audioSrc: "musica/utomp3.com - Marina Sena  Pra Ficar Comigo Visualizer.mp3" },
                { title: "Que Tal", audioSrc: "musica/utomp3.com - Marina Sena  Que Tal feat Fleezus Visualizer.mp3" }
            ]
        },
        "Coisas Naturais": {
            cover: "https://s2-g1.glbimg.com/HnO-v6XKzZCubmhaHsMFlZEwo74=/0x0:2048x2048/1008x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2025/d/l/sTXvlsTAqXPUUVtzd8Lg/marinasenacapacoisasnaturais.jpg",
            songs: [
                { title: "Desmitificar", audioSrc: "musica/Marina sena - desmitificar _ Lyrics _ [WdlIm6e9uoQ].mp3" }
            ]
        }
    },

    // Tame Impala
    "Tame Impala": {
        "The Slow Rush": {
            cover: "https://heathenchemistryrecords.co.uk/wp-content/uploads/2022/08/R-14761844-1660909716-9965.jpg",
            songs: [
                { title: "Borderline", audioSrc: "musica/utomp3.com - Tame Impala  Borderline Official Audio.mp3" }
            ]
        }
    },

    // JENNIE
    "JENNIE": {
        "Ruby": {
            cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ec/13/67/ec13677e-f7b4-acc2-b59b-ea8533b1a374/196872890983.jpg/1200x1200bf-60.jpg",
            songs: [
                { title: "Start a War", audioSrc: "musica/JENNIE - start a war (Official Lyric Video) [n-KlygYrXV8].mp3" },
                { title: "Zen", audioSrc: "musica/JENNIE - ZEN (Official Lyric Video) [Q_pdWJMZx30].mp3" },
                { title: "Extral", audioSrc: "musica/JENNIE, Doechii - ExtraL (Official Lyric Video) [oFDBWsnWt3c].mp3", featuredArtist: "Doechii" },
                { title: "Like JENNIE", audioSrc: "musica/JENNIE - like JENNIE (Official Lyric Video) [aS7al94FVbk].mp3" },
                { title: "Seoul City", audioSrc: "musica/JENNIE - Seoul City (Official Lyric Video) [nJw2_S2fPj8].mp3" },
                { title: "Damn Right", audioSrc: "musica/JENNIE, Childish Gambino, Kali Uchis - Damn Right (Official Lyric Video) [PICpEtPHyZI].mp3",featuredArtist: "Kali Uchis, Childish Gambino" }
            ]
        }
    },

    // Tyler, The Creator
    "Tyler, The Creator": {
        "Chromakopia": {
            cover: "https://s.yimg.com/ny/api/res/1.2/vKUyv6I9dimwB4XMoGc8ww--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD03OTQ-/https://media.zenfs.com/en/billboard_547/c5bd2bf03d3d288f1418ef754de877e8",
            songs: [
                { title: "Like Him", audioSrc: "musica/Like Him [dgUHE8wWhiE].mp3", featuredArtist: "Lola Young" }
            ]
        },
        "Igor": {
            cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/0c/06/05/0c060581-6242-6a2a-a677-20170f2cf8da/886447710180.jpg/1200x1200bf-60.jpg",
            songs: [
                { title: "Earfquake", audioSrc: "musica/Tyler, The Creator - Earfquake [Aztdmq1tYY8].mp3" }
            ]
        },
        "Flower Boy": {
            cover: "https://external-preview.redd.it/faLJLRjg2WBgPgjM0Gfyrdl5oZDGxx4XMt_8eS8ecTA.png?format=pjpg&auto=webp&s=932cc887e6cb82118f068bacd9808e22bf5c5278",
            songs: [
                { title: "See You Again", audioSrc: "musica/SEE YOU AGAIN featuring Kali Uchis [TGgcC5xg9YI].mp3", featuredArtist: "Kali Uchis" }
            ]
        }
    },

    // Madonna
    "Madonna": {
        "Like a Prayer": {
            cover: "https://tse1.mm.bing.net/th/id/OIP.eeVWIB1McYqIU36MusYZUwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "Like a Prayer", audioSrc: "musica/Like a Prayer [UadtlXKk1ek].mp3" }
            ]
        },
        "Erotica": {
            cover: "https://is1-ssl.mzstatic.com/image/thumb/Music/y2005/m09/d19/h19/mzi.fxbnqimc.jpg/1200x1200bf-60.jpg",
            songs: [
                { title: "Bad Girl", audioSrc: "musica/Madonna - Bad Girl + Lyrics [GkbCF-zyFG0].mp3" }
            ]
        },
        "True Blue": {
            cover: "https://4.bp.blogspot.com/-fUbz_zbRjOM/V3bCFJwf06I/AAAAAAAA3iQ/mtvEKb1vPscAO-fzLrR9bULNYF32uIWHQCLcB/s1600/True%2BBlue%2B-%2B30th%2Ba.jpg",
            songs: [
                { title: "La Isla Bonita", audioSrc: "musica/La Isla Bonita [gq9RlmsiTwQ].mp3" },
            ]
        },
       "_singles": {
  "songs": [
    {
      "title": "Vogue",
           audioSrc: "musica/Vogue - Madonna (Lyrics) [tYHr4Ffk2PM].mp3",

      "isSingle": true,
      "cover": "https://i.pinimg.com/originals/1f/a0/d8/1fa0d89b4186cd0484e3a18f90690c74.jpg"
    },
 
  ]
}
    },

    // Ethel Cain
    "Ethel Cain": {
        "Preacher's Daughter": {
            cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/a7/ed/58/a7ed5868-e006-c8cb-5283-e138ea399701/5056167172390_1.jpg/1200x1200bf-60.jpg",
            songs: [
                { title: "Strangers", audioSrc: "musica/Strangers - Ethel Cain (Lyrics) [AIH2qd4rl90].mp3" },
                { title: "House in Nebraska", audioSrc: "musica/YouTube [cT7T5Sz9Lww].mp3" },
                { title: "Sun Bleached Flies", audioSrc: "musica/Sun Bleached Flies - Ethel Cain (Official Visualizer) [P1ecmtqd7LE].mp3" }
            ]
        },
        "Willoughby Tucker,<br>I'll Always Love You": {
            cover: "https://tse2.mm.bing.net/th/id/OIP.vFZI0WryZyDhFDp8nE1AqwHaE8?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "Fuck My Eyes", audioSrc: "musica/Ethel Cain - Fuck Me Eyes (Official Visualizer) [H4h1rsPRwOg].mp3" },
                { title: "Nettles", audioSrc: "musica/Ethel Cain - Nettles (Official Visualizer) [sP0us82q1ck].mp3" }
            ]
        }
    },

    // FKA Twigs
    "FKA Twigs": {
        "Eusexua": {
            cover: "https://media.pitchfork.com/photos/66e4442b4f5254c605161ff1/master/w_1280%2Cc_limit/FKA-twigs-Eusexua.jpg",
            songs: [
                { title: "Drums of Death", audioSrc: "musica/FKA twigs - Drums of Death (choreography glitch) [8PDiORfADeQ].mp3" },
                { title: "Perfect Stranger", audioSrc: "musica/FKA Twigs - Perfect Stranger _ Lyrics [i5enaEtsa1Y].mp3" },
                { title: "Childlike", audioSrc: "musica/FKA twigs, North West - Childlike Things [EjchyxshPNw].mp3", featuredArtist: "North West" }
            ]
        },
        "Caprisongs": {
            cover: "https://tse1.mm.bing.net/th/id/OIP.FPmfuNqxo7jcNRPFFGGytAHaGt?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "Oh My Love", audioSrc: "musica/FKA twigs - oh my love (audio) [snuVJEFZBns].mp3" }
            ]
        }
    },

    // Charli XCX
    "Charli XCX": {
        "BRAT": {
            cover: "https://tse1.mm.bing.net/th/id/OIP.f8mDM2XAed6gsoyNKRumDAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "Guess Featuring Billie Elish", audioSrc: "musica/Charli xcx - Guess featuring billie eilish (official video) [huGd4efgdPA].mp3",featuredArtist: "Billie Eilish" },
                { title: "Everything is Romantic", audioSrc: "musica/Charli xcx - Everything is romantic (official lyric video) [FTIvFD7TCVg].mp3" },
                { title: "Talk Talk Featuring Troye Sivan", audioSrc: "musica/Charli xcx - Talk talk featuring troye sivan (official lyric video) [K5jyIoPbu4M].mp3" },
                { title: "365 Featuring Shygirl", audioSrc: "musica/Charli xcx - 365 featuring shygirl (official audio) [oslpP-s_w4E].mp3" },
                { title: "Von Dutch", audioSrc: "musica/Charli xcx - Von dutch (official lyric video) [RaiRdSlwsks].mp3" },
                { title: "Dreamer", audioSrc: "musica/Charli XCX - Dreamer feat. Starrah and RAYE [Official Audio] [WqEIiwnJXUI].mp3", featuredArtist: "Raye" }
            ]
        },
        "Number 1 Angel": {
            cover: "https://tse4.mm.bing.net/th/id/OIP.wguDsLME5cmPs8dHU3r0TgAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "Dreamer", audioSrc: "musica/Charli XCX - Dreamer feat. Starrah and RAYE [Official Audio] [WqEIiwnJXUI].mp3", featuredArtist: "Raye" }
            ]
        }
    },

    // Lady Gaga
    "Lady Gaga": {
        "Mayhen": {
            cover: "https://tse2.mm.bing.net/th/id/OIP.lmRxu171kjBCI0O61K7FfQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "Abracadabra", audioSrc: "musica/Lady Gaga - Abracadabra (Official Audio) [LXuSOkf2M3c].mp3" },
                { title: "ZombieBoy", audioSrc: "musica/Lady Gaga - Zombieboy (Official Audio) [xWS0aRqzP6E].mp3" },
                { title: "Vanish Into You", audioSrc: "musica/Lady Gaga - Vanish Into You (Official Audio) [tQHLIRCcfio].mp3" },
                { title: "Shadow Of a Man", audioSrc: "musica/Lady Gaga - Shadow Of A Man (Official Audio) [LJEED4n1dP4].mp3" }
            ]
        },
        "Chromatica": {
            cover: "https://tse4.mm.bing.net/th/id/OIP.U3vX4VkFktNE1NwH3LEoHAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "Replay", audioSrc: "musica/Lady Gaga - Replay (Official Audio) [ZTwpCLZLdRs].mp3" },
                { title: "Babylon", audioSrc: "musica/Lady Gaga - Babylon (Audio) [bOuuMmlf_DE].mp3" },
                { title: "Sour Candy", audioSrc: "musica/Lady Gaga, BLACKPINK - Sour Candy (Audio) [fnPn6At3v28].mp3", featuredArtist: "BLACKPINK" }
            ]
        },
        "Born This Way": {
            cover: "https://tse4.mm.bing.net/th/id/OIP.F1d1x5RYVySnGCjWdkee0AAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "Scheibe", audioSrc: "musica/Lady Gaga - Scheiße (Official Audio) [_sNi9nIXxVo].mp3" },
                { title: "Judas", audioSrc: "musica/Lady Gaga - Judas (Audio) [UaozB9_ufa8].mp3" }
            ]
        },
        "The Fame Monster": {
            cover: "https://tse2.mm.bing.net/th/id/OIP.VZIL-ZVv8jp7BNU75Gw2FgHaHa?w=1240&h=1240&rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "Telephone", audioSrc: "musica/Lady Gaga - Telephone ft. Beyoncé (Audio) [Zwnvgz3ey78].mp3", featuredArtist: "Beyoncé" },
            ]
        }
    },

    // Miley Cyrus
    "Miley Cyrus": {
        "Something Beautiful": {
            cover: "https://upload.wikimedia.org/wikipedia/en/8/83/Miley_Cyrus_%E2%80%93_Something_Beautiful_%28album_cover%29.png",
            songs: [
                { title: "Reborn", audioSrc: "musica/Miley Cyrus - Reborn (Official Lyric Video) [id3gaI4gD_8].mp3" }
            ]
        },
        "Plastic Hearts": {
            cover: "https://tse3.mm.bing.net/th/id/OIP.BiLNakBoxw6hTf4xCq7yrwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
         
               
            ]
        },
         "She Is Coming": {
            cover: "https://tse4.mm.bing.net/th/id/OIP.zHmTrvM3Fn3kXX4kE3FocAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
            songs: [
                { title: "Mother's Daughter", audioSrc: "musica/Miley Cyrus - Mother's Daughter (Audio) [gVE2la0ENwU].mp3" }
            ]
        },

                "_singles": {
  "songs": [
    {
      "title": "Psycho Killer",
           audioSrc: "musica/Miley Cyrus - Psycho Killer (Official Visualizer) [_Lq7ov51bnE].mp3",

      "isSingle": true,
      "cover": "https://tse1.mm.bing.net/th/id/OIP.2I4fZJxyWQaKGPqonqMj8gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    {
      "title": "Nothing Breaks Like a Heart",
            audioSrc: "musica/Mark Ronson - Nothing Breaks Like a Heart (Lyrics) Ft. Miley Cyrus [JsjbNtO84JU].mp3",
      "isSingle": true,
      "cover": "https://th.bing.com/th/id/R.676d3f6f372ae608d444600cdccce874?rik=v70G2g7C9j5jSQ&pid=ImgRaw&r=0"
    }
  ]
}
    },

    // Tyla
    "Tyla": {
        "Tyla": {
            cover: "https://filepicker-images.genius.com/96f9db1fc0ad96e7e52746ff67713e8564a99bf1475ba2278c94ab153233213a/wt46sejwamp",
            songs: [
                { title: "Truth or Dare", audioSrc: "musica/utomp3.com - Tyla  Truth or Dare Official Lyric Video.mp3" },
                { title: "Push 2 Start", audioSrc: "musica/Tyla - PUSH 2 START (Official Audio) [TcknaZhnO88].mp3" },
                { title: "Shake Ah", audioSrc: "musica/Tyla - SHAKE AH (Official Audio) ft. Tony Duardo, Optimist Music ZA, Ez Maestro [dl9r_fgnhNU].mp3" }
            ]
        }
    },

    "Doechii": {
        "Alligator Bites Never Heal": {
            cover: "https://images.genius.com/c61d161e957a9e4691ec8d1069ead6d1.1000x1000x1.png",
            songs: [
                { title: "Anxiety", audioSrc: "musica/Doechii - Anxiety (Lyrics) [1EF0VOd3WGA].mp3" },
                { title: "Alter Ego", audioSrc: "musica/Doechii & JT - Alter Ego (Audio) [x-4uwdtB6eY].mp3", featuredArtist: "JT" },
                { title: "Boiled Peanuts", audioSrc: "musica/Doechii - BOILED PEANUTS (Audio) [YzizrbBFTak].mp3" }
            ]
        }
    },

    "Sevdaliza": {
        "ISON": {
            cover: "https://musicainstantanea.com.br/wp-content/uploads/2017/04/ISON_ALBUM_ARTWORK_web.jpg",
            songs: [
        
                { title: "High Alone", audioSrc: "musica/SEVDALIZA - HIGH ALONE [qSmGNqkzC5M].mp3" },
                { title: "Hubris", audioSrc: "musica/SEVDALIZA - HUBRIS [aYXZoxltYuU].mp3" },
                { title: "Bluecid", audioSrc: "musica/SEVDALIZA - Bluecid (legendado_tradução) [NB7U_XUIgLI].mp3" },
            ]
        },
                "_singles": {
  "songs": [
    {
      "title": "MESSIAH",
           audioSrc: "musica/SEVDALIZA - MESSIAH (OFFICIAL MUSIC VIDEO) [e8EwHTqeQKU].mp3",

      "isSingle": true,
      "cover": "https://tse3.mm.bing.net/th/id/OIP.ODsUi5STORMDOZVXIjoJFAECEC?rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    {
      "title": "Ride Or Die",
            audioSrc: "musica/Sevdaliza - Ride Or Die Pt. 2 Ft. Tokischa & Villano Antillano (Letra_Lyrics) [qq_aCp70jb0].mp3", featuredArtist: "Tokischa, Villano Antiliano",
      "isSingle": true,
      "cover": "https://images.genius.com/6e2b39a925a895a7cead0725996d1b2e.1000x1000x1.png"
    },
      {
      "title": "Alibi",
audioSrc: "musica/SEVDALIZA - ALIBI FT. PABLLO VITTAR & YSEULT (OFFICIAL MUSIC VIDEO) [qVqFuokjRMc].mp3", featuredArtist: "Pabllo Vittar, Yseult",
      "isSingle": true,
 "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/74/f9/9f/74f99f7a-966d-2940-f4ac-b9158be2a030/cover.jpg/800x800cc.jpg"    },
  ]
}
    },

    "Urias": {
        "FÚRIA": {
            cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/10/06/c2/1006c2bb-d681-e3ee-627d-36d20e8eea6b/8445162578011.jpg/1200x630bf-60.jpg",
            songs: [
                { title: "Foi Mal", audioSrc: "musica/Urias - Foi Mal (letra) [IzTKOaDHJZs].mp3" }
            ]
        },
        "HER MIND": {
            cover: "https://ayalaboratorio.com/wp-content/uploads/2025/02/urias-_-her-mind-700x700-1.jpg",
            songs: [
                { title: "Neo Thang", audioSrc: "musica/URIAS - NEO THANG (OFFICIAL MUSIC VIDEO) [HLcBgVljOM8].mp3" },
                { title: "Cuntelectual", audioSrc: "musica/URIAS - CUNTELECTUAL ( OFFICIAL VIDEODANCE) [WAfg7ggM-lU].mp3" }
            ]
        }
    }
};
    

        const progressBar = document.getElementById('progressBar');
        const currentTimeDisplay = document.getElementById('currentTime');
        const restartSongBtn = document.getElementById('restartSong');
        
        // Função para formatar o tempo (segundos para MM:SS)
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        }
        
        // Atualiza a barra de progresso e o tempo atual
        audioPlayer.addEventListener('timeupdate', function() {
            const currentTime = audioPlayer.currentTime;
            const duration = audioPlayer.duration;
            
            // Atualiza a barra de progresso
            if (duration) {
                const progressPercent = (currentTime / duration) * 100;
                progressBar.style.width = `${progressPercent}%`;
            }
            
            // Atualiza o tempo atual
            currentTimeDisplay.textContent = formatTime(currentTime);
        });
        
        // Função para reiniciar a música
 function restartSong() {
    if (audioPlayer.src) {
        // Para e redefine completamente o áudio
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        
        // Atualiza a UI imediatamente
        progressBar.style.width = '0%';
        currentTimeDisplay.textContent = '0:00';
        
        // Se estava tocando antes, reinicia a reprodução
        if (isPlaying) {
            audioPlayer.play().catch(e => console.error("Erro ao reiniciar:", e));
        }
        
        // Adiciona um pequeno delay para garantir que o reset seja aplicado
        setTimeout(() => {
            audioPlayer.currentTime = 0; // Força o reset novamente para garantir
        }, 50);
    }
}
        
        // Event listener para o botão de reinício
restartSongBtn.addEventListener('click', function() {
    restartSong();
    
    // Feedback visual
    const icon = this.querySelector('i');
    icon.classList.add('rotate-on-click');
    setTimeout(() => {
        icon.classList.remove('rotate-on-click');
    }, 300);
});        
        // Exemplo de como carregar uma música (substitua com sua lógica real)
        function loadExampleSong() {
            audioPlayer.src = 'sua-musica.mp3';
            audioPlayer.load();
            
            // Quando os metadados estiverem carregados, mostra a duração
            audioPlayer.addEventListener('loadedmetadata', function() {
                document.getElementById('duration').textContent = formatTime(audioPlayer.duration);
            });
        }
        
        // Carrega uma música de exemplo (remova na implementação real)
        loadExampleSong();


         function playSound(soundId) {
            const sound = document.getElementById(soundId);
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Não foi possível tocar o som:", e));
        }

        // Atualização da barra de progresso
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    document.getElementById('progressBar').style.width = `${progressPercent}%`;
    
    // Atualiza o tempo atual
    document.getElementById('currentTime').textContent = formatTime(currentTime);
}

// Formata o tempo (segundos para MM:SS)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Configura o tempo total quando a música pode ser tocada
function setTotalTime() {
    const duration = audioPlayer.duration;
    document.getElementById('duration').textContent = formatTime(duration);
}

// Pula para o ponto clicado na barra de progresso
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

// Adicione estes event listeners no seu código existente:
audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('canplay', setTotalTime);
audioPlayer.addEventListener('ended', () => {
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('currentTime').textContent = '0:00';
});

document.querySelector('.progress-container').addEventListener('click', setProgress);

        // Função para verificar se uma música está favoritada
        function isMusicaFavorita(title, artist) {
            const favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
            return favoriteMusics.some(music => music.title === title && music.artist === artist);
        }

        // Função para adicionar música aos favoritos
    function addMusicaFavorita(title, artist) {
    const favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
    
    // Verifica se já não está na playlist
    if (!favoriteMusics.some(music => music.title === title && music.artist === artist)) {
        favoriteMusics.push({ title, artist });
        localStorage.setItem('favoriteMusics', JSON.stringify(favoriteMusics));
    }
}

function removeFromPlaylist(event, title, artist) {
    event.stopPropagation();
    removeMusicaFavorita(title, artist);
    playSound('star-off-sound');
    atualizarPlaylist();
}

        // Função para remover música dos favoritos
        function removeMusicaFavorita(title, artist) {
            let favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
            favoriteMusics = favoriteMusics.filter(music => !(music.title === title && music.artist === artist));
            localStorage.setItem('favoriteMusics', JSON.stringify(favoriteMusics));
            atualizarPlaylist();
        }

        // Função para tocar música diretamente da playlist
function playFromPlaylist(title, artist) {
    playSound('click-sound');
    
    // Encontra a música no banco de dados
    let foundSong = null;
    
    // Procura em todos os artistas
    for (const artistName in musicDatabase) {
        // Procura em todos os álbuns do artista
        for (const albumName in musicDatabase[artistName]) {
            const album = musicDatabase[artistName][albumName];
            // Procura em todas as músicas do álbum
            for (const song of album.songs) {
                const songArtist = song.featuredArtist ? `${artistName} ft. ${song.featuredArtist}` : artistName;
                if (song.title === title && songArtist === artist) {
                    foundSong = {
                        audioSrc: song.audioSrc,
                        title: song.title,
                        artist: songArtist
                    };
                    break;
                }
            }
            if (foundSong) break;
        }
        if (foundSong) break;
    }
    
    if (foundSong) {
        playMusic(foundSong.audioSrc, foundSong.title, foundSong.artist);
        atualizarPlaylist(); // Atualiza para destacar a música atual
    } else {
        console.error("Música não encontrada no banco de dados:", title, artist);
        // Opcional: mostrar mensagem de erro ao usuário
    }
}
// Função para remover música da playlist
function removeFromPlaylist(event, title, artist) {
    event.stopPropagation(); // Impede que o clique no botão dispare o play
    playSound('star-off-sound');
    removeMusicaFavorita(title, artist);
}
// Função para tocar música
function playMusic(audioSrc, title, artist) {
    // Remove a classe 'playing' de todos os resultados
    document.querySelectorAll('.result').forEach(el => {
        el.classList.remove('playing');
    });
    
    // Encontra e destaca o card atual
    const cards = document.querySelectorAll('.result');
    cards.forEach(card => {
        if (card.querySelector('h3').textContent === title && 
            card.querySelector('p').textContent === artist) {
            card.classList.add('playing');
            
            // Efeito visual adicional - pulso inicial
            card.style.animation = 'none';
            void card.offsetWidth; // Trigger reflow
            card.style.animation = 'pulseHighlight 0.8s ease';
        }
    });

    // Configura o player de áudio
    currentAudioSrc = audioSrc;
    
    // Se for uma música diferente da atual
    if (audioPlayer.src !== audioSrc) {
        audioPlayer.src = audioSrc;
        document.getElementById('currentTime').textContent = '0:00';
        document.getElementById('progressBar').style.width = '0%';
        
        // Espera os metadados para mostrar a duração
        audioPlayer.addEventListener('loadedmetadata', function() {
            document.getElementById('duration').textContent = formatTime(audioPlayer.duration);
        }, { once: true });
    }

    // Começa a girar o CD imediatamente quando a música é selecionada
    startCdRotation();

    // Toca a música
    audioPlayer.play().then(() => {
        isPlaying = true;
        
        // Mostra o botão de reinício
        document.getElementById('restartSong').style.display = 'flex';
        
        // Atualiza ícone do play/pause
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');

        // Atualiza o título da música atual
        const previousTitle = document.querySelector('.now-playing');
        if (previousTitle) previousTitle.remove();

        // Adiciona o título da música atual no player
        const nowPlayingDiv = document.createElement('div');
        nowPlayingDiv.className = 'now-playing';
        nowPlayingDiv.textContent = `${title} - ${artist}`;
        document.querySelector('.music-player').insertBefore(nowPlayingDiv, document.querySelector('.music-player').firstChild);

        // Atualiza a playlist para destacar a música atual
        atualizarPlaylist();
        
    }).catch(error => {
        console.error("Erro ao reproduzir música:", error);
        // Mostra mensagem de erro (opcional)
        showCustomAlert("Erro ao reproduzir a música. Tente novamente.");
        // Para a rotação do CD se houver erro
        stopCdRotation();
    });
}


        // Função para favoritar/desfavoritar música
      // Função para favoritar/desfavoritar música (atualizada para lidar com singles)
// Função para favoritar/desfavoritar música (atualizada para lidar com singles)
function favoritarMusica(starElement, event, title = null, artist = null) {
    event.stopPropagation(); // Impede que o clique ative o play da música
    
    // Se title e artist forem fornecidos (caso dos singles), usa esses valores
    if (!title || !artist) {
        const resultDiv = starElement.closest('.result, .single-card');
        title = resultDiv.querySelector('h3, h4').textContent;
        artist = resultDiv.querySelector('p').textContent;
    }
    
    const starIcon = starElement.querySelector('i');
    
    playSound('click-sound');
    
    if (starIcon.classList.contains('fas')) { // Se já estiver favoritado
        removeMusicaFavorita(title, artist);
        starIcon.classList.replace('fas', 'far');
        starIcon.style.color = '#ccc'; // Volta para cinza
        playSound('star-off-sound');
    } else { // Se não estiver favoritado
        addMusicaFavorita(title, artist);
        starIcon.classList.replace('far', 'fas');
        starIcon.style.color = 'gold'; // Muda para dourado
        playSound('star-on-sound');
        
        // Efeito visual
        starIcon.style.transform = 'rotate(360deg) scale(1.5)';
        setTimeout(() => {
            starIcon.style.transform = 'rotate(0) scale(1)';
        }, 300);
    }
    
    // Atualiza a playlist imediatamente
    atualizarPlaylist();
}
        // Função para atualizar a playlist
       function atualizarPlaylist() {
    const playlistContainer = document.getElementById('playlist');
    const favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
    
    playlistContainer.innerHTML = '';
    
    if (favoriteMusics.length === 0) {
        playlistContainer.innerHTML = `
            <li style="
                text-align: center;
                cursor: default;
                padding: 20px;
                color: #666;
                font-style: italic;
                background: transparent;
                box-shadow: none;
            ">
                Sua playlist está vazia
            </li>
        `;
        playlistContainer.classList.remove('has-scroll');
        return;
    }
    
    favoriteMusics.forEach((music, index) => {
        const listItem = document.createElement('li');
        
        // Verifica se é a música atual
        const nowPlaying = document.querySelector('.now-playing')?.textContent;
        const isCurrentSong = nowPlaying && 
                            nowPlaying.includes(music.title) && 
                            nowPlaying.includes(music.artist);
        
        listItem.innerHTML = `
            <span class="playlist-track">${index + 1}. ${music.title} - ${music.artist}</span>
            <div class="playlist-controls">
                ${isCurrentSong ? '<div class="now-playing-indicator"><i class="fas fa-volume-up"></i></div>' : ''}
                <button class="delete-button" onclick="removeFromPlaylist(event, '${music.title.replace("'", "\\'")}', '${music.artist.replace("'", "\\'")}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        if (isCurrentSong) {
            listItem.classList.add('current-playing');
        }
        
        listItem.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-button') && !e.target.closest('.now-playing-indicator')) {
                playFromPlaylist(music.title, music.artist);
            }
        });
        
        playlistContainer.appendChild(listItem);
    });

    // Ativa a rolagem apenas se tiver 9 ou mais músicas
    if (favoriteMusics.length >= 9) {
        playlistContainer.classList.add('has-scroll');
    } else {
        playlistContainer.classList.remove('has-scroll');
    }
} 

        // Função para carregar músicas favoritas
        function loadFavoriteMusics() {
            atualizarPlaylist();
        }

        // Função para buscar músicas
function search() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsContainer = document.getElementById('results');
    
    resultsContainer.innerHTML = '';
    
    if (searchInput === '') return;

    // Verifica se é um artista com estrutura de álbuns
    const artistWithAlbums = Object.keys(musicDatabase).find(artist => 
        artist.toLowerCase().includes(searchInput)
    );
    
    if (artistWithAlbums) {
        showAlbums(artistWithAlbums);
        return;
    }

    // Pesquisa normal para outros casos
    const allSongs = getAllSongsFromDatabase();
    
    // Filtra as músicas onde:
    // 1. O artista principal corresponde à pesquisa
    // 2. O artista está em feat na música
    const filteredResults = allSongs.filter(song => {
        const artistMatches = song.artist.toLowerCase().includes(searchInput);
        const inFeatMatches = artistIsInFeat(searchInput, song);
        return artistMatches || inFeatMatches;
    });
    
    if (filteredResults.length > 0) {
        displayResults(filteredResults);
    } else {
        resultsContainer.innerHTML = '<p style="text-align:center;width:100%">Nenhuma música encontrada</p>';
    }
}
function showAlbums(artist) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `
        <div class="artist-section">
            <h3 class="section-title">Discografia de ${artist}</h3>
                        <h4 class="section-subtitle">Álbuns</h4>
            <div class="discography-container" id="discographyContainer">
                <div class="album-grid" id="albumGrid"></div>
                <div class="singles-section" id="singlesSection">
                    <h4 class="section-subtitle">Singles</h4>
                    <div class="singles-grid" id="singlesGrid"></div>
                </div>
            </div>
            <div class="features-section" id="featuresSection">
                <h4 class="section-subtitle">Participações</h4>
                <div class="features-grid" id="featuresGrid"></div>
            </div>
        </div>
    `;

    const artistData = musicDatabase[artist];
    if (!artistData) {
        resultsContainer.innerHTML = '<p>Artista não encontrado</p>';
        return;
    }

    const discographyContainer = document.getElementById('discographyContainer');
    const albumGrid = document.getElementById('albumGrid');
    const singlesSection = document.getElementById('singlesSection');
    const singlesGrid = document.getElementById('singlesGrid');
    const featuresSection = document.getElementById('featuresSection');
    const featuresGrid = document.getElementById('featuresGrid');

    // Conta álbuns e verifica singles
    let albumCount = 0;
    const albumNames = [];
    
    for (const albumName in artistData) {
        if (!albumName.startsWith('_')) {
            albumCount++;
            albumNames.push(albumName);
        }
    }

    const hasSingles = artistData._singles && artistData._singles.songs && artistData._singles.songs.length > 0;
    const hasFeatures = checkArtistFeatures(artist);

    // Configura o layout
    if (hasSingles) {
        discographyContainer.classList.add('with-singles-layout');
        albumGrid.classList.add('with-singles');
        albumGrid.classList.remove('no-singles');
        singlesSection.style.display = 'block';
        
        // Preenche os singles
        artistData._singles.songs.forEach(song => {
            const songDiv = createSingleCard(song, artist);
            singlesGrid.appendChild(songDiv);
        });
    } else {
        discographyContainer.classList.remove('with-singles-layout');
        albumGrid.classList.add('no-singles');
        albumGrid.classList.remove('with-singles');
        singlesSection.style.display = 'none';
    }

    // Mostra os álbuns
    albumNames.forEach(albumName => {
        const album = artistData[albumName];
        const albumDiv = document.createElement('div');
        albumDiv.classList.add('album-card');
        
        albumDiv.innerHTML = `
            <div class="album-cover-container">
                <img class="album-cover" src="${album.cover}" alt="${albumName}" onerror="this.src='default-album.jpg'">
                <div class="album-overlay">
                    <span class="song-count">${album.songs.length} ${album.songs.length === 1 ? 'música' : 'músicas'}</span>
                </div>
            </div>
            <div class="album-info">
                <h3>${albumName}</h3>
                <p>${artist}</p>
            </div>
        `;
        
        albumDiv.addEventListener('click', () => {
            playSound('click-sound');
            showSongs(artist, albumName);
        });
        
        albumGrid.appendChild(albumDiv);
    });

    // Mostra participações se houver
    if (hasFeatures) {
        featuresSection.style.display = 'block';
        const featuredSongs = getArtistFeatures(artist);
        
        featuredSongs.forEach(song => {
            const songDiv = createSingleCard(song);
            featuresGrid.appendChild(songDiv);
        });
    } else {
        featuresSection.style.display = 'none';
    }
}

function checkArtistFeatures(artist) {
    for (const otherArtist in musicDatabase) {
        if (otherArtist === artist) continue;
        
        for (const albumName in musicDatabase[otherArtist]) {
            if (albumName.startsWith('_')) continue;
            
            const album = musicDatabase[otherArtist][albumName];
            if (album.songs && album.songs.some(song => artistIsInFeat(artist, song))) {
                return true;
            }
        }
        
        if (musicDatabase[otherArtist]._singles && 
            musicDatabase[otherArtist]._singles.songs &&
            musicDatabase[otherArtist]._singles.songs.some(song => artistIsInFeat(artist, song))) {
            return true;
        }
    }
    return false;
}

function getArtistFeatures(artist) {
    const featuredSongs = [];
    
    for (const otherArtist in musicDatabase) {
        if (otherArtist === artist) continue;
        
        for (const albumName in musicDatabase[otherArtist]) {
            if (albumName.startsWith('_')) continue;
            
            const album = musicDatabase[otherArtist][albumName];
            if (album.songs) {
                album.songs.forEach(song => {
                    if (artistIsInFeat(artist, song)) {
                        featuredSongs.push({
                            title: song.title,
                            artist: `${otherArtist} ft. ${song.featuredArtist}`,
                            audioSrc: song.audioSrc,
                            cover: album.cover
                        });
                    }
                });
            }
        }
        
        if (musicDatabase[otherArtist]._singles && musicDatabase[otherArtist]._singles.songs) {
            musicDatabase[otherArtist]._singles.songs.forEach(song => {
                if (artistIsInFeat(artist, song)) {
                    featuredSongs.push({
                        title: song.title,
                        artist: `${otherArtist} ft. ${song.featuredArtist}`,
                        audioSrc: song.audioSrc,
                        cover: song.cover || musicDatabase[otherArtist]._singles.cover
                    });
                }
            });
        }
    }
    
    return featuredSongs;
}

function createSingleCard(song, mainArtist = null) {
    const songDiv = document.createElement('div');
    songDiv.classList.add('single-card');
    
    const artistName = mainArtist 
        ? `${mainArtist}${song.featuredArtist ? ' ft. ' + song.featuredArtist : ''}`
        : song.artist;
    
    const isFavorited = isMusicaFavorita(song.title, artistName);
    
    songDiv.innerHTML = `
        <div class="single-cover-container">
            <img class="single-cover" src="${song.cover || 'default-single.jpg'}" alt="${song.title}" onerror="this.src='default-single.jpg'">
            <div class="single-overlay">
                <i class="fas fa-music"></i>
            </div>
        </div>
        <div class="single-info-container">
            <div class="single-info">
                <h4>${song.title}</h4>
                <p>${artistName}</p>
            </div>
            <button class="favorite-star" onclick="event.stopPropagation(); favoritarMusica(this, event, '${escapeSingleQuote(song.title)}', '${escapeSingleQuote(artistName)}')">
                <i class="${isFavorited ? 'fas' : 'far'} fa-star"></i>
            </button>
        </div>
    `;
    
    songDiv.addEventListener('click', () => {
        playMusic(song.audioSrc, song.title, artistName);
    });
    
    return songDiv;
}

function escapeSingleQuote(str) {
    return str.replace(/'/g, "\\'");
}

function showSongs(artist, albumName) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    
    // Container principal como grid
    const mainContainer = document.createElement('div');
    mainContainer.className = 'album-detail-grid';
    resultsContainer.appendChild(mainContainer);

    // Cabeçalho do álbum (agora dentro do grid)
    const headerContainer = document.createElement('div');
    headerContainer.className = 'album-header-container';
    
    const albumData = musicDatabase[artist][albumName];
    
    headerContainer.innerHTML = `
        <div class="album-header">
            <div class="album-header-background" style="background-image: url('${albumData.cover}')"></div>
            <div class="album-header-overlay"></div>
            <div class="album-header-content">
                <img class="album-cover-large" src="${albumData.cover}" alt="${albumName}">
                <div class="album-header-info">
                    <span class="album-type">ÁLBUM</span>
                    <h1 class="album-title">${albumName}</h1>
                    <div class="album-meta">
                        <span class="album-artist">${artist}</span>
                        <span class="album-tracks">• ${albumData.songs.length} ${albumData.songs.length === 1 ? 'música' : 'músicas'}</span>
                    </div>
                </div>
            </div>
            <button class="album-back-button" onclick="showAlbums('${escapeSingleQuote(artist)}')">
                <i class="fas fa-chevron-left"></i>
            </button>
        </div>
    `;
    mainContainer.appendChild(headerContainer);

    // Container das músicas (agora parte do mesmo grid)
    const songsContainer = document.createElement('div');
    songsContainer.className = 'songs-grid-container';
    
    albumData.songs.forEach(song => {
        const songDiv = document.createElement('div');
        songDiv.className = 'result';
        
        const artistName = song.featuredArtist ? `${artist} ft. ${song.featuredArtist}` : artist;
        const isFavorited = isMusicaFavorita(song.title, artistName);
        
        songDiv.innerHTML = `
            <button class="favorite-star" onclick="favoritarMusica(this, event)">
                <i class="${isFavorited ? 'fas' : 'far'} fa-star"></i>
            </button>
            <div class="result-content">
                <h3>${song.title}</h3>
                <p>${artistName}</p>
            </div>
        `;
        
        songDiv.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-star')) {
                playMusic(song.audioSrc, song.title, artistName);
            }
        });
        
        songsContainer.appendChild(songDiv);
    });
    
    mainContainer.appendChild(songsContainer);
}
        // Função para alternar play/pause
function togglePlayPause() {
    playSound('click-sound');

    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
        stopCdRotation(); // Para o CD mantendo a posição atual
    } else {
        if (!currentAudioSrc) {
            const firstResult = document.querySelector('.result');
            if (firstResult) {
                firstResult.click();
                startCdRotation();
            }
        } else {
            audioPlayer.play();
            isPlaying = true;
            playPauseIcon.classList.remove('fa-play');
            playPauseIcon.classList.add('fa-pause');
            startCdRotation(); // Continua a rotação do CD de onde parou
        }
    }
}

        // Funções para o painel lateral
     function abrirPainel() {
    playSound('panel-open-sound');
    
    // Abre o catálogo diretamente sem pausar a música
    document.getElementById('painelInformacoes').classList.add('active');
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('painelToggle').classList.add('hidden');
}

function fecharPainel() {
    const painel = document.getElementById('painelInformacoes');
    painel.classList.remove('active');
    void painel.offsetWidth; // Força repaint (opcional)
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('painelToggle').classList.remove('hidden');
}
function mostrarOcultarPlaylist() {
    const playlistContainer = document.getElementById('playlistContainer');
    const overlay = document.getElementById('playlistOverlay');
    const cd = document.querySelector('.cdrom');
    
    if (playlistContainer.classList.contains('active')) {
        playlistContainer.classList.remove('active');
        overlay.style.display = 'none';
        cd.style.zIndex = '10'; // Volta ao normal
    } else {
        playlistContainer.classList.add('active');
        overlay.style.display = 'block';
        cd.style.zIndex = '-1'; // Força ficar atrás
        atualizarPlaylist();
    }
    playSound('click-sound');
}

document.getElementById('playlistOverlay').addEventListener('click', mostrarOcultarPlaylist);

        function fecharMensagem() {
            document.getElementById('custom-alert').style.display = 'none';
        }

        // Evento para quando a música terminar
    audioPlayer.addEventListener('ended', function() {
    isPlaying = false;
    playPauseIcon.classList.remove('fa-pause');
    document.querySelector('.cdrom')?.classList.remove('girar');

    playPauseIcon.classList.add('fa-play');
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('currentTime').textContent = '0:00';
    
    // Remove o destaque da playlist
    const playingItems = document.querySelectorAll('.playlist-container li.playing');
    playingItems.forEach(item => item.classList.remove('playing'));
});

 const restartButton = document.getElementById('restartSong');

  restartButton.addEventListener('click', () => {
    const icon = restartButton.querySelector('i');

    icon.classList.remove('rotate-on-click'); // Reinicia a animação se já estiver ativa

    // Força reflow para garantir que a animação reinicie
    void icon.offsetWidth;

    icon.classList.add('rotate-on-click');
  });

  // Quando uma música começa a tocar
// Mostrar/ocultar quando a música toca/pausa
// Quando uma música começa a tocar
audioPlayer.addEventListener('play', function() {
    document.getElementById('restartSong').style.display = 'flex';
    document.getElementById('pauseSong').style.display = 'flex';
    document.getElementById('pauseSong').innerHTML = '<i class="fas fa-pause"></i>';
});

audioPlayer.addEventListener('pause', function() {
    isPlaying = false;
    document.getElementById('pauseSong').innerHTML = '<i class="fas fa-play"></i>';
    playPauseIcon.classList.remove('fa-pause');
    playPauseIcon.classList.add('fa-play');
    stopCdRotation();
});

// Função para pausar/retomar
// Função específica para o botão de pause
document.getElementById('pauseSong').addEventListener('click', function(e) {
    e.stopPropagation(); // Impede que o evento se propague
    playSound('click-sound');
    
    if (isPlaying) {
        // Pausa a música
        audioPlayer.pause();
        isPlaying = false;
        this.innerHTML = '<i class="fas fa-play"></i>';
        stopCdRotation();
    } else {
        // Continua a reprodução
        audioPlayer.play();
        isPlaying = true;
        this.innerHTML = '<i class="fas fa-pause"></i>';
        startCdRotation();
    }
});

audioPlayer.addEventListener('ended', function() {
    isPlaying = false;
    playPauseIcon.classList.remove('fa-pause');
    playPauseIcon.classList.add('fa-play');
    stopCdRotation();
    document.getElementById('restartSong').style.display = 'none';
    document.getElementById('pauseSong').style.display = 'none';
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('currentTime').textContent = '0:00';
});

// Função para pesquisar artista ao clicar no catálogo
function searchArtist(artistName) {
    const artist = Object.keys(musicDatabase).find(a => a.toLowerCase() === artistName.toLowerCase());
    
    // Fecha o painel do catálogo
    fecharPainel();
    
    if (artist) {
        document.getElementById('searchInput').value = artist;
        showAlbums(artist);
    } else {
        // Pesquisa normal se não encontrar álbuns
        document.getElementById('searchInput').value = artistName;
        search();
    }
}

function setupAudioAnalyzer() {
    const source = audioContext.createMediaElementSource(audioPlayer);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    // Inicia a visualização
    if (!isAnalyzing) {
        isAnalyzing = true;
        visualize();
    }
}

let isAnalyzing = false;

function visualize() {
    if (!isPlaying || !analyser) return;
    
    requestAnimationFrame(visualize);
    analyser.getByteFrequencyData(dataArray);
    
    const bars = document.querySelectorAll('.visualizer .bar');
    bars.forEach((bar, i) => {
        const value = dataArray[i % dataArray.length] / 255;
        const height = 10 + (value * 50);
        bar.style.height = `${height}px`;
        bar.style.opacity = 0.7 + (value * 0.3);
    });
}

function animateCdRotation() {
    cdRotationAngle = (cdRotationAngle + 1) % 360;
    document.querySelector('.cdrom').style.transform = `translateX(-50%) rotate(${cdRotationAngle}deg)`;
}

function startCdRotation() {
    if (!cdRotationInterval) {
        cdRotationInterval = setInterval(animateCdRotation, 20);
        document.querySelector('.cdrom').classList.add('girar');
    }
}

function stopCdRotation() {
    if (cdRotationInterval) {
        clearInterval(cdRotationInterval);
        cdRotationInterval = null;
        document.querySelector('.cdrom').classList.remove('girar');
    }
}

function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    
    // Separa singles e músicas de álbuns
    const singles = results.filter(song => song.isSingle);
    const albumSongs = results.filter(song => !song.isSingle);
    
    // Mostra músicas de álbuns primeiro
    albumSongs.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('result');
        
        const isFavorited = isMusicaFavorita(result.title, result.artist);
        
        resultDiv.innerHTML = `
            <button class="favorite-star" onclick="favoritarMusica(this, event)">
                <i class="${isFavorited ? 'fas' : 'far'} fa-star"></i>
            </button>
            <div class="result-content">
                <h3>${result.title}</h3>
                <p>${result.artist}</p>
            </div>
        `;
        
        resultDiv.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-star')) {
                playMusic(result.audioSrc, result.title, result.artist);
            }
        });
        
        resultsContainer.appendChild(resultDiv);
    });
    
    // Mostra singles em uma seção separada
    if (singles.length > 0) {
        const singlesSection = document.createElement('div');
        singlesSection.classList.add('artist-section');
        singlesSection.innerHTML = `
            <h3 class="section-title">Singles</h3>
            <div class="singles-grid"></div>
        `;
        
        const singlesGrid = singlesSection.querySelector('.singles-grid');
        
        singles.forEach(single => {
            const singleDiv = document.createElement('div');
            singleDiv.classList.add('single-card');
            
            const isFavorited = isMusicaFavorita(single.title, single.artist);
            
            singleDiv.innerHTML = `
                <div class="single-cover-container">
                    <img class="single-cover" src="${single.cover || 'default-cover.jpg'}" alt="${single.title}">
                    <div class="single-overlay">
                        <i class="fas fa-music"></i>
                    </div>
                </div>
                <div class="single-info-container">
                    <div class="single-info">
                        <h4>${single.title}</h4>
                        <p>${single.artist}</p>
                    </div>
                    <button class="favorite-star" onclick="event.stopPropagation(); favoritarMusica(this, event, '${single.title.replace(/'/g, "\\'")}', '${single.artist.replace(/'/g, "\\'")}')">
                        <i class="${isFavorited ? 'fas' : 'far'} fa-star"></i>
                    </button>
                </div>
            `;
            
            singleDiv.addEventListener('click', () => {
                playMusic(single.audioSrc, single.title, single.artist);
            });
            
            singlesGrid.appendChild(singleDiv);
        });
        
        resultsContainer.appendChild(singlesSection);
    }
}

function artistIsInFeat(artistName, song) {
    return song.featuredArtist && 
           (song.featuredArtist.toLowerCase().includes(artistName.toLowerCase()) || 
            artistName.toLowerCase().includes(song.featuredArtist.toLowerCase()));
}

function getAllSongsFromDatabase() {
    let allSongs = [];
    for (const artist in musicDatabase) {
        if (typeof musicDatabase[artist] === 'object' && !Array.isArray(musicDatabase[artist])) {
            // Estrutura de álbuns
            for (const album in musicDatabase[artist]) {
                // Verifica se é um álbum normal ou um single
                if (album === '_singles') {
                    musicDatabase[artist][album].songs.forEach(song => {
                        allSongs.push({
                            title: song.title,
                            artist: song.featuredArtist ? `${artist} ft. ${song.featuredArtist}` : artist,
                            audioSrc: song.audioSrc,
                            isSingle: true,
                            cover: song.cover || (musicDatabase[artist][album].cover || '')
                        });
                    });
                } else if (album !== '_singles') { // Álbuns normais
                    musicDatabase[artist][album].songs.forEach(song => {
                        allSongs.push({
                            title: song.title,
                            artist: song.featuredArtist ? `${artist} ft. ${song.featuredArtist}` : artist,
                            audioSrc: song.audioSrc,
                            isSingle: false,
                            cover: musicDatabase[artist][album].cover
                        });
                    });
                }
            }
        }
    }
    return allSongs;
}

