import { loginUser } from '../services/auth/authService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { supabaseClient } from '../utils/supabase';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { React, useEffect } from 'react'
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export default function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
            session?.user ? navigate('/home') : navigate('/');
            // console.log("USER SESSION:", event, session);
        });
        return () => subscription.unsubscribe();
    }, []);

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: zodResolver(loginSchema)
    })

    const loginMutation = useMutation({
        mutationFn: loginUser,

        onSuccess: (data) => {
            navigate('/home');
        },

        onError: (error) => {
            console.log(error);
        }
    })

    const handleLogin = (data) => {
        loginMutation.mutate(data);
    };

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <span>💕</span>
                    <h1 className="text-5xl font-bold">NearU</h1>
                    <p className="py-6">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime iste facilis excepturi mollitia veniam velit sequi commodi minima nemo nam amet tempora possimus dolor, harum rem nihil, doloribus aspernatur molestiae.
                    </p>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <form onSubmit={handleSubmit((handleLogin))}>
                            <div className="fieldset">
                                <label className="label">Email</label>
                                <input type="email" className="input" placeholder="Email" {...register("email")} />
                                {errors.email && (
                                    <span className="mt-2 text-sm text-error">{errors.email.message}</span>
                                )}

                                <label className="label">Contraseña</label>
                                <input type="password" className="input" placeholder="Contraseña" {...register("password")} />

                                {errors.password && (
                                    <span className="mt-2 text-sm text-error">{errors.password.message}</span>
                                )}
                                <div className="flex justify-between mt-2">
                                    {/* <div><a className="link link-hover">Forgot password?</a></div> */}
                                    <div><a className="link link-hover" onClick={() => navigate("/register")}>Crear Cuenta</a></div>
                                </div>

                                <button type="submit" className="btn btn-neutral mt-4" >Iniciar Sesión</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
