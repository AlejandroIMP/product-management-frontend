export interface imageDto{
    id:string
    publicId: string
    url: string
    metadatosJSON: string
    createdAt: Date
    updateAt: Date
}

export interface ImageUploadResponse{
    imageId: string
    publicId: string
    url: string
    metadatosJSON: string   
}