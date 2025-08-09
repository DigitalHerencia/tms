'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { useOrganizationContext } from '@/components/auth/context';
import { createOrganizationInvitation } from '@/lib/actions/invitationActions';
import {
  updateOrganizationSettings,
  updateIntegrationSettings,
} from '@/lib/actions/settingsActions';

interface OrgData {
  name: string;
  timezone: string;
}

interface InviteData {
  email: string;
  role: string;
}

interface ConfigData {
  notifications: boolean;
}

const steps = ['Organization', 'Invite Team', 'Settings'];

export function OnboardingWizardFeature() {
  const org = useOrganizationContext();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [orgData, setOrgData] = useState<OrgData>({ name: '', timezone: '' });
  const [inviteData, setInviteData] = useState<InviteData>({ email: '', role: 'member' });
  const [configData, setConfigData] = useState<ConfigData>({ notifications: true });

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleFinish = () => {
    if (org?.id) {
      router.push(`/${org.id}/dashboard`);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 py-10">
      <Progress value={(step / (steps.length - 1)) * 100} />
      {step === 0 && (
        <OrgSetup
          orgId={org?.id}
          data={orgData}
          onChange={setOrgData}
          onNext={next}
        />
      )}
      {step === 1 && (
        <InviteTeam
          data={inviteData}
          onChange={setInviteData}
          onPrev={prev}
          onNext={next}
        />
      )}
      {step === 2 && (
        <ConfigureSettings
          orgId={org?.id}
          data={configData}
          onChange={setConfigData}
          onPrev={prev}
          onFinish={handleFinish}
        />
      )}
    </div>
  );
}

function OrgSetup({
  orgId,
  data,
  onChange,
  onNext,
}: {
  orgId?: string;
  data: OrgData;
  onChange: (data: OrgData) => void;
  onNext: () => void;
}) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
    await updateOrganizationSettings(orgId, {
      id: orgId,
      name: data.name,
      timezone: data.timezone,
    });
    toast({ title: 'Organization saved' });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="org-name">Organization Name</Label>
        <Input
          id="org-name"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="org-timezone">Timezone</Label>
        <Input
          id="org-timezone"
          value={data.timezone}
          onChange={(e) => onChange({ ...data, timezone: e.target.value })}
          placeholder="UTC"
          required
        />
      </div>
      <Button type="submit">Save & Continue</Button>
    </form>
  );
}

function InviteTeam({
  data,
  onChange,
  onPrev,
  onNext,
}: {
  data: InviteData;
  onChange: (data: InviteData) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOrganizationInvitation({
      emailAddress: data.email,
      role: data.role,
    });
    toast({ title: 'Invitation sent' });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="invite-email">Team Member Email</Label>
        <Input
          id="invite-email"
          type="email"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="invite-role">Role</Label>
        <Input
          id="invite-role"
          value={data.role}
          onChange={(e) => onChange({ ...data, role: e.target.value })}
        />
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button type="submit">Send Invite</Button>
      </div>
    </form>
  );
}

function ConfigureSettings({
  orgId,
  data,
  onChange,
  onPrev,
  onFinish,
}: {
  orgId?: string;
  data: ConfigData;
  onChange: (data: ConfigData) => void;
  onPrev: () => void;
  onFinish: () => void;
}) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
    await updateIntegrationSettings(orgId, {
      notifications: data.notifications,
    });
    toast({ title: 'Settings updated' });
    onFinish();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="notifications"
          checked={data.notifications}
          onCheckedChange={(v) => onChange({ ...data, notifications: v })}
        />
        <Label htmlFor="notifications">Enable notifications</Label>
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button type="submit">Finish</Button>
      </div>
    </form>
  );
}

