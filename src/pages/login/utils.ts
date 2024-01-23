import { UserData } from '../../constants/appTypes.ts';

export const handleDataStoring = (userData: UserData, role: string) => {
  localStorage.setItem('userData', JSON.stringify(userData));
  localStorage.setItem('appMode', role);
};
