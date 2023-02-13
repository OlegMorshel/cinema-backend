import { Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from "@nestjs/platform-express";
import { BufferedFile } from "../minio-client/file.model";

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {
  }


  @Get('')
  async getAllFiles() {
    return await this.fileService.getFiles();
  }

  @Get(':id')
  async getFileById(@Param('id') id: number) {
    return await this.fileService.getFileById(id)
  }


  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @UploadedFile() image: BufferedFile
  ) {
    return await this.fileService.uploadFile(image)
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: number) {
    return await this.fileService.deleteFile(id)
  }
}
