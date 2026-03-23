// app/actions/firebaseActions/estimateActions/alertTab/uploadEstimatePdf.ts
'use server'

import { getAdminStorage } from '@/lib/services/firebaseAdmin'

export async function uploadEstimatePdf(  formData: FormData,  estimateId: string,  pdfType: 'blueprint' | 'consultation') {
    try{
        const file = formData.get('file') as File
        const buffer = Buffer.from(await file.arrayBuffer())

        const storage = getAdminStorage()
        const bucket = storage.bucket()
        const filePath = `estimate-docs/${estimateId}/${pdfType}/${file.name}`
        const fileRef = bucket.file(filePath)

        await fileRef.save(buffer, {
            metadata: { contentType: 'application/pdf' },
        })

        //await fileRef.makePublic() // or use getSignedUrl if you want private
        const downloadUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`

        return {
            downloadUrl,
            success: true
        }
    }
    catch(e){
        return {
            success: false,
            error: `Failed to upload estimate: ${e}`
        }
    }
}