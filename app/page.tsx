import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Globe, CheckCircle, Smartphone, Star, Play, Crown, Volume2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ThaiLearn - Apprenez le Thaï Facilement et Gratuitement',
  description: 'Rejoignez des milliers de personnes qui apprennent le thaï gratuitement. Leçons interactives, jeux, prononciation audio, et plus encore. Disponible sur mobile et web.',
  keywords: ['apprendre thaï', 'thaïlandais', 'leçons thaï', 'alphabet thaï', 'gratuit', 'méthode d\'apprentissage', 'thailandais', 'cours de thai'],
  openGraph: {
    title: 'ThaiLearn - Apprenez le Thaï Facilement et Gratuitement',
    description: 'La méthode d\'apprentissage du thaï interactive et gratuite la plus simple.',
    type: 'website',
    locale: 'fr_FR',
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800">
      
      {/* Navbar */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center max-w-6xl mx-auto z-10 w-full">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-md border-b-4 border-emerald-700">
            <BookOpen size={28} />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-800">ThaiLearn</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-800 leading-[1.1] mb-6 drop-shadow-sm">
              Apprenez le <span className="text-emerald-500">Thaï</span> de la bonne façon.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto md:mx-0 font-medium leading-relaxed">
              La méthode la plus amusante, efficace et gratuite pour apprendre le thaïlandais. Parlez dès le premier jour, pratiquez l&apos;écriture et maîtrisez l&apos;alphabet étape par étape.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link 
                href="/learn"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 pb-5 rounded-2xl font-bold text-lg border-b-4 border-emerald-700 hover:-translate-y-1 active:translate-y-1 active:border-b-0 transition-all shadow-lg flex items-center justify-center uppercase tracking-wider"
              >
                Commencer l&apos;apprentissage
              </Link>
            </div>
            
            <div className="mt-8 flex items-center justify-center md:justify-start gap-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
              <Star className="text-amber-400 fill-amber-400" size={18} />
              Totalement Gratuit
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              Sans Pubs
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-md relative flex justify-center">
            {/* Mockup or Illustration Placeholder */}
            <div className="relative w-full aspect-[4/5] bg-white rounded-[3rem] shadow-2xl border-[8px] border-slate-100 overflow-hidden flex flex-col pt-8 px-6 transform rotate-2 md:rotate-3 hover:rotate-1 transition-transform duration-500">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-100 rounded-b-3xl"></div>
              
              {/* App UI fragment to show how it looks */}
              <div className="flex items-center justify-between mb-8">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-500 rounded-xl flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div className="flex items-center gap-1 text-rose-500 font-bold">
                  <Star size={16} className="fill-rose-500" />
                  250 XP
                </div>
              </div>
              
              <div className="bg-emerald-500 text-white rounded-3xl p-6 mb-6 shadow-md border-b-4 border-emerald-700 relative overflow-hidden">
                <h3 className="font-extrabold text-2xl relative z-10">Unité 1 : Les bases</h3>
                <p className="text-emerald-100 mt-2 font-medium relative z-10">Commencez votre voyage en thaï !</p>
                <BookOpen size={100} className="absolute -bottom-6 -right-6 text-black opacity-10" />
              </div>
              
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="w-20 h-20 bg-emerald-400 rounded-[2rem] border-b-4 border-emerald-600 flex justify-center items-center text-white scale-110">
                  <Crown fill="currentColor" size={32} />
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-8 w-full max-w-[12rem] mx-auto opacity-40">
                <div className="w-full h-4 bg-emerald-500 rounded-full"></div>
              </div>
              
            </div>
            
            {/* Floating elements */}
            <div className="absolute -left-12 top-20 bg-white p-4 pb-5 rounded-2xl shadow-xl border-2 border-slate-100 border-b-4 border-b-slate-200 animate-bounce" style={{ animationDuration: '3s' }}>
              <span className="text-3xl">🇹🇭</span>
            </div>
            <div className="absolute -right-8 bottom-32 bg-amber-400 text-white p-4 pb-5 rounded-2xl shadow-xl border-b-4 border-amber-600 font-black flex items-center gap-2 transform rotate-12">
              <Star className="fill-white" size={24} />
              +50 XP
            </div>
          </div>
          
        </div>
      </section>

      {/* Exercise Showcase Section */}
      <section className="bg-slate-50 py-24 border-t border-slate-200 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-800">Une méthode complète et variée</h2>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium">Ne vous ennuyez jamais avec une multitude d&apos;exercices conçus pour améliorer chaque aspect de votre apprentissage du thaï.</p>
          </div>

          <div className="flex flex-col gap-24">
            
            {/* Showcase 1: Pair Matching */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
                  <div className="bg-indigo-100 text-indigo-500 p-2 rounded-xl">
                    <CheckCircle size={24} />
                  </div>
                  Relier les paires
                </h3>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  Apprenez le vocabulaire en associant les mots thaïlandais à leur traduction. Avec ou sans l&apos;audio, avec ou sans le texte. Relevez le défi pour muscler votre mémoire.
                </p>
              </div>
              <div className="flex-1 w-full max-w-md bg-white p-6 rounded-[2.5rem] shadow-xl border-[6px] border-slate-100 transform rotate-1 hover:rotate-0 transition-all">
                <div className="grid grid-cols-2 gap-3">
                  {/* Left column / Right Column */}
                  <div className="bg-white p-4 rounded-xl border-2 border-slate-200 border-b-4 text-center font-bold text-slate-700 shadow-sm flex items-center justify-center min-h-[4.5rem]">deux mois</div>
                  <div className="bg-white p-4 rounded-xl border-2 border-slate-200 border-b-4 text-center font-bold text-slate-700 shadow-sm flex items-center justify-center min-h-[4.5rem] text-xl">สอง</div>
                  <div className="bg-white p-4 rounded-xl border-2 border-slate-200 border-b-4 text-center font-bold text-slate-700 shadow-sm flex items-center justify-center min-h-[4.5rem]">deux</div>
                  <div className="bg-white p-4 rounded-xl border-2 border-slate-200 border-b-4 text-center font-bold text-slate-700 shadow-sm flex items-center justify-center min-h-[4.5rem] text-xl">หนึ่งปี</div>
                  <div className="bg-white p-4 rounded-xl border-2 border-slate-200 border-b-4 text-center font-bold text-slate-700 shadow-sm flex items-center justify-center min-h-[4.5rem]">un an</div>
                  <div className="bg-white p-4 rounded-xl border-2 border-slate-200 border-b-4 text-center font-bold text-slate-700 shadow-sm flex items-center justify-center min-h-[4.5rem] text-xl">สองเดือน</div>
                  <div className="bg-slate-100 p-4 rounded-xl border-2 border-slate-200 text-center font-bold text-slate-400 flex items-center justify-center min-h-[4.5rem] opacity-50">dix</div>
                  <div className="bg-indigo-100 p-4 rounded-xl border-2 border-indigo-300 border-b-4 text-center font-bold text-indigo-600 shadow-sm flex items-center justify-center min-h-[4.5rem] text-xl animate-pulse">สิบ</div>
                </div>
              </div>
            </div>

            {/* Showcase 2: Sentence Building */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
                  <div className="bg-fuchsia-100 text-fuchsia-500 p-2 rounded-xl">
                    <BookOpen size={24} />
                  </div>
                  Construire des phrases
                </h3>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  Ne vous limitez pas à du vocabulaire. Apprenez très vite à produire vos propres phrases en assemblant les mots dans le bon ordre.
                </p>
              </div>
              <div className="flex-1 w-full max-w-lg bg-white p-8 rounded-[2.5rem] shadow-xl border-[6px] border-slate-100 transform -rotate-1 hover:rotate-0 transition-all">
                <div className="flex items-start gap-4 mb-6">
                   <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl">
                     🧠
                   </div>
                   <div>
                     <h4 className="text-2xl font-bold text-slate-800">Traduisez cette phrase</h4>
                     <p className="text-lg text-slate-600 mt-1">bonjour (femme)</p>
                   </div>
                </div>

                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 mb-8">
                  <div className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2">
                    💡 VOCABULAIRE UTILE :
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"><span className="text-emerald-600 font-bold">ค่ะ</span> <span className="text-slate-400 opacity-60 ml-1">= particule femme</span></div>
                    <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"><span className="text-emerald-600 font-bold">ออก</span> <span className="text-slate-400 opacity-60 ml-1">= sortir</span></div>
                    <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"><span className="text-emerald-600 font-bold">ใหญ่</span> <span className="text-slate-400 opacity-60 ml-1">= grand</span></div>
                    <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"><span className="text-emerald-600 font-bold">สวัสดี</span> <span className="text-slate-400 opacity-60 ml-1">= bonjour</span></div>
                  </div>
                </div>

                <div className="border-t-2 border-b-2 border-slate-100 py-6 mb-8 min-h-[6rem] flex items-center justify-center gap-2">
                   <span className="text-slate-400 font-medium tracking-wide">Formez la phrase ici...</span>
                   <div className="text-slate-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                   </div>
                </div>

                <div className="flex gap-3 justify-center">
                   <div className="bg-white p-4 rounded-xl border-2 border-slate-200 border-b-4 text-center font-bold text-slate-700 shadow-sm hover:-translate-y-1 transition-transform cursor-pointer text-xl min-w-[3.5rem]">ค่ะ</div>
                   <div className="bg-white p-4 rounded-xl border-2 border-slate-200 border-b-4 text-center font-bold text-slate-700 shadow-sm hover:-translate-y-1 transition-transform cursor-pointer text-xl min-w-[3.5rem]">ออก</div>
                   <div className="bg-white p-4 rounded-xl border-2 border-slate-200 border-b-4 text-center font-bold text-slate-700 shadow-sm hover:-translate-y-1 transition-transform cursor-pointer text-xl min-w-[3.5rem]">ใหญ่</div>
                   <div className="bg-white p-4 rounded-xl border-2 border-slate-200 border-b-4 text-center font-bold text-slate-700 shadow-sm hover:-translate-y-1 transition-transform cursor-pointer text-xl min-w-[3.5rem]">สวัสดี</div>
                </div>
              </div>
            </div>

            {/* Showcase 3: Audio comprehension */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
                  <div className="bg-sky-100 text-sky-500 p-2 rounded-xl">
                    <Volume2 size={24} />
                  </div>
                  Compréhension Orale
                </h3>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  Le thaï est une langue tonale. Éduquez votre oreille avec nos exercices de compréhension orale 100% audio, et choisissez la bonne réponse parmi plusieurs options.
                </p>
              </div>
              <div className="flex-1 w-full max-w-md bg-white p-6 rounded-[2.5rem] shadow-xl border-[6px] border-slate-100 transform rotate-1 hover:rotate-0 transition-all flex flex-col items-center">
                <div className="w-24 h-24 bg-sky-500 rounded-3xl mb-8 flex items-center justify-center text-white border-b-[6px] border-sky-700 shadow-lg animate-pulse" style={{ animationDuration: '3s' }}>
                  <Volume2 size={48} />
                </div>
                
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="bg-white p-4 rounded-xl border-2 border-slate-200 border-b-4 text-center font-bold text-slate-700 hover:-translate-y-1 transition-all cursor-pointer">
                    Chat
                  </div>
                  <div className="bg-white p-4 rounded-xl border-2 border-slate-200 border-b-4 text-center font-bold text-slate-700 hover:-translate-y-1 transition-all cursor-pointer">
                    Chien
                  </div>
                  <div className="bg-sky-100 p-4 rounded-xl border-2 border-sky-400 border-b-4 text-center font-bold text-sky-700 scale-105 shadow-sm transition-all cursor-pointer">
                    Oiseau
                  </div>
                  <div className="bg-white p-4 rounded-xl border-2 border-slate-200 border-b-4 text-center font-bold text-slate-700 hover:-translate-y-1 transition-all cursor-pointer">
                    Poisson
                  </div>
                </div>
              </div>
            </div>

            {/* Showcase 4: Writing/Alphabet */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
                  <div className="bg-rose-100 text-rose-500 p-2 rounded-xl">
                    <Smartphone size={24} />
                  </div>
                  Écrire des mots
                </h3>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  Pratiquez l'orthographe en assemblant les bonnes consonnes et voyelles pour former des mots complets en thaï. Une aide intelligente est à votre disposition en cas de difficulté.
                </p>
              </div>
              <div className="flex-1 w-full max-w-lg bg-white p-8 rounded-[2.5rem] shadow-xl border-[6px] border-slate-100 transform -rotate-1 hover:rotate-0 transition-all flex flex-col">
                
                <div className="flex items-start gap-4 mb-6">
                   <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl">
                     ✍️
                   </div>
                   <div>
                     <h4 className="text-2xl font-bold text-slate-800">Écrivez ce mot en thaï</h4>
                     <p className="text-lg text-slate-600 mt-1">un</p>
                     <p className="text-sm font-mono text-slate-500 mt-1">[<span className="bg-amber-100 text-amber-700 px-1 rounded">n</span>ùeng]</p>
                   </div>
                </div>

                <div className="flex gap-2 mb-6">
                  <div className="bg-slate-50 px-6 py-4 rounded-2xl border-2 border-slate-200 flex items-center justify-center gap-1">
                    <span className="text-3xl text-orange-500 font-bold">ห</span>
                    <span className="text-3xl text-slate-300 font-bold opacity-50">น เ ่ ง</span>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8 text-orange-800 text-sm flex gap-3 items-start shadow-sm">
                   <span className="text-lg">💡</span> Consonne 'h' (Ho Nam). Ici, elle sera muette et modifiera le ton de la consonne suivante.
                </div>

                <div className="border-t-2 border-b-2 border-slate-100 py-6 mb-8 flex items-center justify-center">
                   <span className="text-slate-400 font-medium">Écrivez ici...</span>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                   <div className="bg-white w-12 h-14 rounded-xl border-2 border-slate-200 border-b-4 text-center font-bold text-slate-700 shadow-sm flex items-center justify-center text-2xl hover:-translate-y-1 transition-transform cursor-pointer">น</div>
                   <div className="bg-white w-12 h-14 rounded-xl border-2 border-slate-200 border-b-4 text-center font-bold text-slate-700 shadow-sm flex items-center justify-center text-2xl hover:-translate-y-1 transition-transform cursor-pointer">ง</div>
                   <div className="bg-white w-12 h-14 rounded-xl border-2 border-slate-200 border-b-4 text-center font-bold text-slate-700 shadow-sm flex items-center justify-center text-2xl hover:-translate-y-1 transition-transform cursor-pointer">เ่</div>
                   <div className="bg-slate-100 w-12 h-14 rounded-xl border-2 border-slate-200 text-center font-bold text-slate-400 flex items-center justify-center text-2xl opacity-50">ห</div>
                   <div className="bg-white w-12 h-14 rounded-xl border-2 border-slate-200 border-b-4 text-center font-bold text-slate-700 shadow-sm flex items-center justify-center text-2xl hover:-translate-y-1 transition-transform cursor-pointer">-</div>
                   <div className="bg-slate-100 w-12 h-14 rounded-xl border-2 border-slate-200 text-center text-slate-400 flex items-center justify-center">⌫</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="bg-emerald-500 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Près de 1000 mots et phrases classés</h2>
          <p className="text-emerald-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Une base de données riche et étudiée, pensée pour vous faire progresser des bases jusqu'aux discussions avancées.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-24 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Pourquoi choisir ThaiLearn ?</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Notre méthode interactive se concentre sur ce dont vous avez besoin pour communiquer rapidement.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Play size={32} className="text-emerald-500 fill-emerald-500" />}
              color="bg-emerald-100"
              title="Apprentissage par le jeu"
              text="Associez, complétez et construisez des phrases courtes de manière interactive pour retenir le vocabulaire sans effort."
            />
            <FeatureCard 
              icon={<Globe size={32} className="text-indigo-500" />}
              color="bg-indigo-100"
              title="Phonétique & Audio"
              text="Chaque mot possède une prononciation au format phonétique et audio de haute qualité avec les accents justes."
            />
            <FeatureCard 
              icon={<Smartphone size={32} className="text-rose-500" />}
              color="bg-rose-100"
              title="L'écriture facilitée"
              text="Apprenez à orthographier vos premiers mots en sélectionnant visuellement les consonnes et voyelles appropriées."
            />
          </div>
        </div>
      </section>
      
      {/* Bottom CTA */}
      <section className="bg-slate-800 text-white py-24 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 relative z-10 text-white">Apprenez le thaï dès maintenant.</h2>
        <p className="text-xl text-slate-300 mb-10 max-w-xl mx-auto relative z-10 font-medium">Rejoignez-nous et commencez l'Unité 1. Mettez-vous directement dans le bain, aucune inscription requise pour commencer !</p>
        <Link 
          href="/learn"
          className="inline-flex w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-5 pb-6 rounded-2xl font-black text-xl border-b-[6px] border-emerald-700 hover:-translate-y-1 active:translate-y-1 active:border-b-0 transition-all shadow-xl items-center justify-center uppercase tracking-widest relative z-10"
        >
          C'est parti !
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-500 py-8 text-center text-sm font-medium">
        <p>© {new Date().getFullYear()} ThaiLearn. Apprendre le thaï n'a jamais été aussi facile.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, text, color }: { icon: React.ReactNode, title: string, text: string, color: string }) {
  return (
    <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100 flex flex-col items-center text-center hover:border-emerald-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border-b-4 border-slate-200/50 ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-800">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium">{text}</p>
    </div>
  );
}
