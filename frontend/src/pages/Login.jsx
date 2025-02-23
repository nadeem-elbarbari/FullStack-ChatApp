import React from 'react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useThemeStore } from '../../store/useThemeStore.js';
import AuthImagePattern from '../components/AuthImagePattern.jsx';
import { Eye, EyeOff, Mail, MessagesSquare, User, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = React.useState(false);

    const { login, isLoggingIn } = useAuthStore();

    const validateForm = () => {
        if (!formData.email) {
            toast.error('البريد الالكتروني مطلوب');
            return false;
        } else if (!formData.password) {
            toast.error('كلمة المرور مطلوبة');
            return false;
        } else if (formData.password.length < 8) {
            toast.error('كلمة المرور يجب ان تكون على الاقل 8 حروف');
            return false;
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
            toast.error('البريد الالكتروني غير صالح');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        login(formData.email, formData.password);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* left side */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* logo */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div
                                className="size-16 p-2 rounded-xl bg-primary/10 flex items-center justify-center
group-hover:bg-primary/20 transition-colors"
                            >
                                <MessagesSquare className="size-16 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2"> مرحباً بك </h1>

                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">البريد الالكتروني</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    dir="ltr"
                                    type="email"
                                    className={'input input-bordered w-full pl-10'}
                                    placeholder="user@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">كلمة المرور</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    dir="ltr"
                                    type={showPassword ? 'text' : 'password'}
                                    className={'input input-bordered w-full pl-10'}
                                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={!formData.password ? true : false}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-5 text-base-content/40" />
                                    ) : (
                                        <Eye className="size-5 text-base-content/40" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn ? true : false}>
                            {isLoggingIn ? <span className="loading loading-spinner"></span> : <span>دخول</span>}
                        </button>
                    </form>
                    <div className="text-center">
                        <p className="text-base-content/60">
                        معندكش حساب؟ {' '}
                            <Link to="/signup" className="link link-primary">
                                تسجيل جديد
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* right side */}
            <AuthImagePattern
                title="إحكيلي"
                subtitle="سجل دخولك معنا وابدأ التحدث"
            />
        </div>
    );
};

export default Login;
