import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AdminLayout title="Kelola Profil Akun">
            <Head title="Kelola Profil Akun - Admin CMS" />

            <div className="space-y-6 max-w-4xl">
                <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#e2e8f0] shadow-xs">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#e2e8f0] shadow-xs">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#e2e8f0] shadow-xs">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AdminLayout>
    );
}
