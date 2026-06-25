import React from 'react'
import { useNavigate } from 'react-router';

export default function Anniversary() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-base-300 flex items-center justify-center p-4">
            <div className="relative text-center max-w-2xl bg-base-100 rounded-lg shadow-lg p-8">
                <div className="absolute top-6 left-6 items-center flex flex-col">
                    <ChangeTheme />
                    <span className="text-xs opacity-70 whitespace-nowrap">
                        Modo oscuro
                    </span>
                </div>

                <h2 className="text-2xl font-bold mb-4">
                    <span className="text-red-500">❤️</span>
                    <span className="text-orange-500">Fe</span>
                    <span className="text-yellow-400">li</span>
                    <span className="text-green-500">z </span>
                    <span className="text-cyan-400">se</span>
                    <span className="text-violet-500">gu</span>
                    <span className="text-pink-500">nd</span>
                    <span className="text-red-500">o </span>
                    <span className="text-orange-500">me</span>
                    <span className="text-yellow-400">s</span>
                    <span className="text-pink-500">❤️</span>
                </h2>

                <p className="text-lg">La verdad la verdad, llevo casi todo el dia pensando en que escribir,
                    pero no se me ocurre nada, pero lo intente que siento que es lo que importa,
                    supongo. Babe, mi amor, te quiero mucho mucho muchísimo mi niña, se que dos meses pueden parecer muy poco,
                    pero para mi estos meses han significado mucho,
                    incluso desde antes de ser wovios,
                    la vdd, si me hubieran dicho hace tiempo que tu y yo seriamos noviecitos y que te estaría
                    haciendo una paginita escribiéndote algo wonito en nuestra (futura pronto) app para ti y para mi, jamás me lo hubiera imaginado,
                    incluso me hubiera reido porque ¿Cómo eso pasaría? y miranos,
                    aquí andamos ☺️☺️escribiendo algo wonito y haciendo una app para nosotros,
                    para mi y mi noviecita, para ti y tu noviecito, para nosotros mi amor, aun no esta terminada,
                    me tomo mucho tiempo hacer el chat, y me llevara mas tiempo hacer lo de los dibujos,
                    pero me tome el tiempo para que ya no tuviera errores y poderla subir a internet para poderte escribir esto.
                    Obviamente me gustaría que la distancia no existiera entre nosotros y poderte decir todo esto en persona,
                    me gustaría poder verte, abrazarte, darte besitos y mimos,
                    y hacer todas esas cosas que otras parejas pueden hacer sin problemas, los odio,
                    puta envidia cada vez que salgo y veo parejitas 😢🥺🥺.
                    Pero incluso con toda esta distancia entre nosotros, me siento muy afortunado de haberte encontrado de nuevo, de haberte conocido otra vez.
                    No nos hemos visto en casi 8 años ahora que volvimos a encontrarnos,
                    pero tengo muchas ganas de que llegue el dia en que eso cambie y podamos crear recuerdos que no sean solo a través de la pantalla,
                    muero por que llegue ese dia, muero por pedirte ser mi novia en persona aunque ya lo seamos,
                    muero por tomarte de la manita, muero por darnos nuestro primer beso,
                    muero por tener nuestra primera cita, muero por tener nuestras muchas primeras veces como parejita.
                    Eres lo mas bonito que me ha pasado en esta vida mi amor, eres muy divertida, adorable, tinky winky, y muy amorosa conmigo,
                    y eso me encanta, me encanta muchísimo 🥰 y deseo de todo corazon que sigas asi, y quiero ser asi contigo,
                    quiero que te sientas querida, amada, respetada y confiada conmigo, quiero que estes bien conmigo,
                    quiero estar bien contigo y quiero que estemos bien los dos,
                    mi noviecita ya me dijo algo similar ☺️☺️ "y quiero que podamos acompañarnos y mejorar juntitos, amo imaginar lo que sea, pero juntitos",
                    fak, me puse la canción de arcoíris de Ed Maverick de fondo mientras escribo esto, mala idea,
                    se que no me ves ni nada, pero ando lagrimeando mi amor, jamás me había sentido tan wonito por alguien,
                    y jamás me imagine que fueras tutututu, encerio te amo mi amor, quiero estar para ti siempre, en las buenas y en las malas,
                    quiero que entiendas que siempre puedes confiar en mi para lo que sea, ahora y siempre mi amor,
                    quiero que me des el tiempo para demostrártelo, quiero demostrarte que te amo.
                    Gracias por haber aparecido de nuevo en mi vida, Y gracias por estos dos meses.
                </p>
                <p className="text-xl font-bold text-primary mb-2 mt-6">💕💕 Te amo mucho Evelyn 💕💕</p>

                <button className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary-focus" onClick={() => navigate('/')}>
                    Vamonos de regreso a la app mi amor (aunque no sirva aun jiji) 😚😚
                </button>
            </div>
        </div>
    )
}

export function ChangeTheme() {
    const handleThemeChange = (e) => {
        const theme = e.target.checked ? 'dark' : 'valentine';

        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    return (
        <>
            <label className="swap swap-rotate" >
                {/* this hidden checkbox controls the state */}
                <input type="checkbox" onChange={handleThemeChange} />

                {/* sun icon */}
                <svg
                    className="swap-on h-10 w-10 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <path
                        d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                </svg>

                {/* moon icon */}
                <svg
                    className="swap-off h-10 w-10 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <path
                        d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                </svg>
            </label>
        </>
    )
}