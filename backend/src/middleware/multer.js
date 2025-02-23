import fs from 'fs';
import multer from 'multer';
import path from 'path';
export const FileTypes = {
    IMAGES: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'],
    VIDEO: ['video/mp4', 'video/ogg', 'video/webm', 'video/x-matroska'],
    AUDIO: ['audio/mpeg', 'audio/ogg', 'audio/webm', 'audio/mp3', 'audio/wav'],
    PDF: ['application/pdf'],
};

export const multerLocal = (customMimeType, customPath) => {
    const fullPath = path.resolve(`./src/uploads/${customPath}`);

    fs.existsSync(fullPath) ? fullPath : fs.mkdirSync(fullPath, { recursive: true }); // create folder if not exist

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, fullPath);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + Math.round(Math.random() * 1e9) + '_' + file.originalname);
        },
    });

    function fileFilter(req, file, cb) {
        // check file type
        if (customMimeType?.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('inValid file format'), false);
        }
    }

    const upload = multer({ fileFilter, storage }); // upload middleware

    return upload;
}; // end of multerLocal

export const multerCloud = (customMimeType) => {
    const storage = multer.diskStorage({});

    function fileFilter(req, file, cb) {
        // check file type
        if (customMimeType?.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('inValid file format'), false);
        }
    }

    const upload = multer({ fileFilter, storage }); // upload middleware

    return upload;
};
