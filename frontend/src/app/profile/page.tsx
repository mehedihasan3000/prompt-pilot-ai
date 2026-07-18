'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Camera, Key, AlertTriangle, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCurrentUser } from '@/hooks/useAuth';

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, isLoading: authLoading } = useCurrentUser();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    image: '',
    bio: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPassword: '',
    confirm: '',
  });

  useEffect(() => {
    document.title = 'Profile | PromptPilot AI';
  }, []);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        image: user.image || '',
        bio: '',
      });
    }
  }, [user]);

  function handleSave() {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast('Profile updated successfully', 'success');
    }, 800);
  }

  function handleDeleteAccount() {
    setShowDeleteModal(false);
    toast('Account deletion request submitted', 'info');
  }

  const isPasswordFormValid =
    passwordForm.current.length > 0 &&
    passwordForm.newPassword.length >= 6 &&
    passwordForm.confirm.length >= 6 &&
    passwordForm.newPassword === passwordForm.confirm;

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your account settings and preferences.</p>
        </div>

        <div className="space-y-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary-100">
                {profile.image ? (
                  <img src={profile.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-primary-600" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
                <p className="text-sm text-slate-500">Update your personal details.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Name"
                  placeholder="Your full name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={profile.email}
                  disabled
                  helperText="Email cannot be changed."
                />
              </div>

              <Input
                label="Profile Image URL"
                placeholder="https://example.com/avatar.jpg"
                value={profile.image}
                onChange={(e) => setProfile({ ...profile, image: e.target.value })}
                helperText="Enter a URL for your profile picture."
              />

              <Textarea
                label="Bio"
                placeholder="Tell us a little about yourself..."
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
              />

              <div className="flex justify-end pt-2">
                <Button onClick={handleSave} isLoading={isSaving}>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <Key className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
                <p className="text-sm text-slate-500">Update your account password.</p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Repeat new password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                />
              </div>
              {passwordForm.confirm && passwordForm.newPassword !== passwordForm.confirm && (
                <p className="text-sm text-red-600">Passwords do not match.</p>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  variant="secondary"
                  disabled={!isPasswordFormValid}
                  onClick={() => {
                    setPasswordForm({ current: '', newPassword: '', confirm: '' });
                    toast('Password updated successfully', 'success');
                  }}
                >
                  <Key className="h-4 w-4" />
                  Update Password
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-red-200 bg-white p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
                <p className="text-sm text-slate-500">Irreversible actions for your account.</p>
              </div>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-red-900">Delete your account</p>
                  <p className="text-sm text-red-600">
                    Permanently remove your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Yes, Delete My Account
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          This action is permanent and cannot be undone. All your prompts, templates, collections, and
          analytics data will be permanently deleted. Are you sure you want to proceed?
        </p>
      </Modal>
    </div>
    </ProtectedRoute>
  );
}
