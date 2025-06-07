/**
 * TypeScript types that correspond to the Rust structs for spreadsheet parsing
 */

export interface EvidenceSet {
    quotes: string
    tables: string
    reasoning: string
}

export interface SupportingEvidence {
    researchGoal: EvidenceSet
    targetCondition: EvidenceSet
    sensorDevice: EvidenceSet
    deviceType: EvidenceSet
    category: EvidenceSet
    sensorType: EvidenceSet
    method: EvidenceSet
    placement: EvidenceSet
    measurementVariable: EvidenceSet
    benefits: EvidenceSet
    primaryPurpose: EvidenceSet
    performanceMetrics: EvidenceSet
    deviceLimitation: EvidenceSet
    measurementUnit: EvidenceSet
    measurementPrecision: EvidenceSet
}

export interface ResearchRecord {
    // Basic publication info
    title: string
    authors: string
    doi: string
    doiLink: string
    venue: string
    citationCount: string
    year: string
    filename: string

    // Research details
    researchGoal: string
    targetCondition: string
    hasSensorDevice: string
    deviceType: string
    category: string
    sensorType: string
    method: string
    placement: string
    measurementVariable: string
    benefits: string
    primaryPurpose: string
    performanceMetrics: string
    deviceLimitation: string
    measurementUnit: string
    measurementPrecision: string

    // Supporting evidence (grouped by category)
    supportingEvidence: SupportingEvidence
}

export interface ParsedSpreadsheet {
    records: ResearchRecord[]
    totalCount: number
}

// Utility types for filtering and searching
export type ResearchRecordField = keyof Omit<ResearchRecord, 'supportingEvidence'>
export type EvidenceField = keyof SupportingEvidence
export type EvidenceType = keyof EvidenceSet

// Search and filter utilities
export interface SearchFilters {
    category?: string
    sensorType?: string
    year?: string
    venue?: string
    deviceType?: string
}

export interface SearchResult {
    record: ResearchRecord
    matchedFields: ResearchRecordField[]
    relevanceScore: number
}
