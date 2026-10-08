document.addEventListener('DOMContentLoaded', () => {
    // Copy code button handler
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const code = `from logiflow import PayoutEngine, ClaudeReasoner\nengine = PayoutEngine(model="claude-3-5-sonnet", auto_audit=True)\nresult = engine.reconcile_dispatch(bill_of_lading="bol_88923.pdf", freight_rate_card="contract_tier1.json", tolerance_threshold=0.005)\nprint(f"Status: {result.status} | Audit Score: {result.confidence}%")`;
            navigator.clipboard.writeText(code).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
            });
        });
    }

    // Interactive Demo Sandbox
    const runBtn = document.getElementById('run-audit-btn');
    const scenarioSelect = document.getElementById('scenario-select');
    const outputConsole = document.getElementById('audit-output');

    const demoResponses = {
        standard: {
            status: "APPROVED",
            audit_id: "aud_9921_x8",
            model: "claude-3-5-sonnet-20241022",
            timestamp: new Date().toISOString(),
            line_items_validated: 4,
            base_freight: "$3,200.00",
            fuel_surcharge: "$250.00",
            total_settlement: "$3,450.00",
            variance_detected: "$0.00",
            confidence_score: "99.8%",
            automated_action: "ACH Payout Triggered via Stripe Logistics Rail"
        },
        discrepancy: {
            status: "FLAGGED_FOR_REVIEW",
            audit_id: "aud_9922_y4",
            model: "claude-3-5-sonnet-20241022",
            timestamp: new Date().toISOString(),
            line_items_validated: 5,
            base_freight: "$3,200.00",
            fuel_surcharge_claimed: "$920.00",
            fuel_surcharge_contracted: "$580.00",
            variance_detected: "+$340.00 (Exceeds DOE Index Cap)",
            confidence_score: "98.4%",
            automated_action: "Discrepancy Ticket #8812 opened & carrier notified"
        },
        detention: {
            status: "ADJUSTED_APPROVAL",
            audit_id: "aud_9923_z1",
            model: "claude-3-5-sonnet-20241022",
            timestamp: new Date().toISOString(),
            line_items_validated: 3,
            base_freight: "$2,500.00",
            detention_claimed_hours: "6.5 hrs ($390.00)",
            geofence_verified_hours: "4.0 hrs ($240.00)",
            adjusted_payout: "$2,740.00",
            confidence_score: "99.1%",
            automated_action: "Auto-adjusted based on GPS dwell telemetry and approved"
        }
    };

    if (runBtn && scenarioSelect && outputConsole) {
        runBtn.addEventListener('click', () => {
            const selected = scenarioSelect.value;
            outputConsole.innerHTML = '<span style="color:#fbbf24;">[1/3] Parsing dispatch documents with Claude 3.5 Sonnet Vision...\n[2/3] Validating against MSA contract terms...\n[3/3] Computing real-time settlement hash...</span>';
            
            runBtn.disabled = true;
            runBtn.textContent = 'Auditing with Claude...';

            setTimeout(() => {
                const responseData = demoResponses[selected] || demoResponses.standard;
                outputConsole.textContent = JSON.stringify(responseData, null, 2);
                runBtn.disabled = false;
                runBtn.textContent = 'Run Autonomous Audit';
            }, 600);
        });
    }
});
