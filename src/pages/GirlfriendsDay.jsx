import { useNavigate } from 'react-router';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

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

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}


export default function GirlfriendsDay() {
    const navigate = useNavigate();

    useEffect(() => {
        const duration = 180000; // 3 minutos
        const end = Date.now() + duration;

        const interval = setInterval(() => {
            if (Date.now() > end) {
                clearInterval(interval);
                return;
            }

            const color = COLORS[Math.floor(Math.random() * COLORS.length)];

            confetti({
                particleCount: 1,
                startVelocity: 0,
                ticks: 1000,

                origin: {
                    x: Math.random(),
                    y: -0.1
                },

                shapes: [heart],
                colors: [color],

                gravity: randomInRange(0.45, 0.65),
                drift: randomInRange(-0.3, 0.3),
                scalar: randomInRange(0.5, 2)
            });
        }, 220); // Un corazón cada 220 ms

        return () => clearInterval(interval);
    }, []);


    return (
        <div className="min-h-screen bg-base-300 flex items-center justify-center p-4">
            <div className="relative text-center max-w-2xl bg-base-100 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">
                    <span className="text-red-500">❤️</span>
                    <span className="text-orange-500">Fe</span>
                    <span className="text-yellow-400">li</span>
                    <span className="text-green-500">z </span>
                    <span className="text-cyan-400">di</span>
                    <span className="text-violet-500">a </span>
                    <span className="text-pink-500">de </span>
                    <span className="text-red-500">la </span>
                    <span className="text-orange-500">no</span>
                    <span className="text-yellow-400">vi</span>
                    <span className="text-pink-500">a❤️</span>
                </h2>

                <p className="text-lg">Hoola mi niña, felish dia de la wowia 😚😚,
                    faak bby, desde que me dijiste esho del dia de la wowia me puse a pensar que hasher,
                    y la vdd no se me ocurrio nadaaa, queria mandarte coshitas a ti tambien, pero la vdd no tengo con que right now,
                    pero shi o shi te mando algo algun dia, dame chancita, pero por ahorita te dejo esta notita que es lo que puedo hacer
                    ahora ntp, tambien queria decirte que neta me encanta estar contigo bby, aunque sea de lejitos mi amor, eres la mejor,
                    y siempre voy a tratar de estar para ti en lo que pueda, y aunque aveces no te lo diga, me encanta cuando me mandas beshitos 😚,
                    y cuando me dices cosas wonitas 🥺, y cuando me mandas nudes 🤤, la verdad es que me encanta tooodo TODO de ti,
                    y shi, eso era lo que queria decirte, que me encanta estar contigo y que siempre voy a tratar de estar para ti en lo que pueda,
                    y que te amo mucho bb, esperemos que para el proximo 1 de agosto lo podamos celebrar juntitos y vernos mi niña, no sabes cuanto deseo
                    ir contigo a todos lados, hacer picnics en momentos como este, darte besitos, darte mimos, y sobaditas de cli,
                    quiero salir contigo a tu parque favorito 🥺, ir a la pizzeria que te gusta y que me expliques a detalle el porque, quiero
                    salir contigo y andarnos riendo en la calle por las cosas random que nos pasen como cuando sales con tu hermano,
                    quiero mimir contigo abashaditos para que no tengas tanto miedo 🥺, no sabes cuanto me gustaria poder estar
                    contigo en estos momentos bb 🥺, pero espero que muy pronto estemos juntitos, y haremos muchas cositas juntos,
                    que juguemos roblox juntitos en la bed, o al Minecraft, o a los juegos de papa's 🥺, o a la mama y al papa, pero sin niños 😊,
                    ya quiero ver tu linda sonritsita de cerquitas y darnos muchos piquitos y estar abashaditos todo el tiempo mi amor,
                    te amo demaciado demaciado demaciado, y quiero hacerte el amor y hacerte lo que mas te guste mi niña 🤤, hacerte lo que mas te guste mi niña,
                    hacerte el combo de lengua y dedos que tanto te mereces nomas por bonita preciosa guapa😊😚, porfavor permiteme estar contigo un ratito, como de aqui
                    hasta la muerte, idk, y mas cositas que se me escapan rn, pero eso no es lo importante bby, lo importante es que te amo mucho y que
                    espero que esta notita te saque esa sonrisita que tanto me gusta, me has hecho demaciado feliz durante todos estos meses,
                    te mando muchos beshitos mi amor, felish dia, deseo estar contigo rn 😓.
                </p>

                {/* <p className="text-xl font-bold text-primary mb-2 mt-6">💕 Te amo mucho Evelyn 💕</p> */}

                <button type="button" className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary-focus hover:cursor-pointer" onClick={() => navigate(-1)}>
                    Vamonos de regreso wonita 🫴
                </button>
            </div>
        </div>
    )
}
