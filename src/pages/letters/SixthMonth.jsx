import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import confetti from 'canvas-confetti';

var heart = confetti.shapeFromPath({
    path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
    matrix: [0.03333333333333333, 0, 0, 0.03333333333333333, -5.566666666666666, -5.533333333333333]
});

const COLORS = [
    "#FF6B9A", // Rosa chicle
    "#FF8FAB", // Rosa pastel intenso
    "#F472B6", // Pink 400
    "#EC4899", // Fucsia suave
    "#FB7185", // Coral rosado
    "#F59E8B", // Salmón
    "#FDBA74", // Durazno
    "#FACC15", // Amarillo cálido
    "#86EFAC", // Verde menta
    "#6EE7B7", // Turquesa pastel
    "#67E8F9", // Cian pastel
    "#7DD3FC", // Azul cielo
    "#93C5FD", // Azul pastel
    "#A5B4FC", // Índigo pastel
    "#C4B5FD", // Lavanda
    "#D8B4FE", // Lila
];

const triggerConfetti = () => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        shapes: [heart],
        colors: [color],
    });
    // Ráfagas laterales de confeti
    setTimeout(() => {
        confetti({
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: 0.1, y: 0.6 },
            shapes: [heart],
            colors: [color],
        });
        confetti({
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: 0.9, y: 0.6 },
            shapes: [heart],
            colors: [color],
        });
    }, 250);
};

export default function SixthMonth() {
    const navigate = useNavigate();

    useEffect(() => {
        triggerConfetti();
    }, []);

    return (
        <div className="min-h-screen bg-base-300 flex items-center justify-center p-4">
            <div className="relative text-center max-w-2xl bg-base-100 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">
                    <span className="text-red-500">❤️</span>
                    <span className="text-orange-500">Fe</span>
                    <span className="text-yellow-400">li</span>
                    <span className="text-green-500">z </span>
                    <span className="text-cyan-400">sex</span>
                    <span className="text-violet-500">to </span>
                    <span className="text-pink-500">mes </span>
                    <span className="text-red-500">jun</span>
                    <span className="text-orange-500">tos </span>
                    <span className="text-pink-500">❤️</span>
                </h2>

                <p className="text-lg">
                    Aloo mi amor, felish sexto mes juntos 😚❤️ la vdd que ya queria escribirte algo por aqui y crear algo nuevo, porque volver a este rinconcito que hice solo para ti y para mí, me recuerda por qué empecé a programarlo en primer lugar y lo mucho que significas para mi bby.

                    Ya son seis meses siendo wovios, medio año juntos y aunque todavía me da un buen de titesa y coraje y envidia y, yyy, y, no haber podido ecucharte en persona, darte besitos y mimos como se debe, no cambiaría por nada el haberte elegido a ti.

                    Se que estos últimos días han sido medio raros o difíciles para los dos, y sé que a veces te entra esa duda de si hago las cosas porque "tengo que" o como si fuera una tarea, y aprovechando que hoy cumplimos seis meses, te quería dejar por escrito aquí en nuestra app que estar contigo jamás va a ser una tarea para mí, te lo digo bien de corazon, te descuide, y eso esta mal, a mi en serio no me importa si el juego en sí no me vuelve loco o no me gusta, lo que a mi me encanta y me hace el día es escucharte reír, pasar ese ratito contigo y sentirte cerquita aunque estemos lejitos 😞, lo hago porque me nace, porque te extraño y porque eres mi persona favorita, nunca por obligación bby.

                    Aprecio cada cosita de ti, cuando me mandas audios, cuando jugamos, cuando me dices cosas wonitas y cuando simplemente estamos ahí haciéndonos compañía, encerio quiero que cumplamos muchos meses más y que por fin llegue el día en que podamos celebrar esto juntitos en persona, saliendo a todos lados sin pantallas, weno una nomas, una tv mientras comemos mucho tocino

                    No te rindas conmigo, te descuide y no es justo, yo aquí sigo y seguiré al cien contigo porque te amo muchísimo, más de lo que a veces sé explicar con palabras <br /> Feliz aniversario mi wowia hermosa 😚❤️.
                </p>

                <button type="button" className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary-focus hover:cursor-pointer" onClick={() => navigate(-1)}>
                    Wamonos de regreso 🫴
                </button>
            </div>
        </div>
    );
}
