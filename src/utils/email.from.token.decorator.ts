import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { verify } from "jsonwebtoken";

function getDirtyTokenRowFromHeders(headers) {
	let token: string;

	for (let item of headers) {
		if (item.includes("Bearer")) {
			token = item;
		}
	}

	return token;
}

export const EmailToken = createParamDecorator(
	(data: string, ctx: ExecutionContext) => {

		const request = ctx.switchToHttp().getRequest();
		const tokenDirty = getDirtyTokenRowFromHeders(request.rawHeaders);
		const token = tokenDirty.replace("Bearer ", "");
		const tokenDecoded = verify(token, process.env.SECRET_KEY);
		const { email } = tokenDecoded;
		
		return email;
	},
);
