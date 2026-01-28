export function getProductImage(imageId: string) {
    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${imageId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
  }
  