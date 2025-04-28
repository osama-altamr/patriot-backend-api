import { object, string } from "zod";


export const localizedSchema = object({ 
    en: string(), 
    ar: string() 
})