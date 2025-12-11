import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';

const ministryData = {
    kids: {
        title: "Vitória Kids",
        description: "Ensinando o caminho do Senhor desde os primeiros passos.",
        content: "No Vitória Kids, nossas crianças aprendem sobre o amor de Deus de uma maneira divertida e interativa. Temos salas separadas por idade com professores dedicados.",
        image: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=2669&auto=format&fit=crop",
        leaders: "Profeta Leandro e Profeta Carol"
    },
    operacionais: {
        title: "Operacionais",
        description: "Servindo com excelência para que tudo aconteça.",
        content: "A equipe Operacional é responsável pela organização, limpeza e suporte logístico de todos os cultos e eventos. Um trabalho essencial para o Reino.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1080&auto=format&fit=crop",
        leaders: "Profeta Johnny e Profeta Hila"
    },
    louvor: {
        title: "Louvor",
        description: "Adoração que rompe barreiras e toca o céu.",
        content: "O ministério de Louvor conduz a igreja em adoração profunda. Buscamos músicos e cantores comprometidos com a excelência e a unção.",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2670&auto=format&fit=crop",
        leaders: "Profeta Milena"
    },
    midia: {
        title: "Mídia",
        description: "Comunicando o Evangelho através da tecnologia e criatividade.",
        content: "O ministério de Mídia cuida de toda a transmissão, som, e projeção. Usamos ferramentas modernas para ampliar o alcance da mensagem de Cristo.",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1080&auto=format&fit=crop",
        leaders: "Pastor Leonardo e Pastora Linda"
    },
    intercessao: {
        title: "Intercessão",
        description: "Sustentando a igreja e as vidas através da oração constante.",
        content: "A oração é a base de tudo o que fazemos. O grupo de intercessão se reúne semanalmente para clamar por milagres, cura e avivamento.",
        image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1080&auto=format&fit=crop",
        leaders: "Pra Ivone"
    },
    recepcao: {
        title: "Recepção",
        description: "Recebendo cada vida com o amor de Cristo.",
        content: "O sorriso no rosto e o abraço acolhedor são a marca da nossa Recepção. Garantimos que todos se sintam em casa desde a chegada.",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop",
        leaders: "Pr Hiago e Pra Isabela"
    },
    welcome: {
        title: "Welcome",
        description: "Acompanhando novos convertidos e visitantes.",
        content: "O ministério Welcome é focado em integrar novas pessoas à família da igreja, garantindo que ninguém caminhe sozinho.",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1080&auto=format&fit=crop",
        leaders: "Evangelista Wagner"
    }
};

const MinistryDetail = () => {
    const { id } = useParams();
    const ministry = ministryData[id];

    if (!ministry) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Ministério não encontrado</h1>
                    <Link to="/" className="text-neon-blue hover:underline">Voltar para Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen">
            {/* Hero for Detail Page */}
            <div className="relative h-[50vh] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${ministry.image})` }}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">{ministry.title}</h1>
                    <p className="text-xl text-gray-300 max-w-2xl">{ministry.description}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-16">
                <Link to="/" className="inline-flex items-center text-neon-blue hover:text-white mb-8 transition-colors group">
                    <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar
                </Link>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 mb-12">
                    <h3 className="text-2xl font-bold text-white mb-4">Sobre o Ministério</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                        {ministry.content}
                    </p>

                    {ministry.leaders && (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                            <h4 className="text-neon-blue font-bold uppercase text-sm mb-2">Liderança</h4>
                            <p className="text-white font-medium">{ministry.leaders}</p>
                        </div>
                    )}

                    <Button variant="primary">
                        Quero servir neste ministério
                    </Button>
                </div>

                <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Quer fazer parte?</h3>
                    <p className="text-gray-400 mb-6">Procure a liderança no próximo culto ou entre em contato.</p>
                    <Link to="/#location" className="inline-block bg-neon-purple text-white font-bold py-3 px-8 rounded-lg hover:bg-neon-purple/80 transition-colors shadow-lg shadow-neon-purple/30">
                        Visite-nos
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MinistryDetail;
