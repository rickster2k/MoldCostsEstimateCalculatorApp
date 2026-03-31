import { FoggingInterest } from "../types";

export function formatTimestamp(isoString: string): string {
    return new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })
}


export const Capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);



export function changeFoggingTypeToYesNoUnsure(value: FoggingInterest){
    
    if((value === "not-sure") || (value === "interested")){
        return "not-sure"
    }
    

    return value
    
     
}