import ChangeUsernameForm from "@/components/ChangeUsernameForm";
import { useAuth } from "@/hooks/useAuth";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRound } from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage your profile details for this workspace."
      />

      <div className="mt-8 grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserRound className="size-4" aria-hidden="true" />
              Profile information
            </CardTitle>
            <CardDescription>
              Your identity across campaigns and shared links.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Display name</p>
              <p className="rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm text-foreground">
                {user?.name || "Not set"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Email address</p>
              <p className="rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm text-foreground">
                {user?.email}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Update display name</CardTitle>
            <CardDescription>
              This name appears in the workspace header and account menu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangeUsernameForm />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default SettingsPage;
