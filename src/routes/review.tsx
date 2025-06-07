import { createFileRoute, useNavigate } from '@tanstack/react-router'
import useResearchReviewStore from '@/stores/research-review-store'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export const Route = createFileRoute('/review')({
    component: Review,
})

function Review() {
    const {
        getCurrentRecord,
        getCurrentRecordReview,
        getReviewProgress,
        currentRecordIndex,
        totalCount,
        nextRecord,
        previousRecord,
        setDetailReview,
        setOverallReview,
        addNotes,
        getRecordId,
    } = useResearchReviewStore()

    const navigate = useNavigate()
    const currentRecord = getCurrentRecord()
    const currentReview = getCurrentRecordReview()
    const progress = getReviewProgress()
    
    const [activeTab, setActiveTab] = useState<'details' | 'evidence'>('details')

    // If no record is loaded, redirect back to home
    if (!currentRecord) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">No spreadsheet loaded</h2>
                    <Button onClick={() => navigate({ to: '/' })}>
                        Go back to select a file
                    </Button>
                </div>
            </div>
        )
    }

    const recordId = getRecordId(currentRecord)

    const handleDetailReview = (field: keyof NonNullable<typeof currentReview>['reviews'], status: 'correct' | 'incorrect') => {
        if (!currentReview) return
        setDetailReview(recordId, field, status)
    }

    const detailFields = [
        { key: 'researchGoal', label: 'Research Goal', evidenceKey: 'researchGoal' },
        { key: 'targetCondition', label: 'Target Condition', evidenceKey: 'targetCondition' },
        { key: 'hasSensorDevice', label: 'Has Sensor/Device', evidenceKey: 'sensorDevice' },
        { key: 'deviceType', label: 'Device Type', evidenceKey: 'deviceType' },
        { key: 'category', label: 'Category', evidenceKey: 'category' },
        { key: 'sensorType', label: 'Sensor Type', evidenceKey: 'sensorType' },
        { key: 'method', label: 'Method', evidenceKey: 'method' },
        { key: 'placement', label: 'Placement', evidenceKey: 'placement' },
        { key: 'measurementVariable', label: 'Measurement Variable', evidenceKey: 'measurementVariable' },
        { key: 'benefits', label: 'Benefits', evidenceKey: 'benefits' },
        { key: 'primaryPurpose', label: 'Primary Purpose', evidenceKey: 'primaryPurpose' },
        { key: 'performanceMetrics', label: 'Performance Metrics', evidenceKey: 'performanceMetrics' },
        { key: 'deviceLimitation', label: 'Device Limitation', evidenceKey: 'deviceLimitation' },
        { key: 'measurementUnit', label: 'Measurement Unit', evidenceKey: 'measurementUnit' },
        { key: 'measurementPrecision', label: 'Measurement Precision', evidenceKey: 'measurementPrecision' },
    ] as const

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Research Review</h1>
                        <p className="text-sm text-muted-foreground">
                            Record {currentRecordIndex + 1} of {totalCount} • {progress.reviewed} reviewed ({Math.round(progress.percentage)}%)
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={previousRecord}
                            disabled={currentRecordIndex === 0}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            onClick={nextRecord}
                            disabled={currentRecordIndex === totalCount - 1}
                        >
                            Next
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate({ to: '/' })}
                        >
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full flex">
                    {/* Left Panel - Paper Info */}
                    <div className="w-1/3 border-r bg-muted/30 p-6 overflow-y-auto">
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">{currentRecord.title}</h3>
                                <p className="text-sm text-muted-foreground mb-1">
                                    <strong>Authors:</strong> {currentRecord.authors}
                                </p>
                                <p className="text-sm text-muted-foreground mb-1">
                                    <strong>Venue:</strong> {currentRecord.venue} ({currentRecord.year})
                                </p>
                                <p className="text-sm text-muted-foreground mb-1">
                                    <strong>Citations:</strong> {currentRecord.citationCount}
                                </p>
                                {currentRecord.doi && (
                                    <p className="text-sm text-muted-foreground">
                                        <strong>DOI:</strong> {currentRecord.doi}
                                    </p>
                                )}
                            </div>

                            {/* Overall Status */}
                            <div className="pt-4 border-t">
                                <h4 className="font-medium mb-2">Overall Assessment</h4>
                                <div className="flex gap-2 mb-2">
                                    <Button
                                        size="sm"
                                        variant={currentReview?.overallStatus === 'correct' ? 'default' : 'outline'}
                                        onClick={() => setOverallReview(recordId, 'correct')}
                                    >
                                        ✓ Correct
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={currentReview?.overallStatus === 'incorrect' ? 'destructive' : 'outline'}
                                        onClick={() => setOverallReview(recordId, 'incorrect')}
                                    >
                                        ✗ Incorrect
                                    </Button>
                                </div>
                                <textarea
                                    className="w-full p-2 text-sm border rounded resize-none"
                                    placeholder="Add notes..."
                                    rows={3}
                                    value={currentReview?.notes || ''}
                                    onChange={(e) => addNotes(recordId, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Details and Evidence Review */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Tabs */}
                        <div className="border-b p-4">
                            <div className="flex gap-2">
                                <Button
                                    variant={activeTab === 'details' ? 'default' : 'outline'}
                                    onClick={() => setActiveTab('details')}
                                >
                                    Research Details
                                </Button>
                                <Button
                                    variant={activeTab === 'evidence' ? 'default' : 'outline'}
                                    onClick={() => setActiveTab('evidence')}
                                >
                                    Supporting Evidence
                                </Button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            {activeTab === 'details' ? (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold">Review Research Details</h3>
                                    {detailFields.map(({ key, label }) => {
                                        const value = currentRecord[key]
                                        const reviewStatus = currentReview?.reviews[key]

                                        return (
                                            <div key={key} className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium">{label}</h4>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant={reviewStatus === 'correct' ? 'default' : 'outline'}
                                                            onClick={() => handleDetailReview(key, 'correct')}
                                                        >
                                                            ✓
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant={reviewStatus === 'incorrect' ? 'destructive' : 'outline'}
                                                            onClick={() => handleDetailReview(key, 'incorrect')}
                                                        >
                                                            ✗
                                                        </Button>
                                                    </div>
                                                </div>
                                                <p className="text-sm bg-muted p-3 rounded border">
                                                    {value || <em className="text-muted-foreground">No data</em>}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold">Supporting Evidence</h3>
                                    {detailFields.map(({ key, label, evidenceKey }) => {
                                        const evidenceSet = currentRecord.supportingEvidence[evidenceKey as keyof typeof currentRecord.supportingEvidence]
                                        
                                        return (
                                            <div key={key} className="border rounded-lg p-4">
                                                <h4 className="font-medium mb-3">{label} Evidence</h4>
                                                <div className="space-y-3">
                                                    <div>
                                                        <h5 className="text-sm font-medium text-muted-foreground mb-1">Quotes:</h5>
                                                        <p className="text-sm bg-muted/50 p-2 rounded border text-left">
                                                            {evidenceSet.quotes || <em className="text-muted-foreground">No quotes provided</em>}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h5 className="text-sm font-medium text-muted-foreground mb-1">Tables:</h5>
                                                        <p className="text-sm bg-muted/50 p-2 rounded border text-left">
                                                            {evidenceSet.tables || <em className="text-muted-foreground">No tables provided</em>}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h5 className="text-sm font-medium text-muted-foreground mb-1">Reasoning:</h5>
                                                        <p className="text-sm bg-muted/50 p-2 rounded border text-left">
                                                            {evidenceSet.reasoning || <em className="text-muted-foreground">No reasoning provided</em>}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
