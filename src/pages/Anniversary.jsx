import React from 'react'
import { useNavigate } from 'react-router';

export default function Anniversary() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-base-300 flex items-center justify-center p-4">
            <div className="relative text-center max-w-2xl bg-base-100 rounded-lg shadow-lg p-8">
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

                <button className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary-focus hover:cursor-pointer" onClick={() => navigate(-1)}>
                    Vamonos de regreso a la app mi amor 😚😚
                </button>
            </div>
        </div>
    )
}