import { File } from "@prisma/client";

export interface UploadFileTypeResponse {
  file: File
  message: string
}