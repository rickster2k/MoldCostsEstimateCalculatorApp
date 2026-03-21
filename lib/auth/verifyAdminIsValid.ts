import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';


export async function verifyAdminIsValid() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user.admin) {
    redirect('/')
  }
}