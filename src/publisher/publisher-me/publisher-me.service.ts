import {
	Injectable,
	NotFoundException,
	InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/admin/admin-user/model/user.model";

@Injectable()
export class PublisherMeService {
	constructor(
		@InjectModel(User)
		private readonly userModel: typeof User,
	) {}

	async getMyInformation(email: string): Promise<User> {
		try {
			const user = await this.userModel.findOne({
				where: { email },
				attributes: { exclude: ["password", "status"] },
			});

			if (!user) {
				throw new NotFoundException("Publisher information not found.");
			}

			return user;
		} catch (error) {
			throw new InternalServerErrorException(
				"An error occurred while retrieving user information",
			);
		}
	}
}
