import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
  username!: string;
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  email!: string;
  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  password!: string;
}
export class LoginDto {
  @ApiProperty({ example: 'hardik@gmail.com' })
  email!: string;

  @ApiProperty({ example: '123456' })
  password!: string;
}
