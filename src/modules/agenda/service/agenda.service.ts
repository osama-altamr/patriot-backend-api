import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { EnvironmentService } from "@Package/config";
import { Agenda, DefineOptions, Job } from "agenda";



@Injectable()
export class AgendaService implements OnModuleInit, OnModuleDestroy {
    private readonly agenda: Agenda;
    private readonly logger = new Logger(AgendaService.name);

    constructor(
        private readonly env: EnvironmentService,
    ) {
        const host: string = env.get('mongodb.host');
        const port: number = env.get('mongodb.port');
        const username: string = env.get('mongodb.username');
        const password: string = env.get('mongodb.password');
        const database: string = env.get('mongodb.name');

        const uri = username && password
            ? `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin&replicaSet=rs0`
            : `mongodb://${host}:${port}/${database}`;
        this.agenda = new Agenda({
            db: {
                address: uri,
                collection: "agendaJobs",
            },
        });
    }

    async onModuleInit() {
        await this.agenda.start();
        console.log("Agenda started");
    }

    async onModuleDestroy() {
        await this.agenda.stop();
        this.logger.log("Agenda stopped");
    }

    async scheduleJob(name: string, when: string | Date, data: any) {
        this.logger.log(`Scheduling job "${name}" at ${when}`);
        await this.agenda.schedule(when, name, data)
    }

    async every(
        interval: string,
        names: string | string[],
    ) {
        const job = await this.agenda.every(interval, names);
        return job;
    }

    async cancelJobByName(name: string) {
        this.logger.log(`Cancelling job "${name}"`);
        const result = await this.agenda.cancel({ name });
        this.logger.log(`Cancelled ${result} job(s)`);
        return result;
    }

    defineJob(name: string, handler: (job: Job) => Promise<void> | void,) {
        this.agenda.define(name, handler);
        this.logger.log(`Defined job "${name}"`);
    }

    getInstance(): Agenda {
        return this.agenda;
    }
}


/*
Usage example 

@Injectable()
export class CurrencyJob {
    constructor(
        private readonly redisService: RedisService,
        private readonly currencyService: CurrencyService,
        private readonly agendaService: AgendaService
    ) {

    }

    async updateCurrencies() {
                                        
        this.agendaService.defineJob(JobName.GET_CURRENCIES, async () => { 
            await this.getCurrencyTimeSeries() 
        });
        
        const times = [
            ScheduleRecurrence.AM_9,
            ScheduleRecurrence.AM_12,
            ScheduleRecurrence.AM_2,
            ScheduleRecurrence.AM_4
        ];
        
        for (const time of times) {
            await this.agendaService.scheduleJob(JobName.GET_CURRENCIES, time, {});
        }
        
        console.log("Currency update scheduled at 9 AM, 12 AM, 2 AM, and 4 AM daily");
    }

    async getCurrencyTimeSeries() {
        const marketStatus = await this.redisService.get(CurrencyRedisKey.MarketStatus)
        if (MarketStatusEnum.OPEN === marketStatus) {
            await this.currencyService.getCurrencyTimeSeries()
        }
    }
}

*/