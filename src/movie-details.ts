export type MovieDetails = [
  duration: string,
  year: string,
  director: string,
  cast: string,
  synopsis: string,
  trailer: string,
  source: string,
];

/** Información contrastada en las fichas oficiales enlazadas en cada película. */
export const movieDetails: MovieDetails[] = [
  [
    "2 h 05 min",
    "2023",
    "Peyton Reed",
    "Paul Rudd, Evangeline Lilly, Michelle Pfeiffer",
    "Scott Lang y Hope van Dyne se adentran en el Reino Cuántico junto a su familia. Entre criaturas desconocidas y nuevos peligros, descubren que este universo diminuto esconde una amenaza capaz de cambiarlo todo.",
    "ZlNFpri-Y40",
    "https://movies.disney.com/ant-man-and-the-wasp-quantumania",
  ],
  [
    "3 h 12 min",
    "2022",
    "James Cameron",
    "Sam Worthington, Zoe Saldaña, Sigourney Weaver",
    "Jake Sully y Neytiri buscan un nuevo hogar para proteger a su familia. En los océanos de Pandora conocerán otras culturas Na’vi y descubrirán que sus lazos son su mayor fuerza frente a una amenaza que regresa.",
    "d9MyW72ELq0",
    "https://www.avatar.com/movies/avatar-the-way-of-water",
  ],
  [
    "2 h 24 min",
    "2023",
    "Andy Muschietti",
    "Ezra Miller, Michael Keaton, Sasha Calle",
    "Barry Allen viaja al pasado para salvar a su familia, pero altera el futuro y queda atrapado en una realidad distinta. Sin los héroes que conoce, tendrá que encontrar aliados para detener al general Zod y volver a casa.",
    "hebWYacbdvc",
    "https://www.dc.com/theflash",
  ],
  [
    "1 h 42 min",
    "2023",
    "Gerard Johnstone",
    "Allison Williams, Violet McGraw, Ronny Chieng",
    "Una ingeniera crea una muñeca con inteligencia artificial para acompañar y proteger a su sobrina. Cuando M3GAN empieza a tomar sus propias decisiones, lo que parecía una ayuda perfecta se convierte en una amenaza imprevisible.",
    "BRb4U99OU80",
    "https://www.universalpicturesathome.com/movies/m3gan",
  ],
];
