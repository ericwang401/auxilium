use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs::File;
use std::io::Write;
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;

#[derive(Debug, Serialize, Deserialize)]
pub struct ResearchRecord {
    // Basic publication info
    pub title: String,
    pub authors: String,
    pub doi: String,
    #[serde(rename = "doiLink")]
    pub doi_link: String,
    pub venue: String,
    #[serde(rename = "citationCount")]
    pub citation_count: String,
    pub year: String,
    pub filename: String,

    // Research details
    #[serde(rename = "researchGoal")]
    pub research_goal: String,
    #[serde(rename = "targetCondition")]
    pub target_condition: String,
    #[serde(rename = "hasSensorDevice")]
    pub has_sensor_device: String,
    #[serde(rename = "deviceType")]
    pub device_type: String,
    pub category: String,
    #[serde(rename = "sensorType")]
    pub sensor_type: String,
    pub method: String,
    pub placement: String,
    #[serde(rename = "measurementVariable")]
    pub measurement_variable: String,
    pub benefits: String,
    #[serde(rename = "primaryPurpose")]
    pub primary_purpose: String,
    #[serde(rename = "performanceMetrics")]
    pub performance_metrics: String,
    #[serde(rename = "deviceLimitation")]
    pub device_limitation: String,
    #[serde(rename = "measurementUnit")]
    pub measurement_unit: String,
    #[serde(rename = "measurementPrecision")]
    pub measurement_precision: String,

    // Supporting evidence (grouped by category)
    #[serde(rename = "supportingEvidence")]
    pub supporting_evidence: SupportingEvidence,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupportingEvidence {
    #[serde(rename = "researchGoal")]
    pub research_goal: EvidenceSet,
    #[serde(rename = "targetCondition")]
    pub target_condition: EvidenceSet,
    #[serde(rename = "sensorDevice")]
    pub sensor_device: EvidenceSet,
    #[serde(rename = "deviceType")]
    pub device_type: EvidenceSet,
    pub category: EvidenceSet,
    #[serde(rename = "sensorType")]
    pub sensor_type: EvidenceSet,
    pub method: EvidenceSet,
    pub placement: EvidenceSet,
    #[serde(rename = "measurementVariable")]
    pub measurement_variable: EvidenceSet,
    pub benefits: EvidenceSet,
    #[serde(rename = "primaryPurpose")]
    pub primary_purpose: EvidenceSet,
    #[serde(rename = "performanceMetrics")]
    pub performance_metrics: EvidenceSet,
    #[serde(rename = "deviceLimitation")]
    pub device_limitation: EvidenceSet,
    #[serde(rename = "measurementUnit")]
    pub measurement_unit: EvidenceSet,
    #[serde(rename = "measurementPrecision")]
    pub measurement_precision: EvidenceSet,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EvidenceSet {
    pub quotes: String,
    pub tables: String,
    pub reasoning: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ParsedSpreadsheet {
    pub records: Vec<ResearchRecord>,
    #[serde(rename = "totalCount")]
    pub total_count: usize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ReviewExport {
    pub filename: String,
    pub ratings: HashMap<String, f32>,
}

#[tauri::command]
pub fn parse_spreadsheet(file_path: String) -> Result<ParsedSpreadsheet, String> {
    let file = File::open(&file_path).map_err(|e| format!("Failed to open file: {}", e))?;

    let mut reader = csv::Reader::from_reader(file);
    let mut records = Vec::new();

    for result in reader.records() {
        let record = result.map_err(|e| format!("Failed to read CSV record: {}", e))?;

        // Parse each record with more robust error handling
        let parsed_record = parse_csv_record(&record)?;
        records.push(parsed_record);
    }

    Ok(ParsedSpreadsheet {
        total_count: records.len(),
        records,
    })
}

fn parse_csv_record(record: &csv::StringRecord) -> Result<ResearchRecord, String> {
    // Helper function to safely get field or return empty string
    let get_field = |index: usize| -> String { record.get(index).unwrap_or("").to_string() };

    Ok(ResearchRecord {
        // Basic publication info (columns 0-7)
        title: get_field(0),
        authors: get_field(1),
        doi: get_field(2),
        doi_link: get_field(3),
        venue: get_field(4),
        citation_count: get_field(5),
        year: get_field(6),
        filename: get_field(7),

        // Research details (columns 8-22)
        research_goal: get_field(8),
        target_condition: get_field(9),
        has_sensor_device: get_field(10),
        device_type: get_field(11),
        category: get_field(12),
        sensor_type: get_field(13),
        method: get_field(14),
        placement: get_field(15),
        measurement_variable: get_field(16),
        benefits: get_field(17),
        primary_purpose: get_field(18),
        performance_metrics: get_field(19),
        device_limitation: get_field(20),
        measurement_unit: get_field(21),
        measurement_precision: get_field(22),

        // Supporting evidence (remaining columns)
        supporting_evidence: SupportingEvidence {
            research_goal: EvidenceSet {
                quotes: get_field(23),
                tables: get_field(24),
                reasoning: get_field(25),
            },
            target_condition: EvidenceSet {
                quotes: get_field(26),
                tables: get_field(27),
                reasoning: get_field(28),
            },
            sensor_device: EvidenceSet {
                quotes: get_field(29),
                tables: get_field(30),
                reasoning: get_field(31),
            },
            device_type: EvidenceSet {
                quotes: get_field(32),
                tables: get_field(33),
                reasoning: get_field(34),
            },
            category: EvidenceSet {
                quotes: get_field(35),
                tables: get_field(36),
                reasoning: get_field(37),
            },
            sensor_type: EvidenceSet {
                quotes: get_field(38),
                tables: get_field(39),
                reasoning: get_field(40),
            },
            method: EvidenceSet {
                quotes: get_field(41),
                tables: get_field(42),
                reasoning: get_field(43),
            },
            placement: EvidenceSet {
                quotes: get_field(44),
                tables: get_field(45),
                reasoning: get_field(46),
            },
            measurement_variable: EvidenceSet {
                quotes: get_field(47),
                tables: get_field(48),
                reasoning: get_field(49),
            },
            benefits: EvidenceSet {
                quotes: get_field(50),
                tables: get_field(51),
                reasoning: get_field(52),
            },
            primary_purpose: EvidenceSet {
                quotes: get_field(53),
                tables: get_field(54),
                reasoning: get_field(55),
            },
            performance_metrics: EvidenceSet {
                quotes: get_field(56),
                tables: get_field(57),
                reasoning: get_field(58),
            },
            device_limitation: EvidenceSet {
                quotes: get_field(59),
                tables: get_field(60),
                reasoning: get_field(61),
            },
            measurement_unit: EvidenceSet {
                quotes: get_field(62),
                tables: get_field(63),
                reasoning: get_field(64),
            },
            measurement_precision: EvidenceSet {
                quotes: get_field(65),
                tables: get_field(66),
                reasoning: get_field(67),
            },
        },
    })
}

#[tauri::command]
pub fn export_reviews(app: AppHandle, reviews: Vec<ReviewExport>) -> Result<(), String> {
    let mut writer = csv::Writer::from_writer(vec![]);

    // Write header
    writer
        .write_record(&[
            "filename",
            "Research Goal",
            "Target condition",
            "Sensor, device, imaging technique, or labratory testing mentioned?",
            "Device / sensor / technique/ test/ inspection type",
            "Category",
            "Sensor Type",
            "Method",
            "Placement",
            "Measurement Variable",
            "Benefits of use",
            "Primary Purpose",
            "Performance Metrics",
            "Device Limitation",
            "Measurement Unit",
            "Measurement Precision",
        ])
        .map_err(|e| e.to_string())?;

    // Write data rows
    for review in reviews {
        let mut record = vec![review.filename];
        let fields = [
            "research_goal",
            "target_condition",
            "has_sensor_device",
            "device_type",
            "category",
            "sensor_type",
            "method",
            "placement",
            "measurement_variable",
            "benefits",
            "primary_purpose",
            "performance_metrics",
            "device_limitation",
            "measurement_unit",
            "measurement_precision",
        ];

        for field in fields {
            let rating = review.ratings.get(field).unwrap_or(&0.0);
            record.push(rating.to_string());
        }

        writer.write_record(&record).map_err(|e| e.to_string())?;
    }

    let data = writer.into_inner().map_err(|e| e.to_string())?;

    // Open save dialog
    app.dialog()
        .file()
        .add_filter("CSV", &["csv"])
        .set_file_name("review-export.csv")
        .save_file(move |file_path| {
            if let Some(path) = file_path {
                if let Some(path) = path.as_path() {
                    if let Ok(mut file) = File::create(path) {
                        let _ = file.write_all(&data);
                    }
                }
            }
        });

    Ok(())
}
