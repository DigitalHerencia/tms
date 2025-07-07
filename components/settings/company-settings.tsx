'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export function CompanySettings() {
  const [formState, setFormState] = useState({
    companyName: 'C & J Express Inc.',
    dotNumber: '1234567',
    mcNumber: 'MC-987654',
    address: '123 Trucking Way',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    phone: '(312) 555-1234',
    email: 'info@cjexpress.com',
    website: 'www.cjexpress.com',
    timezone: 'America/Chicago',
    units: 'miles',
    currency: 'USD',
    taxId: '12-3456789',
  });

  const handleChange = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="bg-muted flex h-24 w-24 items-center justify-center rounded-md border">
            <span className="text-2xl font-bold">C&J</span>
          </div>
          <div>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload Logo
            </Button>
            <p className="text-muted-foreground mt-1 text-xs">
              Recommended size: 512x512px. Max file size: 2MB.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={formState.companyName}
            onChange={e => handleChange('companyName', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dotNumber">DOT Number</Label>
          <Input
            id="dotNumber"
            value={formState.dotNumber}
            onChange={e => handleChange('dotNumber', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mcNumber">MC Number</Label>
          <Input
            id="mcNumber"
            value={formState.mcNumber}
            onChange={e => handleChange('mcNumber', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId">Tax ID / EIN</Label>
          <Input
            id="taxId"
            value={formState.taxId}
            onChange={e => handleChange('taxId', e.target.value)}
          />
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-4 text-lg font-medium">Contact Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formState.address}
              onChange={e => handleChange('address', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formState.city}
              onChange={e => handleChange('city', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select
              value={formState.state}
              onValueChange={value => handleChange('state', value)}
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IL">Illinois</SelectItem>
                <SelectItem value="IN">Indiana</SelectItem>
                <SelectItem value="MI">Michigan</SelectItem>
                <SelectItem value="OH">Ohio</SelectItem>
                <SelectItem value="WI">Wisconsin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={formState.zipCode}
              onChange={e => handleChange('zipCode', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formState.phone}
              onChange={e => handleChange('phone', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formState.email}
              onChange={e => handleChange('email', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formState.website}
              onChange={e => handleChange('website', e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-4 text-lg font-medium">Preferences</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={formState.timezone}
              onValueChange={value => handleChange('timezone', value)}
            >
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">
                  Eastern Time (ET)
                </SelectItem>
                <SelectItem value="America/Chicago">
                  Central Time (CT)
                </SelectItem>
                <SelectItem value="America/Denver">
                  Mountain Time (MT)
                </SelectItem>
                <SelectItem value="America/Los_Angeles">
                  Pacific Time (PT)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="units">Distance Units</Label>
            <Select
              value={formState.units}
              onValueChange={value => handleChange('units', value)}
            >
              <SelectTrigger id="units">
                <SelectValue placeholder="Select units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="miles">Miles</SelectItem>
                <SelectItem value="kilometers">Kilometers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={formState.currency}
              onValueChange={value => handleChange('currency', value)}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">US Dollar (USD)</SelectItem>
                <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                <SelectItem value="MXN">Mexican Peso (MXN)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
