import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AdminMediaDeleteFileDTO {
	@ApiProperty({
		default:
			"media/upload/depositphotos_152459820-stock-photo-beautiful-girl-with-long-wavy-64103.jpg",
	})
	@IsNotEmpty()
	name: string;
}
