import { BadRequestException, Injectable } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/schemas/User.schema';
import { Model } from 'mongoose';

@Injectable()
export class FileService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ){}

    // validate image

    private validateimage(image: Express.Multer.File) {
        const { 
            mimetype, 
            size,
        } = image;

        if(
           mimetype !== 'image/jpeg' && 
           mimetype !== 'image/jpg' && 
           mimetype !== 'image/png'
        ) return 'Incorrect format image. Must be jpeg, jpg, png';


        // check size. File must be < 2mb

        const sizeFile = size / 1000 / 1000;
        if(sizeFile > 5 ) return 'Large file size';

        return null;
    }

    // save image
    
    saveImage(image: Express.Multer.File) {
        const validateImage = this.validateimage(image);

        if(validateImage) return new BadRequestException(validateImage);


        const oldFile = join(__dirname, '..', '..', 'upload', image.filename);
        const newFile = join(__dirname, '..', '..', 'upload', image.originalname);

        fs.renameSync(oldFile, newFile);
        
        return image.originalname;
    }


    // remove image
    
    async removeImage(option: any) {
        const { image, id, pathFile} = option;

        // remove old file image from upload

        if(image) {
        
            const oldFile = join(__dirname, '..', '..', 'upload', image.filename);
    
            fs.unlinkSync(oldFile);
        
        }

        if(id) {

            // get name file image user

            const user = await this.userModel.findById(id);
            if(user) {

                const nameImage = user.image;
                const pathImage = join(__dirname, '..', '..', 'upload', nameImage);
    
                if(fs.existsSync(pathImage)) {
    
                    fs.unlinkSync(pathImage);
                
                }
            }

        }

        if(pathFile) {
            fs.unlinkSync(pathFile);
        }
    }
}
