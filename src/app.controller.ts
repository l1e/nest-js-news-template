import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private configService: ConfigService,
	) {}

	@Get()
	getHello(): string {
		console.log('getHello MYSQL_HOST:',this.configService.get('MYSQL_HOST'))
		return this.appService.getHello();
	}
}
