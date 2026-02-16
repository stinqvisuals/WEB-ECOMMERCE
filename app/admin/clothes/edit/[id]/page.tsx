import { notFound } from 'next/navigation';
import EditContent from '@/components/admin/content/edit-clothes';
import { Suspense } from 'react';

const UpdateClothesPage = async ({
    params
}: {
    params: Promise<{ id: string }>
}) => {
    const clothesId = (await params).id;
    if (!clothesId) return notFound();
    return (
        <div className='max-w-screen-xl px-4 py-16 mt-10 mx-auto'>
            <Suspense fallback={<p>Loading...</p>}>
                <EditContent clothesId={clothesId} />
            </Suspense>
        </div>
    )
}

export default UpdateClothesPage