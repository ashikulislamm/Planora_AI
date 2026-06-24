"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../components/shared/Toast";
import { authService } from "../../../services/auth.service";
import { Input } from "../../../components/shared/Input";
import { Button } from "../../../components/shared/Button";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";

// Zod validation schemas
const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
});

const securitySchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type SecurityFormValues = z.infer<typeof securitySchema>;

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const { success, error } = useToast();
  const [profileLoading, setProfileLoading] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Profile Edit Form Hook
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Pre-fill profile form once user loads
  useEffect(() => {
    if (user) {
      setProfileValue("name", user.name);
      setProfileValue("email", user.email);
    }
  }, [user, setProfileValue]);

  // Security Form Hook
  const {
    register: registerSecurity,
    handleSubmit: handleSecuritySubmit,
    reset: resetSecurityForm,
    formState: { errors: securityErrors },
  } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onUpdateProfile = async (data: ProfileFormValues) => {
    setProfileLoading(true);
    try {
      const res = await authService.updateProfile(data);
      if (res.success && res.data.user) {
        updateUser(res.data.user);
        success("Profile details updated successfully!");
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to update profile details.");
    } finally {
      setProfileLoading(false);
    }
  };

  const onChangePassword = async (data: SecurityFormValues) => {
    setSecurityLoading(true);
    try {
      const res = await authService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (res.success) {
        success("Password changed successfully!");
        resetSecurityForm();
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Incorrect current password or update failure.");
    } finally {
      setSecurityLoading(false);
    }
  };

  const onDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const res = await authService.deleteAccount();
      if (res.success) {
        success("Your account has been deleted. Goodbye!");
        setDeleteDialogIsOpen(false);
        // Call logout internally to clear state and route to login
        await logout();
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to delete account. Please try again.");
      setDeleteLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-2xl mx-auto text-left selection:bg-neutral-100 selection:text-foreground">
      {/* Page Header */}
      <div className="border-b border-border-custom pb-4 select-none">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Account Settings
        </h2>
        <p className="text-xs text-secondary-text mt-0.5 leading-none">
          Manage your personal details, credentials, and account state
        </p>
      </div>

      {/* SECTION 1: Update Profile Details */}
      <div className="p-6 bg-white border border-border-custom rounded-xl space-y-5">
        <div className="select-none">
          <h3 className="text-sm font-bold text-foreground tracking-tight">
            Profile Information
          </h3>
          <p className="text-xs text-secondary-text mt-0.5">
            Update your account's public name and primary email address.
          </p>
        </div>

        <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            error={profileErrors.name?.message}
            disabled={profileLoading}
            {...registerProfile("name")}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            error={profileErrors.email?.message}
            disabled={profileLoading}
            {...registerProfile("email")}
          />

          <div className="flex justify-end pt-1 select-none">
            <Button type="submit" size="sm" isLoading={profileLoading}>
              Save Details
            </Button>
          </div>
        </form>
      </div>

      {/* SECTION 2: Security & Password */}
      <div className="p-6 bg-white border border-border-custom rounded-xl space-y-5">
        <div className="select-none">
          <h3 className="text-sm font-bold text-foreground tracking-tight">
            Security & Authentication
          </h3>
          <p className="text-xs text-secondary-text mt-0.5">
            Ensure your account is protected with a secure password.
          </p>
        </div>

        <form onSubmit={handleSecuritySubmit(onChangePassword)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            error={securityErrors.currentPassword?.message}
            disabled={securityLoading}
            {...registerSecurity("currentPassword")}
          />

          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={securityErrors.newPassword?.message}
            disabled={securityLoading}
            {...registerSecurity("newPassword")}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            error={securityErrors.confirmPassword?.message}
            disabled={securityLoading}
            {...registerSecurity("confirmPassword")}
          />

          <div className="flex justify-end pt-1 select-none">
            <Button type="submit" size="sm" isLoading={securityLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* SECTION 3: Danger Zone */}
      <div className="p-6 bg-white border border-foreground/45 rounded-xl space-y-5">
        <div className="select-none">
          <h3 className="text-sm font-bold text-foreground tracking-tight">
            Danger Zone
          </h3>
          <p className="text-xs text-secondary-text mt-0.5">
            Deleting your account will purge all personal data, task records, and sessions permanently.
          </p>
        </div>

        <div className="flex justify-start pt-1 select-none">
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteDialogIsOpen(true)}
            disabled={profileLoading || securityLoading}
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* DELETE ACCOUNT CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={deleteDialogIsOpen}
        onClose={() => setDeleteDialogIsOpen(false)}
        onConfirm={onDeleteAccount}
        title="Delete Account Permanently"
        message="Are you absolutely sure you want to delete your account? This will permanently delete your user record and all associated task history. This action cannot be undone."
        confirmText="Yes, Delete Permanently"
        cancelText="Cancel"
        isLoading={deleteLoading}
      />
    </div>
  );
}
