import { Lock, Palette, Camera, Pencil, User, AtSign, Trash2, MapPin, ChevronDown, Check, Sun, Moon } from 'lucide-react';
import { updateInfo, getUserProfile, uploadAvatar, deleteAvatar } from '../../services/user/userService';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { touchHover, tapFeedback, mobileSpring } from '@/utils/motion';
import { requestLocationPermission } from '../../utils/geolocation';
import { setCurrentLocation } from '../../services/geolocation';
import { logoutUser } from "../../services/auth/authService";
import { motion, AnimatePresence } from 'motion/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
};

const headerVariants = {
    hidden: { opacity: 0, y: -12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 380,
            damping: 28,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 360,
            damping: 26,
        },
    },
};

export default function Configuration() {
    const modalRef = useRef(null);
    const alertRef = useRef(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem('theme') || 'valentine';
    });
    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const themeDropdownRef = useRef(null);

    const [locationPermission, setLocationPermission] = useState("prompt");

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, [currentTheme]);

    useEffect(() => {
        let active = true;
        let permissionObj = null;

        async function checkPermission() {
            if (!navigator.permissions) return;

            try {
                const permission = await navigator.permissions.query({
                    name: "geolocation",
                });

                if (!active) return;
                setLocationPermission(permission.state);
                permissionObj = permission;

                permission.onchange = () => {
                    if (active) setLocationPermission(permission.state);
                };
            } catch (error) {
                console.error("Error al verificar permisos de localización:", error);
            }
        }

        checkPermission();

        return () => {
            active = false;
            if (permissionObj) {
                permissionObj.onchange = null;
            }
        };
    }, []);

    const handleEnableLocation = () => {
        requestLocationPermission(
            (position) => {
                setLocationPermission("granted");
                setCurrentLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy_meters: position.coords.accuracy
                }).catch((error) => {
                    console.error("Error al guardar ubicación al conceder permiso:", error);
                });
            },
            (error) => {
                if (error.code === 1) { // PERMISSION_DENIED
                    setLocationPermission("denied");
                }
            }
        );
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
                setIsThemeOpen(false);
            }
        };

        if (isThemeOpen) {
            window.addEventListener('pointerdown', handleClickOutside);
        }

        return () => {
            window.removeEventListener('pointerdown', handleClickOutside);
        };
    }, [isThemeOpen]);

    const changeTheme = (theme) => {
        localStorage.setItem('theme', theme);
        setCurrentTheme(theme);
        setIsThemeOpen(false);
    };

    const themes = [
        { id: 'valentine', label: 'Valentine', icon: Sun },
        { id: 'dark', label: 'Oscuro', icon: Moon },
    ];

    const uploadAvatarMutation = useMutation({
        mutationFn: uploadAvatar,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['userProfile']
            });
        },
        onError: (error) => {
            console.error("Error al subir el avatar:", error);
            alertRef.current?.open({
                type: 'danger',
                title: 'Error al subir la imagen',
                message: error.message || 'Ocurrió un error al subir el avatar.'
            });
        }
    });

    const deleteAvatarMutation = useMutation({
        mutationFn: deleteAvatar,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['userProfile']
            });
        },
        onError: (error) => {
            console.error("Error al eliminar el avatar:", error);
            alertRef.current?.open({
                type: 'danger',
                title: 'Error al eliminar la imagen',
                message: error.message || 'Ocurrió un error al eliminar el avatar.'
            });
        }
    });

    const isAvatarPending = uploadAvatarMutation.isPending || deleteAvatarMutation.isPending;

    const logoutMutation = useMutation({
        mutationFn: logoutUser,

        onSuccess: () => {
            queryClient.clear();
            navigate('/');
        },
    })

    const { data: profile } = useQuery({
        queryKey: ['userProfile'],
        queryFn: getUserProfile,
    });

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={pageVariants}
            className="max-w-2xl mx-auto p-4 space-y-6"
        >

            {/* HEADER */}
            <motion.div
                variants={headerVariants}
                className="space-y-1 py-2 text-center md:text-left"
            >
                <div className='flex items-center justify-center'>
                    <Title />
                </div>
                <p className="text-sm text-base-content/60 text-center">
                    Personaliza tu rincón y administra tu cuenta.
                </p>
            </motion.div>

            {/* USER CARD */}
            <motion.div
                variants={cardVariants}
                whileHover={touchHover({ y: -2 })}
                transition={mobileSpring}
                className="card bg-base-100 rounded-3xl border border-base-200/50 shadow-sm"
            >
                <div className="card-body p-5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            {/* AVATAR */}
                            <div className="avatar avatar-online w-14 h-14 ring-2 ring-primary/10 rounded-full overflow-hidden shadow-inner shrink-0 relative">
                                <img
                                    src={profile?.avatar_url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPySnqxeKdKLTPzZFpDszmCg-e0NGSsFxqaw&s"}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                                {isAvatarPending && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="loading loading-spinner loading-sm text-white" />
                                    </div>
                                )}
                            </div>

                            {/* NAME & NICKNAME */}
                            <div className="min-w-0">
                                <h2 className="text-base font-bold text-base-content truncate">{profile?.display_name || "Cosa Linda"}</h2>
                                <p className="text-xs text-base-content/50 truncate">@{profile?.nickname || "nickname"}</p>
                            </div>
                        </div>

                        {/* ACTIONS ROW */}
                        <div className="flex items-center gap-2 shrink-0">
                            <motion.button
                                whileHover={touchHover({ scale: 1.05 })}
                                whileTap={tapFeedback.button}
                                transition={mobileSpring}
                                className="btn btn-sm btn-ghost gap-1.5 text-primary text-xs font-semibold px-3 rounded-xl bg-primary/5 active:bg-primary/10"
                                type="button"
                                onClick={() => modalRef.current?.open()}
                                disabled={isAvatarPending}
                            >
                                <Pencil size={12} />
                                Editar
                            </motion.button>

                            <motion.button
                                type="button"
                                whileHover={touchHover({ scale: 1.05 })}
                                whileTap={tapFeedback.button}
                                transition={mobileSpring}
                                className="btn btn-sm btn-ghost text-error/70 active:text-error active:bg-error/10 hover:bg-error/5 rounded-xl font-medium text-xs px-3"
                                onClick={() => logoutMutation.mutate()}
                                disabled={logoutMutation.isPending}
                            >
                                {logoutMutation.isPending ? (
                                    <span className="loading loading-spinner loading-xs" />
                                ) : (
                                    "Cerrar sesión"
                                )}
                            </motion.button>
                        </div>
                    </div>

                    <Modal modalTitle="Editar Perfil" modalSubtitle="Modifica tus datitos de perfil y fotito." ref={modalRef} className="max-w-md">
                        <UpdateInfo
                            profile={profile}
                            isAvatarPending={isAvatarPending}
                            onUploadPhoto={(file) => uploadAvatarMutation.mutate(file)}
                            onDeletePhoto={() => deleteAvatarMutation.mutate()}
                            onSuccess={() => modalRef.current?.close()}
                        />
                    </Modal>
                </div>
            </motion.div>

            {/* PASSWORD */}
            <motion.div
                variants={cardVariants}
                whileHover={touchHover({ y: -2 })}
                transition={mobileSpring}
                className="card bg-base-100 rounded-3xl border border-base-200/50 shadow-sm"
            >
                <div className="card-body p-6 flex flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-warning/10 text-warning shrink-0">
                            <Lock size={20} />
                        </div>
                        <div>
                            <h2 className="font-semibold text-base text-base-content">
                                Contraseña
                            </h2>
                            <p className="text-xs text-base-content/50 mt-0.5">
                                Cambia tu contraseña para mantener tu cuenta segura.
                            </p>
                        </div>
                    </div>

                    <motion.button
                        type="button"
                        whileHover={touchHover({ scale: 1.05 })}
                        whileTap={tapFeedback.button}
                        transition={mobileSpring}
                        className="btn btn-primary btn-sm rounded-full px-5 font-semibold text-xs"
                        onClick={() => navigate('/create-password')}
                    >
                        Cambiar
                    </motion.button>
                </div>
            </motion.div>

            {/* THEME */}
            <motion.div
                variants={cardVariants}
                whileHover={touchHover({ y: -2 })}
                transition={mobileSpring}
                className={`card bg-base-100 rounded-3xl border border-base-200/50 shadow-sm relative ${
                    isThemeOpen ? 'z-30' : 'z-10'
                }`}
            >
                <div className="card-body p-6 flex flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-info/10 text-info shrink-0">
                            <Palette size={20} />
                        </div>
                        <div>
                            <h2 className="font-semibold text-base text-base-content">
                                Tema de la aplicación
                            </h2>
                            <p className="text-xs text-base-content/50 mt-0.5">
                                Selecciona el tema visual que prefieras.
                            </p>
                        </div>
                    </div>

                    <div className="relative shrink-0" ref={themeDropdownRef}>
                        <motion.button
                            type="button"
                            onClick={() => setIsThemeOpen(prev => !prev)}
                            whileHover={touchHover({ scale: 1.03 })}
                            whileTap={tapFeedback.button}
                            transition={mobileSpring}
                            aria-expanded={isThemeOpen}
                            aria-haspopup="listbox"
                            className="btn btn-sm px-3.5 font-semibold text-xs capitalize flex items-center gap-2 rounded-2xl bg-base-200/80 hover:bg-base-200 border-base-300/50 shadow-sm transition-colors"
                        >
                            <span className="flex items-center gap-1.5">
                                {currentTheme === 'dark' ? (
                                    <Moon size={14} className="text-secondary" />
                                ) : (
                                    <Sun size={14} className="text-primary" />
                                )}
                                <span>{currentTheme}</span>
                            </span>
                            <motion.span
                                animate={{ rotate: isThemeOpen ? 180 : 0 }}
                                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
                                className="flex items-center"
                            >
                                <ChevronDown size={14} className="opacity-60" />
                            </motion.span>
                        </motion.button>

                        <AnimatePresence>
                            {isThemeOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -6, filter: 'blur(4px)' }}
                                    animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, scale: 0.95, y: -4, filter: 'blur(4px)' }}
                                    transition={{
                                        duration: 0.2,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                    className="absolute right-0 top-full mt-2 w-52 p-1.5 rounded-2xl bg-base-100/95 backdrop-blur-md border border-base-200 shadow-xl z-50 overflow-hidden"
                                >
                                    <div className="px-2.5 py-1.5 text-[10px] font-bold tracking-wider uppercase text-base-content/40">
                                        Selecciona un tema
                                    </div>
                                    <div className="space-y-1">
                                        {themes.map((theme) => {
                                            const isSelected = currentTheme === theme.id;
                                            const ThemeIcon = theme.icon;
                                            return (
                                                <motion.button
                                                    key={theme.id}
                                                    type="button"
                                                    onClick={() => changeTheme(theme.id)}
                                                    whileHover={{ scale: 1.01, x: 2 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                                                        isSelected
                                                            ? 'bg-primary/10 text-primary font-medium'
                                                            : 'hover:bg-base-200/60 text-base-content/80'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`p-1.5 rounded-lg ${
                                                            isSelected ? 'bg-primary/20 text-primary' : 'bg-base-200 text-base-content/60'
                                                        }`}>
                                                            <ThemeIcon size={14} />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-medium leading-tight">
                                                                {theme.label}
                                                            </div>                                        
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={mobileSpring}
                                                        >
                                                            <Check size={14} className="text-primary mr-1" />
                                                        </motion.div>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* LOCATION PERMISSION */}
            <motion.div
                variants={cardVariants}
                whileHover={touchHover({ y: -2 })}
                transition={mobileSpring}
                className="card bg-base-100 rounded-3xl border border-base-200/50 shadow-sm"
            >
                <div className="card-body p-6 flex flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-secondary/10 text-secondary shrink-0">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h2 className="font-semibold text-base text-base-content">
                                Permiso de localización
                            </h2>
                            <p className="text-xs text-base-content/50 mt-0.5">
                                Habilita el acceso a tu ubicación para usar el mapa.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {locationPermission === "granted" && (
                            <span className="badge badge-success gap-1 font-semibold p-3 text-xs">
                                Permitido
                            </span>
                        )}
                        {locationPermission === "prompt" && (
                            <motion.button
                                whileHover={touchHover({ scale: 1.05 })}
                                whileTap={tapFeedback.button}
                                transition={mobileSpring}
                                className="btn btn-primary btn-sm rounded-full px-5 font-semibold text-xs"
                                type="button"
                                onClick={handleEnableLocation}
                            >
                                Habilitar
                            </motion.button>
                        )}
                        {locationPermission === "denied" && (
                            <div className="flex flex-col items-end gap-1">
                                <span className="badge badge-error gap-1 font-semibold p-3 text-xs">
                                    Bloqueado
                                </span>
                                <span className="text-[10px] text-error/80 text-right">
                                    Actívalo en ajustes del navegador
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
            <Alert ref={alertRef} />
        </motion.div>

    )
}

const updateInfoSchema = z.object({
    name: z.string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "No puede tener más de 50 caracteres")
        .trim(),
    nickname: z.string()
        .min(2, "El apodo debe tener al menos 2 caracteres")
        .max(30, "No puede tener más de 30 caracteres")
        .trim()
        .regex(/^[a-zA-Z0-9_]+$/, "El apodo solo puede contener letras, números y guiones bajos (_)"),
})

export function UpdateInfo({ profile, isAvatarPending, onUploadPhoto, onDeletePhoto, onSuccess }) {
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);

    const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm({
        resolver: zodResolver(updateInfoSchema),
        defaultValues: {
            name: profile?.display_name || "",
            nickname: profile?.nickname || "",
        }
    });

    // RECETEA EL FORMULARIO CUANDO SE CARGUEN LOS DATOS DEL PERFIL
    useEffect(() => {
        if (profile) {
            reset({
                name: profile.display_name || "",
                nickname: profile.nickname || "",
            });
        }
    }, [profile, reset]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onUploadPhoto?.(file);
        }
    };

    const handleUpdateInfo = (data) => {
        // Enviar solo si los datos son diferentes
        if (data.name === profile?.display_name && data.nickname === profile?.nickname) {
            onSuccess?.();
            return;
        }
        updateInfoMutation.mutate(data);
    }

    const updateInfoMutation = useMutation({
        mutationFn: updateInfo,

        onSuccess: (result) => {
            queryClient.invalidateQueries({
                queryKey: ['userProfile']
            });
            onSuccess?.();
        },

        onError: (error) => {
            console.error("Error al actualizar la información:", error);
        }
    });

    return (
        <form onSubmit={handleSubmit(handleUpdateInfo)} className="space-y-5" >

            {/* AVATAR EDIT SECTION */}
            <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-base-200/50">
                <div className="relative w-20 h-20">
                    <div className="avatar w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary/20 shadow-inner">
                        <img
                            src={profile?.avatar_url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPySnqxeKdKLTPzZFpDszmCg-e0NGSsFxqaw&s"}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                        {isAvatarPending && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                                <span className="loading loading-spinner loading-sm text-white" />
                            </div>
                        )}
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isAvatarPending}
                />

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleUploadClick}
                        className="btn btn-xs btn-outline btn-primary rounded-full px-3"
                        disabled={isAvatarPending}
                    >
                        <Camera size={10} className="mr-1" />
                        Subir foto
                    </button>
                    {profile?.avatar && (
                        <button
                            type="button"
                            onClick={onDeletePhoto}
                            className="btn btn-xs btn-outline btn-error rounded-full px-3"
                            disabled={isAvatarPending}
                        >
                            <Trash2 size={10} className="mr-1" />
                            Eliminar
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4 pt-2">
                {/* Nombre */}
                <div>
                    <label className="label">
                        <span className="label-text font-medium">Nombre visible</span>
                    </label>
                    <div className="relative">
                        <input className={`input input-bordered w-full pl-10 focus:border-primary focus:outline-none ${errors.name ? "input-error" : ""}`}
                            type="text"
                            placeholder="Juan Gabriel"
                            {...register("name")}
                            disabled={updateInfoMutation.isPending || isAvatarPending}
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                    </div>
                    {errors.name && (
                        <span className="text-error text-sm mt-1 block">
                            {errors.name.message}
                        </span>
                    )}
                </div>

                {/* Apodo */}
                <div>
                    <label className="label">
                        <span className="label-text font-medium">Apodo</span>
                    </label>
                    <div className="relative">
                        <input className={`input input-bordered w-full pl-10 focus:border-primary focus:outline-none ${errors.nickname ? "input-error" : ""}`}
                            type="text"
                            placeholder="Apodo"
                            {...register("nickname")}
                            disabled={updateInfoMutation.isPending || isAvatarPending}
                        />
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                    </div>
                    {errors.nickname && (
                        <span className="text-error text-sm mt-1 block">
                            {errors.nickname.message}
                        </span>
                    )}
                </div>
            </div>

            {updateInfoMutation.isError && (
                <div className="alert alert-error text-sm py-2.5 px-4 rounded-2xl flex gap-2">
                    <span className="text-white text-xs leading-relaxed">
                        {updateInfoMutation.error?.message || "Ocurrió un error al guardar la información. Por favor, intenta de nuevo."}
                    </span>
                </div>
            )}

            <button className="btn btn-primary w-full animate-none rounded-xl" type="submit"
                disabled={!isDirty || updateInfoMutation.isPending || isAvatarPending}
            >
                {updateInfoMutation.isPending ? (
                    <>
                        <span className="loading loading-spinner loading-sm" />
                        Guardando cambios...
                    </>
                ) : (
                    "Guardar cambios"
                )}
            </button>
        </form>
    );
}

export function Title() {
    return (
        <h2 className="text-3xl font-extrabold tracking-tight text-center drop-shadow-xs bg-base-100 px-4 py-1.5 rounded-full">
            <span className="text-orange-500">C</span>
            <span className="text-orange-400">o</span>
            <span className="text-amber-400">n</span>
            <span className="text-yellow-400">f</span>
            <span className="text-lime-500">i</span>
            <span className="text-green-500">g</span>
            <span className="text-emerald-500">u</span>
            <span className="text-cyan-400">r</span>
            <span className="text-sky-500">a</span>
            <span className="text-blue-500">c</span>
            <span className="text-indigo-500">i</span>
            <span className="text-violet-500">ó</span>
            <span className="text-fuchsia-500">n</span>
        </h2>
    );
}