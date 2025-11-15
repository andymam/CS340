export interface S3DAO {
    getImageUrl(key: string): Promise<string>;
    uploadImage(key: string, data: Buffer): Promise<string>;
}