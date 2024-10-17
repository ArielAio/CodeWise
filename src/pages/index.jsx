//imports
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { db } from '../lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function Home() {
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const cursosCollection = collection(db, 'cursos');
        const cursosSnapshot = await getDocs(cursosCollection);
        const cursosList = cursosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCursos(cursosList);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();

    const interval = setInterval(() => {
      nextCourse();
    }, 3000);

    return () => clearInterval(interval);
  }, [cursos.length]);

  const nextCourse = () => {
    if (cursos.length > 0) {
      setCurrentCourseIndex((prevIndex) => (prevIndex + 1) % cursos.length);
    }
  };

  const prevCourse = () => {
    if (cursos.length > 0) {
      setCurrentCourseIndex((prevIndex) => (prevIndex - 1 + cursos.length) % cursos.length);
    }
  };

  const usedEmojis = new Set();

  const getRandomEmoji = () => {
    const emojis = ['💻', '👨‍💻', '👩‍💻', '🖥️', '📱', '🧑‍💻', '🔧', '🛠️', '📊', '📈', '💡', '🧩'];
    const availableEmojis = emojis.filter(emoji => !usedEmojis.has(emoji));

    if (availableEmojis.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableEmojis.length);
    const selectedEmoji = availableEmojis[randomIndex];
    usedEmojis.add(selectedEmoji);
    return selectedEmoji;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-blue-900">
      <Head>
        <title>CodeWise - Aprenda programação com tranquilidade</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 text-blue-600 transition-transform duration-300 transform hover:scale-105">CodeWise</h1>
          <p className="text-xl text-blue-700">Aprenda programação no seu ritmo, com serenidade e sabedoria</p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-blue-800">Cursos em Destaque</h2>

          {loading ? (
            <div className="bg-gray-300 h-32 rounded-lg animate-pulse"></div>
          ) : cursos.length > 0 ? (
            <div className="text-center mb-4">
              <Link href={`/cursos/${cursos[currentCourseIndex]?.id}`} className="inline-block transition-transform duration-300 transform hover:scale-110">
                <span className="text-6xl mb-4 inline-block transition-all duration-500 ease-in-out transform hover:scale-110">
                  {getRandomEmoji()}
                </span>
                <h3 className="text-2xl font-semibold text-blue-700">
                  {cursos.length > 0 ? cursos[currentCourseIndex]?.title : 'Curso Indisponível'}
                </h3>
              </Link>
            </div>
          ) : (
            <p className="text-lg text-gray-500">Nenhum curso disponível no momento.</p>
          )}
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-blue-800">Por que escolher a CodeWise?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Aprendizado Tranquilo', description: 'Ambiente sereno para melhor absorção do conteúdo', icon: '🧘' },
              { title: 'Suporte Personalizado', description: 'Mentoria individual para seu progresso', icon: '👨‍🏫' },
              { title: 'Projetos Práticos', description: 'Aplique seus conhecimentos em casos reais', icon: '🛠️' },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
                <span className="text-4xl mb-4 inline-block">{feature.icon}</span>
                <h3 className="text-xl font-semibold mb-2 text-blue-600">{feature.title}</h3>
                <p className="text-blue-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-blue-800">Comece sua jornada de aprendizado</h2>
          <p className="text-lg mb-8 text-blue-700">Descubra seu potencial e transforme sua carreira com a CodeWise</p>
          <a href="/cursos" className="bg-blue-600 text-white px-8 py-4 rounded-full text-xl font-bold inline-block transition-all duration-300 hover:bg-blue-500 hover:shadow-lg transform hover:-translate-y-1 hover:scale-105">
            Explorar Cursos
          </a>
        </section>

        <section className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-800">Depoimentos de Alunos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'Ana Silva', comment: 'A CodeWise mudou minha vida. O ambiente tranquilo de aprendizado me ajudou a focar e progredir rapidamente.' },
              { name: 'Carlos Oliveira', comment: 'Os projetos práticos da CodeWise me deram confiança para iniciar minha carreira como desenvolvedor.' },
            ].map((testimonial, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg">
                <p className="italic mb-2">"{testimonial.comment}"</p>
                <p className="font-semibold text-blue-600">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="text-center py-8 bg-blue-600 text-white mt-16">
        <p>&copy; 2023 CodeWise. Transformando vidas através da programação.</p>
      </footer>
    </div>
  );
}
