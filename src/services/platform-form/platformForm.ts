import API from '../index.ts';

const FORM_URL = '/form';

export interface PlatformFormData {
  user_type: 'person' | 'organization';
  organization_name?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  comment?: string;
  agreed: boolean;
}

const platformForm = {
  sentForm: (data: PlatformFormData) => {
    return API.post(FORM_URL, data).then((res) => res.data);
  },
};

export const { sentForm } = platformForm;
