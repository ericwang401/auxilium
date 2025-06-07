import { TabsContent } from '@/components/ui/tabs.tsx'
import PaperCard from '@/components/interfaces/home/PaperCard.tsx'
import { Paper } from '@/types'

export const examplePaper: Paper = {
    title: 'Transcriptome analysis identifies the NR4A subfamily involved in the alleviating effect of folic acid on mastitis induced by high concentration of Staphylococcus aureus lipoteichoic acid',
    authors: 'Quanzhen Chen, Siyuan Mi, Yue Xing, Songyan An, Siqian Chen, Yongjie Tang, Yajing Wang, Ying Yu',
    doi: '10.1016/j.vetmic.2023.109885',
    doiLink: 'https://doi.org/10.1016/j.vetmic.2023.109885',
    venue: 'BMC Genomics',
    citationCount: '12',
    year: '2024',
    filename: 'transcriptome_analysis.pdf',
    researchGoal: 'To investigate the role of folic acid in alleviating mastitis caused by Staphylococcus aureus.',
    targetCondition: 'Mastitis induced by Staphylococcus aureus lipoteichoic acid',
    hasSensorDevice: 'No',
    deviceType: 'N/A',
    category: 'Mastitis',
    sensorType: 'N/A',
    method: 'Transcriptome analysis',
    placement: 'N/A',
    measurementVariable: 'Gene expression levels',
    benefits: `- Anti-inflammatory and anti-apoptotic effects
- Reduction in somatic cell count (SCC)
- Inhibition of apoptosis and necrosis in mammary epithelial cells
- Modulation of cell cycle and DNA replication pathways
- Inhibition of NR4A subfamily expression related to apoptosis and inflammation`,
    primaryPurpose: 'Alleviation of mastitis symptoms',
    performanceMetrics: 'Reduction in inflammation markers',
    deviceLimitation: 'N/A',
    measurementUnit: 'Gene expression (FPKM)',
    measurementPrecision: 'High',
    supportingEvidence: {
        researchGoal: {
            quotes: 'Folic acid has a protective effect on mastitis.',
            tables: 'Table 1: Gene expression changes',
            reasoning: 'Folic acid reduces inflammation in mastitis.'
        },
        targetCondition: {
            quotes: 'Mastitis is a common condition in dairy cows.',
            tables: 'Table 2: Mastitis symptoms',
            reasoning: 'Understanding the condition helps in treatment.'
        },
        sensorDevice: {
            quotes: 'No sensor devices used in this study.',
            tables: '',
            reasoning: ''
        },
        deviceType: {
            quotes: '',
            tables: '',
            reasoning: ''
        },
        category: {
            quotes: '',
            tables: '',
            reasoning: ''
        },
        sensorType: {
            quotes: '',
            tables: '',
            reasoning: ''
        },
        method: {
            quotes: '',
            tables: '',
            reasoning: ''
        },
        placement: {
            quotes: '',
            tables: '',
            reasoning: ''
        },
        measurementVariable: {
            quotes: '',
            tables: '',
            reasoning: ''
        },
        benefits: {
            quotes: `  - "Folic acid (FA) has anti-inflammatory and anti-apoptotic effects."
  - "FA supplementation may be a treatment option for chronic inflammatory diseases"
  - "Our previous studies have shown that perinatal supplementation with FA significantly reduces SCC"
  - "FA also inhibited the apoptosis and necrosis of Mac-T cells induced by S. aureus"
  - "FA alleviated aLTA-induced apoptosis, and alternative splicing and gene expression regulation were almost independent of each other in reducing aLTAinduced apoptosis."
  - "the alleviation of apoptosis by FA is related to the cell cycle and DNA replication pathways."
  - "FA significantly inhibited the expression of the NR4A subfamily at the cellular level."
  - "the NR4A subfamily were considered as candidate genes involved in the alleviating effect of FA on mastitis induced by high concentration of aLTA."`,
            tables: '',
            reasoning: `- The paper discusses the benefits of using folic acid (FA) in the context of alleviating mastitis induced by Staphylococcus aureus lipoteichoic acid (aLTA).
- FA is highlighted for its anti-inflammatory and anti-apoptotic effects, which are beneficial in reducing the severity of mastitis.
- The paper mentions that FA supplementation can reduce somatic cell count (SCC), which is a measure of milk quality and health.
- FA is shown to inhibit apoptosis and necrosis in mammary epithelial cells, which helps in maintaining tissue integrity.
- The alleviation of apoptosis by FA is linked to its effects on cell cycle and DNA replication pathways, indicating a mechanistic benefit.
- FA's ability to inhibit the expression of the NR4A subfamily suggests a role in modulating gene expression related to apoptosis and inflammation.
- Overall, the benefits of using FA include its anti-inflammatory and anti-apoptotic effects, reduction in SCC, and modulation of gene expression related to mastitis.`
        },
        primaryPurpose: {
            quotes: '',
            tables: '',
            reasoning: ''
        },
        performanceMetrics: {
            quotes: '',
            tables: '',
            reasoning: ''
        },
        deviceLimitation: {
            quotes: '',
            tables: '',
            reasoning: ''
        },
        measurementUnit: {
            quotes: '',
            tables: '',
            reasoning: ''
        },
        measurementPrecision: {
            quotes: '',
            tables: '',
            reasoning: ''
        }
    }
}

const AllTab = () => {
    return (
        <TabsContent className={'flex flex-col divide-y max-w-4xl m-auto'} value={'all'}>
            <PaperCard paper={examplePaper} />
            <PaperCard paper={examplePaper} />
        </TabsContent>
    )
}

export default AllTab