import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const translations = {
  Amanda: 'Amanda',
  Sobre: 'About',
  'Soft Skills': 'Soft Skills',
  Experiência: 'Experience',
  Projetos: 'Projects',
  Contato: 'Contact',
  'PROJETOS': 'PROJECTS',
  TRABALHO: 'WORK',
  Tecnologias: 'Technologies',
  'Entre em contato': 'Contact me',
  'Vamos conversar?': "Let's talk",
  'Vamos conversar': "Let's talk",
  'E-mail': 'Email',
  'Front-end': 'Front end',
  'Back-end': 'Back end',
  'Trabalho em equipe': 'Teamwork',
  'Boa comunicação': 'Good communication',
  Dedicação: 'Dedication',
  'Facilidade de aprendizado': 'Quick learner',
  Proatividade: 'Proactivity',
  Curiosidade: 'Curiosity',
  Estilos: 'Styles',
  'Banco de dados': 'Databases',
  'Testes & DevOps': 'Testing & DevOps',
  'Ensino Médio Integrado': 'Integrated High School',
  'Bacharelado em Sistemas de Informação': 'Bachelor of Information Systems',
  'Faculdades Integradas de Taquara': 'Taquara Integrated Colleges',
  '3º semestre': '3rd semester',
  '4º semestre': '4th semester',
  'Técnico em Informática': 'IT Technician',
  'Escola Estadual Monteiro Lobato': 'Monteiro Lobato State School',
  Intermediário: 'Intermediate',
  'Senac — Taquara': 'Senac — Taquara',
  'Tester Foundation Level': 'Tester Foundation Level',
  'Certified Tester Foundation Level — BSTQB': 'Certified Tester Foundation Level — BSTQB',
  Cursos: 'Courses',
  'Angular 19 e React 18 / 19 — Udemy': 'Angular 19 and React 18 / 19 — Udemy',
  'Angular 19, Curso Completo — Douglas Souza': 'Angular 19 Complete Course — Douglas Souza',
  'Curso de React 18 / 19': 'React 18 / 19 Course',
  Inglês: 'English',
  'Hackatime Taquara · 2º lugar': 'Hackatime Taquara · 2nd place',
  'Sistemas de Informação': 'Information Systems',
  'Contato pelo portfólio': 'Portfolio contact',
  'Full Stack': 'Full Stack',
  'Disponível': 'Available',
  'Aplicação simples em Next.js que lista os filmes populares usando uma API GraphQL. Exibe informações como título, sinopse, data de lançamento, diretor e pôster. O projeto é responsivo e possui pequenas animações. Tecnologias: Next.js, TypeScript, TailwindCSS, GraphQL para busca de dados na API e Jest (opcional) para testes automatizados.':
    'A simple Next.js app that lists popular movies using a GraphQL API. It displays the title, synopsis, release date, director, and poster. The responsive project includes subtle animations. Technologies: Next.js, TypeScript, Tailwind CSS, GraphQL, and optionally Jest for automated tests.',
  'API construída com GraphQL, em que o cliente pede exatamente os campos de que precisa em uma única requisição, evitando excesso ou falta de dados. Define um schema tipado com queries e resolvers, e serve de base de dados para aplicações front-end como o PopularMovies.':
    'A GraphQL API lets clients request exactly the fields they need in a single request, avoiding over-fetching or under-fetching. It defines a typed schema with queries and resolvers, and serves as a data source for front-end apps such as PopularMovies.',
  'Programa em Java que criptografa e descriptografa mensagens com dois clássicos da criptografia: a Cifra de César, que desloca cada letra um número fixo de posições no alfabeto, e a Cifra de Vigenère, que usa uma palavra-chave para variar o deslocamento a cada letra. Útil para entender na prática como funcionam substituição, chave e segurança básica de textos, e por que cifras simples são fáceis de quebrar.':
    'A Java program that encrypts and decrypts messages using two classic ciphers: Caesar, which shifts each letter by a fixed number of positions, and Vigenère, which uses a keyword to vary each shift. It demonstrates substitution, keys, basic text security, and why simple ciphers are easy to break.',
  'Base inicial do planejador de viagens com React, Leaflet, Node/Express e Geoapify. Nesta etapa, os lugares salvos ficam apenas na memória do navegador; não há banco de dados conectado. Funcionalidades: pesquisa de destino via Geoapify Geocoding API; busca de atrações, restaurantes, hotéis e parques próximos via Places API; exibição de descrição e endereço para cada lugar; salvamento de favoritos e marcação independente de vários lugares no mapa; mapa interativo com marcadores dos resultados; inclusão de vários pontos manuais clicando no mapa e dando um nome.':
    'An early version of a travel planner built with React, Leaflet, Node/Express, and Geoapify. Saved places currently live in browser memory; no database is connected. Features include destination search, nearby places via the Places API, place details, favorites, an interactive map, and custom map points.',
  'Vamos trabalhar juntos?': "Let's work together",
  'Tem um projeto, uma vaga ou só quer trocar uma ideia? Me escreva — respondo rápido.':
    'Have a project, a job opportunity, or just want to chat? Send me a message — I’ll reply soon.',
  'Taquara, RS — Brasil · Remoto': 'Taquara, RS — Brazil · Remote',
  'Ver o post no Instagram ↗': 'See the Instagram post ↗',
  '13 de junho · FACCAT': 'June 13 · FACCAT',
  '✋ arraste os recortes e monte o seu mural': '✋ drag the pieces and build your mural',
  'Onde trabalhei': 'Where I worked',
  'Tempo integral · Remoto': 'Full-time · Remote',
  'Plataforma de referências visuais para designers':
    'Visual inspiration platform for designers',
  'Atuei como desenvolvedora full stack, trabalhando tanto no front-end (web, iOS e Android) quanto no back-end da plataforma, em regime integral e 100% remoto.':
    'I worked as a full stack developer across the platform’s front end (web, iOS, and Android) and back end, full-time and fully remote.',
  'Atuação no desenvolvimento e evolução de uma plataforma utilizada por mais de 1 milhão de usuários, produto em produção, com uso contínuo. Participando do desenvolvimento, revisão e testes de funcionalidades.':
    'I helped develop and evolve a platform used by over 1 million people, contributing to the development, review, and testing of features for a live product.',
  'Por ser um produto feito para designers, também aprofundei meu olhar para design de produto, UI/UX e construção de interfaces.':
    'As the product was made for designers, I also deepened my understanding of product design, UI/UX, and interface development.',
  'vídeo em breve': 'video coming soon',
  'criatividade + lógica': 'creativity + logic',
  'Sempre fui uma pessoa criativa e sempre gostei de matemática, lógica e de encontrar soluções para problemas.':
    'I have always been creative and enjoyed math, logic, and finding solutions to problems.',
  'sua foto aqui': 'your photo here',
  'Organizado pela Sicredi Caminho das Águas, com apoio do Instituto Taquara Mais e da Faccat. Durante dois dias, participamos de mentorias e palestras sobre: Validação do Problema / Design Thinking, Validação da Solução / Canva, MVP / Prototipação e Pitch. O nosso projeto se chamou Risco Zero.':
    'Organized by Sicredi Caminho das Águas, with support from Instituto Taquara Mais and Faccat. Over two days, we attended mentoring sessions and talks on problem validation and design thinking, solution validation and Canva, MVPs, prototyping, and pitching. Our project was called Risco Zero.',
  'Participantes do Hackatime Taquara reunidos no auditório':
    'Hackatime Taquara participants gathered in the auditorium',
  'Troféu de 2º lugar do Hackatime': 'Hackatime second-place trophy',
  'Crachá de palestrante do Elas na TI — Faccat, 13 de junho':
    'Elas na TI speaker badge — Faccat, June 13',
  'Amanda palestrando no Elas na TI': 'Amanda speaking at Elas na TI',
  'Palestrante no Elas na TI': 'Speaker at Elas na TI',
  'Um evento feito para mulheres que querem conhecer, entrar ou crescer na área da tecnologia. Participei como palestrante.':
    'An event for women interested in exploring, entering, or growing in technology. I participated as a speaker.',
  'Ver o post no Instagram ↗': 'See the Instagram post ↗',
  'Tocar ou pausar o vídeo da palestra': 'Play or pause the talk video',
  'Tem um projeto, uma vaga ou só quer trocar uma ideia? Me escreva — respondo rápido.':
    'Have a project, a job opportunity, or just want to chat? Send me a message — I’ll reply soon.',
  Redes: 'Social',
  Nome: 'Name',
  'Sua mensagem': 'Your message',
  'Como te respondo?': 'Your email',
  'Quem é você?': 'Your name',
  'Enviar mensagem': 'Send message',
  'Equipe do Hackatime Taquara com o troféu e a bandeira da escola': 'Hackatime Taquara team with the trophy and the school flag',
  'Equipe Risco Zero · 2º lugar': 'Risco Zero team · 2nd place',
  'Amanda apresentando o pitch do Risco Zero': 'Amanda presenting the Risco Zero pitch',
  'Pitch do Risco Zero': 'Risco Zero pitch',
  'Enviando…': 'Sending…',
  'Mensagem enviada ✓ Obrigada pelo contato!': 'Message sent ✓ Thanks for reaching out!',
  'Não foi possível enviar. Tente de novo ou escreva direto para o e-mail ao lado.':
    'Could not send. Please try again or email me directly.',
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return window.localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'pt'
    } catch (error) {
      console.error('Could not read the saved language preference.', error)
      return 'pt'
    }
  })

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en'
    try {
      window.localStorage.setItem('portfolio-language', language)
    } catch (error) {
      console.error('Could not save the language preference.', error)
    }
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (text) => (language === 'en' ? translations[text] ?? text : text),
    }),
    [language]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
  return context
}
