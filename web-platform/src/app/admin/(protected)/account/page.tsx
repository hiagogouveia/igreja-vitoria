import { auth } from '@/auth';
import ChangePasswordForm from '@/components/admin/ChangePasswordForm';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
    const session = await auth();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Minha Conta</h1>
            <p className="text-gray-400 mb-8">
                Logado como <span className="text-white">{session?.user?.email}</span>
            </p>

            <div className="bg-dark-surface rounded-xl border border-white/10 p-6">
                <h2 className="text-xl font-bold mb-4">Alterar senha</h2>
                <ChangePasswordForm />
            </div>
        </div>
    );
}
