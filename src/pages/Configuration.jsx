import { UserRound, Lock, Palette, Camera, } from 'lucide-react'
import { logoutUser } from "../services/auth/authService";
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useRef } from 'react'

export default function Configuration() {
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const changeTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    const themes = [
        'valentine',
        'dark',
        'light',
    ]

    const handlePhoto = () => {
        console.log("JAJAJAJ AUN NO");
    }

    const logoutMutation = useMutation({
        mutationFn: logoutUser,

        onSuccess: () => {            
            navigate('/');
        },
    })

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6 ">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold">Configuración</h1>
                <p className="text-base-content/60">
                    Personaliza tu experiencia y administra tu cuenta.
                </p>
            </div>

            {/* USER CARD */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                    <div className="flex items-center gap-4">

                        <div className="relative w-20 h-20 shrink-0">
                            <div className="avatar avatar-online w-20 h-20">
                                <div className="w-20 rounded-full">
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPySnqxeKdKLTPzZFpDszmCg-e0NGSsFxqaw&s" />
                                </div>
                            </div>

                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhoto}
                                className="hidden"
                            />

                            <button
                                type="button"
                                className="absolute bottom-0 right-0 btn btn-primary btn-circle btn-xs z-10"
                                onClick={() => inputRef.current?.click()}
                            >
                                <Camera size={12} />
                            </button>
                        </div>

                        <div>
                            <h2 className="card-title">Josue Pérez</h2>
                            <p className="text-base-content/60">@Pookie</p>
                        </div>

                        <button className="btn btn-error ml-auto text-white" onClick={() => logoutMutation.mutate()}>
                            Cerrar sesion
                        </button>
                    </div>
                </div>
            </div>

            {/* PASSWORD */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2">
                                <Lock size={18} />
                                <h2 className="font-semibold">
                                    Contraseña
                                </h2>
                            </div>

                            <p className="text-sm text-base-content/60 mt-1">
                                Cambia o actualiza tu contraseña para mantener
                                tu cuenta segura.
                            </p>
                        </div>

                        <button className="btn btn-primary" onClick={() => navigate('/create-password')}>
                            Cambiar
                        </button>
                    </div>
                </div>
            </div>

            {/* THEME */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                    <div className="flex items-center gap-2">
                        <Palette size={18} />
                        <h2 className="font-semibold">
                            Tema de la aplicación
                        </h2>
                    </div>

                    <p className="text-sm text-base-content/60">
                        Selecciona el tema visual que prefieras.
                    </p>

                    <div className="dropdown w-full">
                        <div tabIndex={0} role="button" className="btn m-1">
                            Theme
                            <svg
                                width="12px"
                                height="12px"
                                className="inline-block h-2 w-2 fill-current opacity-60"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 2048 2048">
                                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                            </svg>
                        </div>
                        <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl">
                            {themes.map((theme) => (
                                <li key={theme}>
                                    <button
                                        className="btn btn-sm btn-ghost justify-start w-full"
                                        onClick={() => changeTheme(theme)}
                                    >
                                        {theme}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* SOMETHING */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequuntur, mollitia ut facilis suscipit reprehenderit perferendis omnis eaque sapiente libero optio commodi aliquam aliquid. Mollitia voluptatum nisi velit consequuntur id accusamus.
                </div>
            </div>
        </div>
    )
}