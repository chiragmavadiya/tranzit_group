import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import SettingForm from '../components/SettingForm';

export default function CategorySettingsPage() {
  const { categoryId } = useParams<{ categoryId: string }>();


  const { data: response, isLoading } = useSettings();

  const currentCategory = useMemo(() =>
    response?.data?.find(c => c.slug === categoryId), [response, categoryId]);

  if (!currentCategory && response) {
    console.log("redirect because of not ...m")
    return <Navigate to="/settings" replace />
  }



  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-blue-400 h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto animate-in h-full">
      <SettingForm category={currentCategory} />
    </div>
  );
}
