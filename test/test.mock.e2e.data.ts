import { CreateArticleDto } from "./../src/publisher/publisher-article/dto/create.publisher-article.dto";
import {
	UserRole,
	UserStatus,
} from "./../src/admin/admin-user/model/user.model";
import {
	ArticleOfTheDay,
	ArticleSpecial,
	PublishStatus,
	Requestor,
	ValidationStatus,
} from "./../src/admin/admin-article/model/article.model";
import { CreateCategoryDto } from "./../src/admin/admin-category/dto/category.create.dto";

let randomEmailPrefix = (Math.random() + 1).toString(36).substring(7);
let randomEmailPrefixPassword = (Math.random() + 1).toString(36).substring(7);

let randomNickNamePrefix = (Math.random() + 1).toString(36).substring(7);

export const userLogIn = {
	email: "admin@example.com",
	password: "password123",
	role: "publisher",
};

export const adminLogIn = {
	email: "admin@example.com",
	password: "password123",
	role: "admin",
};

export const userRegister = {
	email: `test.user._${randomEmailPrefix}@example.com`,
	password: `myOdinMars_${randomEmailPrefixPassword}_Pasword999`,
	phone: "1234567890",
	biography: "This is a short biography...",
	firstName: "John",
	lastName: "Doe",
	nickname: `Johnny_${randomNickNamePrefix}`,
	status: UserStatus.ACTIVE,
	role: UserRole.PUBLISHER,
};

export const adminRegister = {
	email: `test.admin_${randomEmailPrefix}_@example.com`,
	password: `myRest${randomEmailPrefixPassword}_Yeap`,
	phone: "1234567890",
	biography: "This is a short test...",
	firstName: "John",
	lastName: "Doe",
	nickname: `Johnny_${randomNickNamePrefix}`,
	status: UserStatus.ACTIVE,
	role: UserRole.ADMIN,
};

export const mockCreateArticleAsPublisher: CreateArticleDto = {
	title: "Kamara shines as Saints stun Cowboys",
	description: `
		Putting 40-plus points against the lowly Carolina Panthers last week was one thing, but beating the Cowboys 44-19 in their home opener is a different story as the Saints sent out a warning to the rest of the league.
		The unstoppable Alvin Kamara scored four touchdowns for this prolific Saints attack, which has now scored 91 points in their opening two games - the second most in the Super Bowl era.
		Matching the 1971 Cowboys, only the Saints themselves, in 2009, scored more with 95 - and both of those teams went on to win the Super Bowl.
	`,
	validationStatus: ValidationStatus.APPROVED,
	articleOfTheDay: ArticleOfTheDay.NO,
	categoryId: 1,
	media: [1, 2],
	creatorId: 1,
	creatorEmail: "",
};

export const mockCreateArticleAsAdmin: CreateArticleDto = {
	title: "Astronauts reveal what life is like on",
	description: `
		In June two American astronauts left Earth expecting to spend eight days on the International Space Station (ISS).
		But after fears that their Boeing Starliner spacecraft was unsafe to fly back on, Nasa delayed Suni Williams and Butch Wilmore’s return until 2025.
		They are now sharing a space about the size of a six-bedroom house with nine other people.
		Ms Williams calls it her "happy place" and Mr Wilmore says he is "grateful" to be there.
		But how does it really feel to be 400km above Earth? How do you deal with tricky crewmates? How do you exercise and wash your clothes? What do you eat - and, importantly, what is the “space smell”?
		Talking to BBC News, three former astronauts divulge the secrets to surviving in orbit.
	`,
	validationStatus: ValidationStatus.APPROVED,
	articleOfTheDay: ArticleOfTheDay.NO,
	categoryId: 1,
	media: [1, 2],
	creatorId: 1,
	creatorEmail: "",
};

export const createCategoryAsAdminDto: CreateCategoryDto = {
	name: "AI",
	description: "AI of the new Era",
	publishStatus: PublishStatus.PUBLISHED,
};

export const updateCategoryAsAdminDto: CreateCategoryDto = {
	name: "AI Updated",
	description: "Updated Description",
};
