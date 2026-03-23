export type EstimatePdfType = 'blueprint' | 'consultation'

// ─── Estimator answer types ───────────────────────────────────────────────────
// Each type maps directly to one question step in the estimator flow.

export type PropertyType =
  | 'single-family'
  | 'townhouse'
  | 'condo'
  | 'apartment'
  | 'commercial';

export type PropertySize =
  | 'under-1000'   // < 1,000 sq ft
  | '1000-2000'
  | '2000-3000'
  | '3000-plus';   // 3,000+ sq ft

export type AffectedLocation =
  | 'kitchen'
  | 'living-room'
  | 'family-room'
  | 'bedroom'
  | 'closet'
  | 'bathroom'
  | 'laundry'
  | 'basement'
  | 'crawl-space'
  | 'attic'
  | 'hvac'
  | 'foyer'
  | 'porch'
  | 'garage'
  | 'other';

export type AreaSizeCategory =
  | 'less-10'    // < 10 sq ft
  | '10-25'
  | '25-100'
  | '100-300'
  | '300-plus';  // 300+ sq ft

export type SeverityLevel =
  | 'minor'      // Surface level, no structural damage
  | 'moderate'   // Penetrating surface, some material damage
  | 'severe'     // Extensive growth, structural involvement
  | 'critical';  // Severe structural damage and active health hazard

export type MoldCause =
  | 'plumbing'
  | 'roof'
  | 'flooding'
  | 'humidity'
  | 'hvac'
  | 'unknown';

/** Shared yes/no/not-sure type used across multiple questions */
export type YesNoUnsure = 'yes' | 'no' | 'not-sure';

export type Accessibility =
  | 'easy'         // Open room, no obstruction
  | 'drywall'      // Behind drywall
  | 'crawl-space'
  | 'attic'
  | 'demolition';  // Requires full tear-out / material removal

export type StartTime =
  | '7-days'
  | '1-4-weeks'
  | '1-6-months'
  | 'over-6-months';

export type HealthSymptoms =
  | 'none'
  | 'mild'          // Occasional sneezing / congestion
  | 'respiratory'   // Coughing, wheezing, difficulty breathing
  | 'immune';       // Severe allergic or toxic reactions

export type FoggingInterest =
  | 'yes'
  | 'no'
  | 'not-sure'
  | 'interested';   // Wants more information before deciding

export type HiringTimeline =
  | 'asap'          // Within days
  | '30-days'
  | 'researching'   // Still comparing options
  | 'diy';          // Plans to self-remediate

// ─── Nested sub-types ─────────────────────────────────────────────────────────

/**
 * A single previous estimate the user received from another company.
 * Users can enter up to 3. Empty strings indicate the row was left blank.
 */
export interface PreviousEstimate {
  companyName: string;
  cityName: string;
  priceEstimate: string; // stored as a string to preserve user input (e.g. "$2,500")
}

/**
 * The cost breakdown produced by calculateEstimate().
 * All values are in USD.
 */
export interface EstimateBreakdown {
  baseCost: number;
  severityAdjustment: number;
  complexityAdjustment: number;
  additionalServices: number; // testing + HVAC + furniture + commercial surcharge
  foggingCost: number;        // 0 if fogging not requested
}

export interface CalculationResult {
  lowEstimate: number;      // averageEstimate * 0.8
  highEstimate: number;     // averageEstimate * 1.2
  averageEstimate: number;
  breakdown: EstimateBreakdown;
}


// ─── Core data interfaces ──────────────────────────────────────────────────────

/**
 * All 19 estimator question answers.
 * Captured progressively as the user moves through the estimator steps.
 * Stored as a nested object inside Submission.
 */
export interface EstimateData {
  // Step 1
  propertyType: PropertyType;
  // Step 2
  propertySize: PropertySize;
  // Step 3
  zipCode: string;
  // Step 4 — multi-select, at least one required
  affectedLocations: AffectedLocation[];
  // Step 5
  areaSizeCategory: AreaSizeCategory;
  // Step 6
  severity: SeverityLevel;
  // Step 7
  cause: MoldCause;
  // Step 8
  moistureFixed: YesNoUnsure;
  // Step 9
  startTime: StartTime;
  // Step 10
  accessibility: Accessibility;
  // Step 11
  hvacAffected: YesNoUnsure;
  // Step 12
  furnitureAffected: YesNoUnsure;
  // Step 13
  healthSymptoms: HealthSymptoms;
  // Step 14
  needsTesting: YesNoUnsure;
  // Step 15
  foggingInterest: FoggingInterest;
  // Step 16
  planInsuranceClaim: YesNoUnsure;
  // Step 17
  hasInsurance: YesNoUnsure;
  // Step 18
  hiringTimeline: HiringTimeline;
  // Step 19 — always an array of 3, unused rows have empty strings
  previousEstimates: [PreviousEstimate, PreviousEstimate, PreviousEstimate];
}



export interface ContactInfo {
    firstName: string;
    lastName: string;
    email: string
    phone?: string;
    preferredContact?: 'call' | 'text' | 'email';
    zipCode: string;
    country: string;
}


export interface AttachedPdf {
    name: string;
    url: string; // url pointing to location it is stored
}
export type ContractorMatchStatus =
  | 'pending'           // default, no action taken yet
  | 'matched'           // matched with a contractor
  | 'emailed'           // followed up via email
  | 'called'            // followed up via phone call
  | 'texted'            // followed up via text
  | 'no-response'       // attempted contact, no reply
  | 'completed'         // fully resolved

export interface Estimate {
    /*Metadata */
    id: string;
    estimateId: string; // New: 10-14 character alphanumeric ID
    timestamp: string; // ISO Date string

    /*Results of Estimate Calculator*/
    estimateAmount: number; // Computed average estimate in USD at time of submission 
    estimateResults: CalculationResult; // Results from gemini
    data: EstimateData; // Complete snapshot of all 19 question answers at time of submission 
    testingStatus: YesNoUnsure;

    //  Service requests 
    requestRealEstimates: boolean;// User opted in to being matched with local contractors - handled on your end 
    requestDiyBlueprint: boolean;// User requested the DIY Remediation Blueprint  - optional shop form with pdf upload/download functionality for user
    requestConsultant: boolean;// User requested a 1-on-1 expert consultation  - optional shop form with pdf upload/download functionality for user

    /*User Info */
    contact: ContactInfo;

    /* Contractor match tracking */
    contractorMatchStatus?: ContractorMatchStatus; // only relevant when requestRealEstimates is true
    contractorMatchUpdatedAt?: string;            // ISO date string of last status change


    /* Admin-uploaded PDFs */
    blueprintPdf?:AttachedPdf;// PDF uploaded by admin to fulfill a blueprint request
    consultationPdf?: AttachedPdf;// PDF uploaded by admin to fulfil a consultation request

    /* Admin fulfillment tracking */
    blueprintDelivered?: boolean;      // PDF was uploaded AND sent/delivered to the user
    consultationDelivered?: boolean;   // PDF was uploaded AND sent/delivered to the user
}


export interface Shop{
  paymentUrl: string;
  pricePoint: number;
}
export interface GlobalStats {

  totalSubmissions: number;       // Total number of submissions ever recorded

  totalAlerts: number;            // Number of submissions with at least one service request checked

  totalEstimateValue: number;     // Sum of all estimateAmount values across every submission, in USD

  averageEstimateValue: number;   // Mean estimateAmount across all submissions, in USD. 0 if no submissions.

  requestRealEstimatesCount: number; // How many users requested contractor matching

  requestDiyBlueprintCount: number;  // How many users requested the DIY Blueprint

  requestConsultantCount: number;    // How many users requested an expert consultation

  needsTestingCount: number;         // How many users answered 'yes' to needing mold testing

  /* Fulfillment queue — anything > 0 needs admin action */
  pendingContractorMatch: number;        // requestRealEstimates && contractorMatchStatus === 'pending'
  pendingBlueprintFulfillment: number;   // requestDiyBlueprint && !blueprintDelivered
  pendingConsultationFulfillment: number;// requestConsultant && !consultationDelivered

  /* Handled counts — progress tracking */
  handledContractorMatch: number;        // contractorMatchStatus === 'completed'
  handledBlueprint: number;              // blueprintDelivered === true
  handledConsultation: number;           // consultationDelivered === true

  /*diy shop */
  diyShop: Shop;
  /*remote consultation shop */
  remoteConsultShop: Shop;
}





export interface EstimateNoId {
    /*Results of Estimate Calculator*/
    estimateAmount: number; // Computed average estimate in USD at time of submission 
    estimateResults: CalculationResult; // Results from gemini
    data: EstimateData; // Complete snapshot of all 19 question answers at time of submission 
    testingStatus: YesNoUnsure;

    //  Service requests 
    requestRealEstimates: boolean;// User opted in to being matched with local contractors
    requestDiyBlueprint: boolean;// User requested the DIY Remediation Blueprint 
    requestConsultant: boolean;// User requested a 1-on-1 expert consultation 

    /*User Info */
    contact: ContactInfo;

    /* Contractor match tracking */
    contractorMatchStatus?: ContractorMatchStatus; // only relevant when requestRealEstimates is true
    contractorMatchUpdatedAt?: string;            // ISO date string of last status change


    /* Admin-uploaded PDFs */
    blueprintPdf?:AttachedPdf;// PDF uploaded by admin to fulfill a blueprint request
    consultationPdf?: AttachedPdf;// PDF uploaded by admin to fulfil a consultation request

    /* Admin fulfillment tracking */
    blueprintDelivered?: boolean;      // PDF was uploaded AND sent/delivered to the user
    consultationDelivered?: boolean;   // PDF was uploaded AND sent/delivered to the user
}