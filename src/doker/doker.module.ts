import { forwardRef, Module } from '@nestjs/common';
import { DokerService } from './doker.service';
import { DokerController } from './doker.controller';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [forwardRef(() => UsuariosModule)],
  controllers: [DokerController],
  providers: [DokerService],
  exports: [DokerService]
})
export class DokerModule {}
