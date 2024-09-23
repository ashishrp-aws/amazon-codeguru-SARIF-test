// Source: Semgrep Typescript
// Link:https://code.amazon.com/packages/AWSGuruTypeScriptSecurityBenchmarks/blobs/mainline/--/datasets/aws_guru_type_script_security_benchmarks/Original_converted_ts/javascript-semgrep/javascript/audit/detect-replaceall-sanitization.ts
import DOMPurify from "dompurify";

function encodeProductDescription(tableData: any[]) {
  for (let i = 0; i < tableData.length; i++) {
    // {fact rule=cross-site-scripting@v1.0 defects=1}
    //non-compliant
    // ruleid: detect-replaceall-sanitization-ts-rule
    tableData[i].description = tableData[i].description.replaceAll("<", "&lt;")
    // {/fact}
    // {fact rule=cross-site-scripting@v1.0 defects=1}
    //non-compliant  
    // ruleid: detect-replaceall-sanitization-ts-rule
    tableData[i].description = tableData[i].description.replaceAll(">", "&gt;") 
    // {/fact}

    // {fact rule=cross-site-scripting@v1.0 defects=0}
    //  compliant: because it uses a  DOMPurify sanitizer.
    // ok: detect-replaceall-sanitization-ts-rule
    tableData[i].description = DOMPurify.sanitize(
      tableData[i].description.replaceAll("<", "left angle bracket")
    );
    // {/fact}
  }
}
