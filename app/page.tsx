'use client';

import { useRouter } from 'next/navigation';
import { RoleSelector } from '@/app/components/ui/RoleSelector';

export default function HomePage() {
  const router = useRouter();

  const handleSelectRole = (role: 'CONSUMER' | 'MERCHANT') => {
    if (role === 'CONSUMER') {
      router.push('/consumer');
    } else {
      router.push('/merchant');
    }
  };

  return <RoleSelector onSelectRole={handleSelectRole} />;
}
