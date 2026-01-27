import { useCVStore } from '../../../../stores/cvStore';
import { Input, Select } from '../../../../components/ui';
import { PhotoUpload } from '../PhotoUpload/PhotoUpload';

export function PersonalInfoPanel() {
  const { cv, updatePersonalInfo } = useCVStore();

  if (!cv) return null;

  const { personalInfo } = cv;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>

      <PhotoUpload />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="First Name"
          value={personalInfo.firstName}
          onChange={e => updatePersonalInfo({ firstName: e.target.value })}
          placeholder="John"
        />
        <Input
          label="Last Name"
          value={personalInfo.lastName}
          onChange={e => updatePersonalInfo({ lastName: e.target.value })}
          placeholder="Doe"
        />
      </div>

      <Input
        label="Professional Title"
        value={personalInfo.title}
        onChange={e => updatePersonalInfo({ title: e.target.value })}
        placeholder="Software Engineer"
      />

      <Input
        label="Email"
        type="email"
        value={personalInfo.email}
        onChange={e => updatePersonalInfo({ email: e.target.value })}
        placeholder="john@example.com"
      />

      <Input
        label="Phone"
        type="tel"
        value={personalInfo.phone}
        onChange={e => updatePersonalInfo({ phone: e.target.value })}
        placeholder="+1 (555) 123-4567"
      />

      <Input
        label="Location"
        value={personalInfo.location}
        onChange={e => updatePersonalInfo({ location: e.target.value })}
        placeholder="New York, NY"
      />

      <Input
        label="Website"
        type="url"
        value={personalInfo.website}
        onChange={e => updatePersonalInfo({ website: e.target.value })}
        placeholder="https://johndoe.com"
      />

      <Input
        label="LinkedIn"
        value={personalInfo.linkedin}
        onChange={e => updatePersonalInfo({ linkedin: e.target.value })}
        placeholder="linkedin.com/in/johndoe"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select
          label="Photo Position"
          value={personalInfo.photoPosition}
          onChange={e => updatePersonalInfo({ photoPosition: e.target.value as 'left' | 'right' | 'none' })}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
            { value: 'none', label: 'Hidden' },
          ]}
        />
        <Select
          label="Photo Shape"
          value={personalInfo.photoShape}
          onChange={e => updatePersonalInfo({ photoShape: e.target.value as 'circle' | 'square' | 'rounded' })}
          options={[
            { value: 'circle', label: 'Circle' },
            { value: 'square', label: 'Square' },
            { value: 'rounded', label: 'Rounded' },
          ]}
        />
        <Select
          label="Photo Size"
          value={personalInfo.photoSize}
          onChange={e => updatePersonalInfo({ photoSize: e.target.value as 'small' | 'medium' | 'large' })}
          options={[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
          ]}
        />
      </div>
    </div>
  );
}
