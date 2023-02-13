import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MinioClientService } from "../minio-client/minio-client.service";
import { PrismaService } from "../prisma/prisma.service";
import { File } from "@prisma/client";
import { BufferedFile } from "../minio-client/file.model";
import { UploadFileTypeResponse } from "./types";

@Injectable()
export class FileService {
  constructor(private minioClientService: MinioClientService,
              private prismaService: PrismaService) {
  }

  async getFiles(): Promise<File[]> {
    return this.prismaService.file.findMany()
  }

  async getFileById(id: number): Promise<File> {
    const existedFile = await this.prismaService.file.findUnique({ where: { id } })
    if (!existedFile) throw new HttpException(`File with ID:${id} NOT FOUND`, HttpStatus.NOT_FOUND)
    return existedFile
  }

  async deleteFile(id: number) {
    await this.getFileById(id)
    await this.prismaService.file.delete({ where: { id } })
    return { message: 'File success deleted' }
  }


  async uploadFile(file: BufferedFile): Promise<UploadFileTypeResponse> {

    if (!file) throw new HttpException('Error: loading file', HttpStatus.NOT_FOUND)

    let uploaded_file = await this.minioClientService.upload(file)
    if (uploaded_file) {
      const dbFile = await this.prismaService.file.create({
        data: {
          name: uploaded_file.hashedFileName.encryptedData,
          path: uploaded_file.relative_path
        }
      })

      return {
        file: {
          id: dbFile.id,
          name: dbFile.name,
          path: process.env.MINIO_FILES_ENDPOINT + uploaded_file.relative_path
        },
        message: "Success"
      }
    } else {
      throw new HttpException('Error: loading file to server ', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
