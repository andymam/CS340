import { S3DAO } from "../interfaces/S3DAO";
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

export class S3DAOAWS implements S3DAO {
  private s3 = new S3Client({});
  private bucket = process.env.TWEETER_BUCKET!;
  private region = process.env.REGION!;

  async getImageUrl(key: string): Promise<string> {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/image/${key}`;
  }

  async uploadImage(key: string, data: Buffer): Promise<string> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: `${key}`,
        Body: data,
        ContentType: "image/png",
        ACL: "public-read",
      })
    );

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/image/${key}`;
  }
}
