import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../awsClient";

interface generatePreAssignURLParams {
  fileName: string;
  fileType: string;
  folderPath: string;
}

const PRESIGNED_VALID_DURATION = 3600;

const generatePreAssignURL = async ({
  fileName,
  fileType,
  folderPath,
}: generatePreAssignURLParams) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: folderPath ? `${folderPath}/${fileName}` : fileName,
    ContentType: fileType,
    ACL: "public-read",
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_VALID_DURATION,
  });

  return url;
};

/**
 * Get a presigned url to upload a file to s3 bucket.
 * Make sure there's valid aws credential with valid IAM permission rules given.
 *
 * Function to be paired with POST REST API.
 *
 * @param req.body {fileName: string, fileType: string, folderPath: string}
 * @param res
 * @returns
 */
export const presignedUrlApiV1 = async (req: any, res: any) => {
  const fileName = req?.body?.fileName;
  const fileType = req?.body?.fileType;
  const folderPath = req?.body?.folderPath;

  if (!fileName) return res.status(403).json("fileName key in body is missing");
  if (!fileType) return res.status(403).json("fileType key in body is missing");
  if (!folderPath)
    return res.status(403).json("folderPath key in body is missing");

  try {
    const presignedUrl = await generatePreAssignURL({
      fileName: fileName,
      fileType: fileType,
      folderPath: folderPath,
    });
    return res.send({
      url: presignedUrl,
      status: 200,
      msg: "Presigned URL generated successfully.",
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return res.status(500).send("Internal server error.");
};
