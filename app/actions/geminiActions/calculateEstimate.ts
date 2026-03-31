'use server'

import { GoogleGenAI, Type } from "@google/genai"
import { CalculationResult, EstimateData } from "@/lib/types"

export async function calculateEstimate(data: EstimateData): Promise<{
  success: boolean
  data: CalculationResult | null
  error?: string
}> {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return { 
        success: false, 
        data: null, 
        error: "API_KEY environment variable not set" 
        }
    }
 
    const ai = new GoogleGenAI({ apiKey })
    // Flatten EstimateData into a readable prompt context for Gemini
    const promptContext = JSON.stringify({
      propertyType:        data.propertyType,
      propertySize:        data.propertySize,
      zipCode:             data.zipCode,
      affectedLocations:   data.affectedLocations,
      affectedAreaSize:    data.areaSizeCategory,
      severity:            data.severity,
      cause:               data.cause,
      moistureFixed:       data.moistureFixed,
      moldStartTime:       data.startTime,
      accessibility:       data.accessibility,
      hvacAffected:        data.hvacAffected,
      furnitureAffected:   data.furnitureAffected,
      healthSymptoms:      data.healthSymptoms,
      needsTesting:        data.needsTesting,
      foggingInterest:     data.foggingInterest,
      planInsuranceClaim:  data.planInsuranceClaim,
      hasInsurance:        data.hasInsurance,
      hiringTimeline:      data.hiringTimeline,
      previousEstimates:   data.previousEstimates.filter(e => e.companyName || e.priceEstimate),
    })

    const systemInstruction = `
      You are a certified mold remediation cost estimator with 20+ years of experience
      across residential and commercial properties in the United States.

      You have received a detailed property assessment from a homeowner covering mold
      location, severity, cause, accessibility, affected systems, and property details.

      Your task:
      1. Analyze the assessment data thoroughly.
      2. Calculate a realistic mold remediation cost estimate in USD based on:
         - The affected area size and number of locations
         - Severity and accessibility of the mold growth
         - Whether HVAC, furniture, or structural elements are involved
         - Regional pricing adjustments based on zip code prefix
         - Whether professional testing was requested (needsTesting === 'yes')
         - Whole-home fogging cost should ONLY be included if foggingInterest === 'yes'. If foggingInterest is 'interested', 'not-sure', or 'no', foggingCost must be 0.
      3. Break the estimate into its component cost drivers.
      4. Return a low estimate (roughly 20% below average) and a high estimate (roughly 20% above average).

      Pricing guidelines to anchor your estimates:
      - Base costs by area: <10 sqft=$350, 10-25=$750, 25-100=$2200, 100-300=$5500, 300+=$12000
      - Severity multipliers: minor=1.0x, moderate=1.4x, severe=2.2x, critical=3.5x
      - Accessibility multipliers: easy=1.0x, drywall=1.3x, crawl-space=1.8x, attic=1.6x, demolition=2.5x
      - Additional: mold testing=$350, HVAC remediation=$1200, furniture/contents=$600, commercial surcharge=$1000
      - Fogging by property size: <1000sqft=$1500, 1000-2000=$2625, 2000-3000=$4375, 3000+=$5750
      - High cost zip prefixes (0,1,2,9): multiply base by 1.35
      - Low cost zip prefixes (4,5,6): multiply base by 0.85

      Output strictly in JSON matching the provided schema. All values must be numbers in USD.
    `

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Here is the mold assessment data: ${promptContext}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lowEstimate: {
              type: Type.NUMBER,
              description: 'Low end of the cost range in USD (roughly averageEstimate * 0.8)',
            },
            highEstimate: {
              type: Type.NUMBER,
              description: 'High end of the cost range in USD (roughly averageEstimate * 1.2)',
            },
            averageEstimate: {
              type: Type.NUMBER,
              description: 'Most likely total remediation cost in USD',
            },
            breakdown: {
              type: Type.OBJECT,
              description: 'Itemized cost breakdown in USD',
              properties: {
                baseCost: {
                  type: Type.NUMBER,
                  description: 'Base remediation cost determined by affected area size',
                },
                severityAdjustment: {
                  type: Type.NUMBER,
                  description: 'Additional cost due to mold severity level',
                },
                complexityAdjustment: {
                  type: Type.NUMBER,
                  description: 'Additional cost due to access difficulty',
                },
                additionalServices: {
                  type: Type.NUMBER,
                  description: 'Testing, HVAC remediation, furniture removal, commercial surcharge combined',
                },
                foggingCost: {
                  type: Type.NUMBER,
                  description: 'Whole-home fogging cost in USD. Must be 0 unless foggingInterest is exactly "yes". If foggingInterest is "interested", "not-sure", or "no", this must be 0.',
                },
              },
              required: ['baseCost', 'severityAdjustment', 'complexityAdjustment', 'additionalServices', 'foggingCost'],
            },
          },
          required: ['lowEstimate', 'highEstimate', 'averageEstimate', 'breakdown'],
        },
      },
    })

    const text = response.text
    if (!text) throw new Error('No response from Gemini')

    const parsed = JSON.parse(text) as CalculationResult

    return { success: true, data: parsed }

  } catch (error) {
    console.error('calculateEstimate Gemini error:', error)
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}