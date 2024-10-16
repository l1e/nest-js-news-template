import { extname } from "path";
import { Request } from "express";

export const ImgFileFilter = (req, file, callback) => {
	console.log("ImgFileFilter", file);

	const allowedExtensions = /\.(png|jpg|gif|webp|svg|jpeg|pdf)$/i; // Case-insensitive regex for allowed extensions
	let preparedFileName = file.originalname.toLowerCase();

	if (!preparedFileName.match(allowedExtensions)) {
		return callback(
			new Error(
				"Only images and pdf files are allowed!" +
					file.originalname +
					"",
			),
			false,
		);
	}
	callback(null, true);
};

export const editFileName = (
	req: Request,
	file: Express.Multer.File,
	callback: (error: Error | null, filename: string) => void,
) => {
	const originalNameWithoutExt = file.originalname.split(".")[0];
	const fileExtName = extname(file.originalname);

	const randomName = Array(4)
		.fill(null)
		.map(() => Math.round(Math.random() * 16).toString(16))
		.join("");

	const newFileName = `${originalNameWithoutExt}-${randomName}${fileExtName}`;

	callback(null, newFileName);
};
