import { Global, Module, OnModuleInit } from "@nestjs/common";
import { AgendaService } from "./service/agenda.service";

@Global()
@Module({
  providers: [AgendaService],
  exports: [AgendaService],
})
export class AgendaModule {}
