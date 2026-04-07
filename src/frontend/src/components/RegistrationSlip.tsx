const FIELD_PAIRS: Array<[string, string, string, string]> = [
  ["Full Name", "fullName", "Date of Birth", "dob"],
  ["Mobile Number", "mobile", "Gender", "gender"],
  ["Email ID", "email", "Category", "category"],
  ["Profession", "profession", "Educational Qualification", "qualification"],
  [
    "Institution / Org.",
    "institution",
    "Year of Graduation",
    "yearOfGraduation",
  ],
  ["ABC ID", "abcId", "Local Chapter", "localChapter"],
  ["Preferred Exam City", "preferredCity", "Aadhaar Number", "aadhaarNumber"],
];

interface RegistrationSlipProps {
  exam: { id: bigint; title: string; category: string; examDate: string };
  candidateInfo: Record<string, string>;
  registrationId: string;
}

export default function RegistrationSlip({
  exam,
  candidateInfo,
  registrationId,
}: RegistrationSlipProps) {
  const generatedDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const val = (key: string): string => {
    const v = candidateInfo[key];
    if (!v) return "—";
    if (key === "aadhaarNumber" && v.length >= 4) {
      return `XXXX-XXXX-${v.slice(-4)}`;
    }
    return v;
  };

  const cellBase: React.CSSProperties = {
    padding: "5px 8px",
    verticalAlign: "top" as const,
    fontSize: "9.5pt",
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "210mm",
        margin: "0 auto",
        padding: "14mm 16mm",
        fontFamily: "'Times New Roman', Georgia, 'DejaVu Serif', serif",
        color: "#000000",
        background: "#ffffff",
        fontSize: "10.5pt",
        lineHeight: "1.45",
        boxSizing: "border-box" as const,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          textAlign: "center",
          paddingBottom: "10px",
          marginBottom: "8px",
          borderBottom: "3px double #000000",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "6px",
          }}
        >
          {/* Emblem placeholder */}
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "2px solid #000",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              flexShrink: 0,
            }}
          >
            🎓
          </div>
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontSize: "16pt",
                fontWeight: "bold",
                letterSpacing: "0.04em",
                textTransform: "uppercase" as const,
              }}
            >
              Online Exam Registration Portal
            </div>
            <div style={{ fontSize: "9pt", color: "#333", marginTop: "2px" }}>
              Ministry of Education, Government of India
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: "13pt",
            fontWeight: "bold",
            textTransform: "uppercase" as const,
            letterSpacing: "0.05em",
            borderTop: "1px solid #ccc",
            paddingTop: "6px",
          }}
        >
          Examination Registration Confirmation Slip
        </div>
        <div style={{ fontSize: "8.5pt", color: "#555", marginTop: "2px" }}>
          (Computer-generated document — no physical signature required)
        </div>
      </div>

      {/* ── Registration Meta ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px 0 8px 0",
          marginBottom: "8px",
          borderBottom: "1.5px solid #000",
        }}
      >
        <div>
          <span style={{ fontWeight: "bold" }}>Registration No.&nbsp;</span>
          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontWeight: "bold",
              fontSize: "12pt",
              letterSpacing: "0.08em",
              background: "#f0f0f0",
              padding: "1px 8px",
              border: "1px solid #bbb",
            }}
          >
            {registrationId}
          </span>
        </div>
        <div style={{ fontSize: "9.5pt" }}>
          <span style={{ fontWeight: "bold" }}>Date of Issue:&nbsp;</span>
          {generatedDate}
        </div>
      </div>

      {/* ── Part A: Exam Details ── */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "8px",
          border: "1.5px solid #000",
        }}
      >
        <thead>
          <tr>
            <th
              colSpan={6}
              style={{
                background: "#1a1a1a",
                color: "#ffffff",
                padding: "5px 8px",
                textAlign: "left" as const,
                fontSize: "9pt",
                fontWeight: "bold",
                textTransform: "uppercase" as const,
                letterSpacing: "0.06em",
              }}
            >
              Part A — Examination Details
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                ...cellBase,
                fontWeight: "bold",
                fontSize: "9pt",
                color: "#333",
                width: "13%",
                borderRight: "1px solid #ccc",
              }}
            >
              Course Title
            </td>
            <td
              style={{
                ...cellBase,
                width: "37%",
                borderRight: "1.5px solid #000",
              }}
            >
              {exam.title}
            </td>
            <td
              style={{
                ...cellBase,
                fontWeight: "bold",
                fontSize: "9pt",
                color: "#333",
                width: "10%",
                borderRight: "1px solid #ccc",
              }}
            >
              Category
            </td>
            <td
              style={{
                ...cellBase,
                width: "22%",
                borderRight: "1.5px solid #000",
              }}
            >
              {exam.category}
            </td>
            <td
              style={{
                ...cellBase,
                fontWeight: "bold",
                fontSize: "9pt",
                color: "#333",
                width: "9%",
                borderRight: "1px solid #ccc",
              }}
            >
              Exam Date
            </td>
            <td style={{ ...cellBase, width: "9%" }}>{exam.examDate}</td>
          </tr>
        </tbody>
      </table>

      {/* ── Part B: Candidate Details ── */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "10px",
          border: "1.5px solid #000",
        }}
      >
        <thead>
          <tr>
            <th
              colSpan={4}
              style={{
                background: "#1a1a1a",
                color: "#ffffff",
                padding: "5px 8px",
                textAlign: "left" as const,
                fontSize: "9pt",
                fontWeight: "bold",
                textTransform: "uppercase" as const,
                letterSpacing: "0.06em",
              }}
            >
              Part B — Candidate Details
            </th>
          </tr>
        </thead>
        <tbody>
          {FIELD_PAIRS.map(
            ([leftLabel, leftKey, rightLabel, rightKey], idx) => (
              <tr
                key={leftKey}
                style={{
                  borderBottom:
                    idx < FIELD_PAIRS.length - 1 ? "1px solid #ddd" : undefined,
                  background: idx % 2 === 0 ? "#ffffff" : "#fafafa",
                }}
              >
                <td
                  style={{
                    ...cellBase,
                    fontWeight: "bold",
                    fontSize: "9pt",
                    color: "#222",
                    width: "20%",
                    borderRight: "1px solid #ccc",
                  }}
                >
                  {leftLabel}
                </td>
                <td
                  style={{
                    ...cellBase,
                    width: "30%",
                    borderRight: "1.5px solid #000",
                  }}
                >
                  {val(leftKey)}
                </td>
                <td
                  style={{
                    ...cellBase,
                    fontWeight: "bold",
                    fontSize: "9pt",
                    color: "#222",
                    width: "20%",
                    borderRight: "1px solid #ccc",
                  }}
                >
                  {rightLabel}
                </td>
                <td style={{ ...cellBase, width: "30%" }}>{val(rightKey)}</td>
              </tr>
            ),
          )}
        </tbody>
      </table>

      {/* ── Signature Area ── */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "10px",
          border: "1px solid #999",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                padding: "10px 16px",
                width: "50%",
                borderRight: "1px solid #999",
              }}
            >
              <div style={{ height: "52px" }} />
              <div
                style={{
                  borderTop: "1px solid #000",
                  paddingTop: "4px",
                  fontSize: "8.5pt",
                  textAlign: "center" as const,
                }}
              >
                Candidate&apos;s Signature
              </div>
            </td>
            <td style={{ padding: "10px 16px", width: "50%" }}>
              <div style={{ height: "52px" }} />
              <div
                style={{
                  borderTop: "1px solid #000",
                  paddingTop: "4px",
                  fontSize: "8.5pt",
                  textAlign: "center" as const,
                }}
              >
                Invigilator / Centre Verification Stamp
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── Footer ── */}
      <div
        style={{
          borderTop: "2px solid #000",
          paddingTop: "6px",
          fontSize: "8pt",
          color: "#444",
        }}
      >
        <p style={{ margin: "0 0 2px 0" }}>
          <strong>Important:</strong> Please carry this slip along with a valid
          government-issued photo ID to the examination centre. Keep this slip
          safely for your records.
        </p>
        <p style={{ margin: "0" }}>
          Generated on: {generatedDate}&nbsp;|&nbsp;Online Exam Registration
          Portal&nbsp;|&nbsp;Ministry of Education, Government of India
        </p>
      </div>
    </div>
  );
}
