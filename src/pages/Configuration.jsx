import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateInfo, getUserProfile } from '../services/user/userService';
import { Lock, Palette, Camera, Pencil } from 'lucide-react'
import { logoutUser } from "../services/auth/authService";
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useRef, useEffect } from 'react'
import Modal from '../components/Modal';
import { z } from 'zod';

export default function Configuration() {
    const inputRef = useRef(null);
    const modalRef = useRef(null);
    const navigate = useNavigate();

    const modalSubtitle = "Modifica tus datos visibles."

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

    const { data: profile } = useQuery({
        queryKey: ['userProfile'],
        queryFn: getUserProfile,
    });

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
                                    <img src={profile?.avatar_url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPySnqxeKdKLTPzZFpDszmCg-e0NGSsFxqaw&s"} alt="Avatar" />
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
                        <button type="button" className="absolute top-0 right-1 ml-4 mt-2 btn btn-primary btn-circle btn-xs z-10" onClick={() => modalRef.current.open()}>
                            <Pencil size={12} />
                        </button>
                        <div>

                            <h2 className="card-title">{profile?.display_name}</h2>
                            <p className="text-base-content/60">@{profile?.nickname}</p>
                        </div>

                        <button className="btn btn-error ml-auto text-white" onClick={() => logoutMutation.mutate()}>
                            Cerrar sesion
                        </button>

                        <Modal modalTitle="Actualizar información" modalSubtitle={modalSubtitle} ref={modalRef}>
                            <UpdateInfo onSuccess={() => modalRef.current?.close()} />
                        </Modal>
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
        </div>
    )
}

const updateInfoSchema = z.object({
    name: z.string().max(50, "No puede tener más de 50 caracteres").optional(),
    nickname: z.string().max(30, "No puede tener más de 30 caracteres").optional(),
})

export function UpdateInfo({ onSuccess }) {
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: zodResolver(updateInfoSchema)
    })

    const handleUpdateInfo = (data) => {
        updateInfoMutation.mutate(data);
    }

    const updateInfoMutation = useMutation({
        mutationFn: updateInfo,

        onSuccess: (result) => {
            queryClient.invalidateQueries({
                queryKey: ['userProfile']
            });
            // Cerrar el modal después de actualizar la información
            onSuccess?.();
        },

        onError: (error) => {
            console.error("Error al actualizar la información:", error);
        }
    })

    return (
        <form onSubmit={handleSubmit(handleUpdateInfo)} className="space-y-5" >
            <div className="space-y-4">
                {/* Nombre */}
                <div className="form-control">
                    <label className="label pb-2">
                        <span className="label-text font-medium">
                            Nombre
                        </span>
                    </label>

                    <input type="text" placeholder="Juan Gabriel" className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`} {...register("name")} />

                    {errors.name && (
                        <label className="label pt-1">
                            <span className="label-text-alt text-error">
                                {errors.name.message}
                            </span>
                        </label>
                    )}
                </div>

                {/* Apodo */}
                <div className="form-control">
                    <label className="label pb-2">
                        <span className="label-text font-medium">
                            Apodo
                        </span>
                    </label>

                    <input type="text" placeholder="XxJuanPro777xX" className={`input input-bordered w-full ${errors.nickname ? "input-error" : ""}`} {...register("nickname")} />

                    {errors.nickname && (
                        <label className="label pt-1">
                            <span className="label-text-alt text-error">
                                {errors.nickname.message}
                            </span>
                        </label>
                    )}
                </div>
            </div>

            <button type="submit" className="btn btn-neutral w-full">
                {updateInfoMutation.isPending ? (
                    <>
                        <span className="loading loading-spinner loading-sm" />
                        Guardando...
                    </>
                ) : (
                    "Guardar cambios"
                )}
            </button>
        </form>
    );
}