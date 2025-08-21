export enum ScheduleRecurrence {
    EVERY_MINUTE = "* * * * *",        
    EVERY_5_MINUTES = "*/5 * * * *",    
    EVERY_15_MINUTES = "*/15 * * * *",  
    EVERY_30_MINUTES = "*/30 * * * *",  
    HOURLY = "0 * * * *",             
    DAILY = "0 0 * * *",       
    WEEKLY = "0 0 * * 0",             
    MONTHLY = "0 0 1 * *",            
    YEARLY = "0 0 1 1 *",   
    AM_9 = '0 9 * * *', 
    AM_12 = '0 0 * * *', 
    AM_2 = '0 2 * * *', 
    AM_4 = '0 4 * * *'   
}