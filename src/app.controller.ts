import { Controller, Get, Redirect } from '@nestjs/common';

@Controller('/')
export class AppController {
  constructor() {}

  @Get(['', 'docs'])
  @Redirect(process.env.API_DOCUMENTATION, 302)
  docs(): string {
    return 'Redirecting to API documentation';
  }
}
