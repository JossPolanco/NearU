import { setUserPassword } from "../services/auth/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";

const registerSchema = z.object({
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "La confirmación de contraseña debe tener al menos 6 caracteres"),
})

export default function PasswordRegistration() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const navigate = useNavigate();

    const setPswMutation = useMutation({
        mutationFn: setUserPassword,

        onSuccess: (data) => {
            navigate('/home');
        },

        onError: (error) => {
            console.log(error);
        }
    });

    const onSubmit = (data) => {
        console.log("data en onSubmit:", data);
        setPswMutation.mutate(data);
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Botón volver */}
                <Link
                    to="/"
                    className="btn btn-ghost btn-sm mb-4"
                >
                    <ArrowLeft size={18} />
                    Volver
                </Link>

                <div className="card bg-base-100 shadow-2xl border border-base-300">
                    <div className="card-body">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="bg-primary/10 p-4 rounded-full mb-4">
                                <Lock
                                    size={32}
                                    className="text-primary"
                                />
                            </div>

                            <h1 className="text-3xl font-bold">
                                Crear contraseña
                            </h1>

                            <p className="text-base-content/70 mt-2 text-sm">
                                Ingresa una contraseña para tu cuenta. Asegúrate de que sea segura y fácil de recordar.
                            </p>
                        </div>


                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Constraseña
                                    </span>
                                </label>

                                <input
                                    type="password"
                                    placeholder="Ingresa tu contraseña"
                                    className="input input-bordered w-full"
                                    {...register("password")}
                                />

                                {errors.password && (
                                    <span className="text-error text-sm mt-1 block">
                                        {errors.password.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Confirmar contraseña
                                    </span>
                                </label>

                                <input
                                    type="password"
                                    placeholder="Ingresa tu contraseña"
                                    className="input input-bordered w-full"
                                    {...register("confirmPassword")}
                                />

                                {errors.confirmPassword && (
                                    <span className="text-error text-sm mt-1 block">
                                        {errors.confirmPassword.message}
                                    </span>
                                )}
                            </div>

                            {setPswMutation.isError && (
                                <div className="alert alert-error">
                                    <span>
                                        {setPswMutation.error.message || "Ocurrió un error al crear la contraseña."}
                                    </span>
                                </div>
                            )}

                            <button type="submit" className={`btn btn-primary w-full ${setPswMutation.isPending ? "btn-disabled" : ""}`}>
                                {setPswMutation.isPending ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Lock size={18} />
                                        Crear Contraseña
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="divider">o</div>

                        <Link to="/" className="btn btn-outline w-full" >
                            Olvide mi contraseña jaja
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}