import { useState } from "react";

const entities = {
  ChapterEducationSession: {
    label: "Chapter Education Sessions",
    subtitle: "Custom Object (Main)",
    color: "#1a3a5c",
    accent: "#4a90d9",
    x: 380,
    y: 260,
    fields: [
      { name: "session (Auto Number)", type: "Auto Number", pk: true },
      { name: "chapter", type: "Lookup → Account", fk: true },
      { name: "category", type: "Picklist", fk: true },
      { name: "sessionFormatId", type: "Picklist", fk: true },
      { name: "speakerTypeId", type: "Picklist", fk: true },
      { name: "organizationId", type: "Picklist", fk: true },
      { name: "chapterPartnered", type: "Picklist" },
      { name: "dateOccurred", type: "Date/Time" },
      { name: "sessionName", type: "Text" },
      { name: "speaker", type: "Text" },
      { name: "rating", type: "Number (Float)" },
      { name: "evalNumber", type: "Number (Int)" },
      { name: "attendance", type: "Number (Int)" },
      { name: "comments", type: "Long Text" },
      { name: "dateAdded", type: "Date/Time" },
      { name: "speakerPhone", type: "Phone" },
      { name: "speakerEmail", type: "Email" },
      { name: "sessionDescription", type: "Long Text" },
      { name: "commentsOther", type: "Long Text" },
      { name: "acc_clm", type: "Checkbox" },
      { name: "acc_clm_2", type: "Checkbox" },
      { name: "acc_cpe", type: "Checkbox" },
      { name: "acc_cle", type: "Checkbox" },
      { name: "acc_hrci", type: "Checkbox" },
      { name: "acc_shrm", type: "Checkbox" },
      { name: "acc_other", type: "Checkbox" },
      { name: "acc_other_text", type: "Text" },
    ],
  },
  Account: {
    label: "Account (Chapters)",
    subtitle: "Standard Object",
    color: "#1a4a2e",
    accent: "#4caf7d",
    x: 30,
    y: 200,
    fields: [
      { name: "AccountId", type: "ID", pk: true },
      { name: "AccountName", type: "Text (Chapter Name)" },
      { name: "Region", type: "Text / Lookup" },
      { name: "Location", type: "Text (State)" },
      { name: "... (standard fields)", type: "" },
    ],
  },
  CategoryPicklist: {
    label: "Category",
    subtitle: "Picklist (replaces Categories table)",
    color: "#3a1a5c",
    accent: "#9b59b6",
    x: 720,
    y: 50,
    fields: [
      { name: "Label (categoryName)", type: "Picklist Label" },
      { name: "API Value (categoryCode)", type: "Picklist API Name" },
      { name: "e.g. Communication & General Mgmt", type: "→ CM" },
      { name: "Operations Management", type: "→ OM" },
      { name: "Financial Management", type: "→ FM" },
      { name: "Human Resource Management", type: "→ HR" },
      { name: "Legal Industry/Business Mgmt", type: "→ LI" },
    ],
  },
  SessionFormatPicklist: {
    label: "Session Format",
    subtitle: "Picklist (replaces Session_Formats table)",
    color: "#4a2a0a",
    accent: "#e67e22",
    x: 720,
    y: 270,
    fields: [
      { name: "Panel", type: "Picklist Value" },
      { name: "Speaker", type: "Picklist Value" },
      { name: "Workshop", type: "Picklist Value" },
      { name: "Other", type: "Picklist Value" },
    ],
  },
  SpeakerTypePicklist: {
    label: "Speaker Type",
    subtitle: "Picklist (replaces Speaker_Types table)",
    color: "#4a1a1a",
    accent: "#e74c3c",
    x: 720,
    y: 440,
    fields: [
      { name: "Business Partner", type: "Picklist Value" },
      { name: "ALA Member", type: "Picklist Value" },
      { name: "Strategic Alliance", type: "Picklist Value" },
      { name: "Other", type: "Picklist Value" },
    ],
  },
  OrganisationPicklist: {
    label: "Organisation Name",
    subtitle: "Picklist (replaces Partners table)",
    color: "#1a3a3a",
    accent: "#1abc9c",
    x: 720,
    y: 600,
    fields: [
      { name: "ABA LPMS", type: "Picklist Value" },
      { name: "AALL", type: "Picklist Value" },
      { name: "ARMA", type: "Picklist Value" },
      { name: "... 14 total values", type: "" },
    ],
  },
};

const connections = [
  { from: "Account", to: "ChapterEducationSession", label: "Lookup (chapter)", fromSide: "right", toSide: "left" },
  { from: "CategoryPicklist", to: "ChapterEducationSession", label: "Picklist (category)", fromSide: "left", toSide: "right" },
  { from: "SessionFormatPicklist", to: "ChapterEducationSession", label: "Picklist (sessionFormatId)", fromSide: "left", toSide: "right" },
  { from: "SpeakerTypePicklist", to: "ChapterEducationSession", label: "Picklist (speakerTypeId)", fromSide: "left", toSide: "right" },
  { from: "OrganisationPicklist", to: "ChapterEducationSession", label: "Picklist (organizationId)", fromSide: "left", toSide: "right" },
];

const BOX_W = 270;
const BOX_HEADER = 52;
const FIELD_H = 22;

function getBoxHeight(entity) {
  return BOX_HEADER + entity.fields.length * FIELD_H + 12;
}

function getConnectorPoints(fromKey, toKey) {
  const from = entities[fromKey];
  const to = entities[toKey];
  const fh = getBoxHeight(from);
  const th = getBoxHeight(to);

  const conn = connections.find(c => c.from === fromKey && c.to === toKey);
  const fromSide = conn?.fromSide || "right";
  const toSide = conn?.toSide || "left";

  let x1, y1, x2, y2;

  if (fromSide === "right") { x1 = from.x + BOX_W; y1 = from.y + fh / 2; }
  else { x1 = from.x; y1 = from.y + fh / 2; }

  if (toSide === "left") { x2 = to.x; y2 = to.y + th / 2; }
  else { x2 = to.x + BOX_W; y2 = to.y + th / 2; }

  return { x1, y1, x2, y2 };
}

function EntityBox({ eKey, entity, selected, onSelect }) {
  const height = getBoxHeight(entity);
  return (
    <g
      onClick={() => onSelect(eKey)}
      style={{ cursor: "pointer" }}
    >
      <rect
        x={entity.x} y={entity.y}
        width={BOX_W} height={height}
        rx={10}
        fill={entity.color}
        stroke={selected ? "#fff" : entity.accent}
        strokeWidth={selected ? 2.5 : 1.5}
        filter={selected ? "url(#glow)" : "url(#shadow)"}
      />
      {/* Header band */}
      <rect
        x={entity.x} y={entity.y}
        width={BOX_W} height={BOX_HEADER}
        rx={10}
        fill={entity.accent}
        opacity={0.18}
      />
      <rect
        x={entity.x} y={entity.y + BOX_HEADER - 2}
        width={BOX_W} height={2}
        fill={entity.accent}
        opacity={0.4}
      />
      {/* Title */}
      <text x={entity.x + 14} y={entity.y + 21} fill="#fff" fontSize={13} fontWeight="700" fontFamily="'IBM Plex Sans', sans-serif">
        {entity.label}
      </text>
      <text x={entity.x + 14} y={entity.y + 38} fill={entity.accent} fontSize={9.5} fontFamily="'IBM Plex Sans', sans-serif" opacity={0.9}>
        {entity.subtitle}
      </text>

      {/* Fields */}
      {entity.fields.map((f, i) => (
        <g key={i}>
          <rect
            x={entity.x + 1} y={entity.y + BOX_HEADER + i * FIELD_H + 2}
            width={BOX_W - 2} height={FIELD_H - 1}
            fill={i % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.08)"}
          />
          {f.pk && (
            <text x={entity.x + 10} y={entity.y + BOX_HEADER + i * FIELD_H + 15} fill="#ffd700" fontSize={9} fontFamily="monospace">🔑</text>
          )}
          {f.fk && (
            <text x={entity.x + 10} y={entity.y + BOX_HEADER + i * FIELD_H + 15} fill={entity.accent} fontSize={9} fontFamily="monospace">🔗</text>
          )}
          <text
            x={entity.x + (f.pk || f.fk ? 26 : 14)}
            y={entity.y + BOX_HEADER + i * FIELD_H + 15}
            fill={f.pk ? "#ffd700" : f.fk ? entity.accent : "rgba(255,255,255,0.82)"}
            fontSize={10.5}
            fontFamily="'IBM Plex Mono', monospace"
            fontWeight={f.pk || f.fk ? "600" : "400"}
          >
            {f.name}
          </text>
          {f.type && (
            <text
              x={entity.x + BOX_W - 8}
              y={entity.y + BOX_HEADER + i * FIELD_H + 15}
              fill="rgba(255,255,255,0.38)"
              fontSize={9}
              fontFamily="'IBM Plex Mono', monospace"
              textAnchor="end"
            >
              {f.type}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("diagram");

  const totalH = 820;
  const totalW = 1020;

  return (
    <div style={{ background: "#0b0f1a", minHeight: "100vh", fontFamily: "'IBM Plex Sans', sans-serif", color: "#e0e6f0" }}>
      {/* Header */}
      <div style={{ padding: "24px 32px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ width: 8, height: 40, background: "linear-gradient(180deg, #4a90d9, #9b59b6)", borderRadius: 4 }} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.3px" }}>Chapter Education Sessions</div>
            <div style={{ fontSize: 12, color: "#6b7a99", marginTop: 2 }}>MSSQL → Salesforce Migration · ER Diagram & Design Reference</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: -1 }}>
          {["diagram", "explanation", "migration-notes"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 18px", fontSize: 12, border: "none", cursor: "pointer", borderRadius: "6px 6px 0 0",
                background: activeTab === tab ? "#161d2f" : "transparent",
                color: activeTab === tab ? "#4a90d9" : "#6b7a99",
                borderBottom: activeTab === tab ? "2px solid #4a90d9" : "2px solid transparent",
                fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500,
                textTransform: "capitalize",
              }}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px 32px" }}>
        {activeTab === "diagram" && (
          <div>
            <div style={{ fontSize: 11, color: "#6b7a99", marginBottom: 12 }}>
              Click any entity to highlight it. 🔑 Primary Key / Auto Number &nbsp;|&nbsp; 🔗 Foreign Key / Lookup / Picklist Reference
            </div>
            <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", background: "#0e1422" }}>
              <svg width={totalW} height={totalH} style={{ display: "block" }}>
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.5)" />
                  </filter>
                  <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#4a90d9" opacity="0.7" />
                  </marker>
                  <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#9b59b6" opacity="0.7" />
                  </marker>
                  <marker id="arrowOrange" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#e67e22" opacity="0.7" />
                  </marker>
                  <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#e74c3c" opacity="0.7" />
                  </marker>
                  <marker id="arrowTeal" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#1abc9c" opacity="0.7" />
                  </marker>
                  <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#4caf7d" opacity="0.7" />
                  </marker>
                </defs>

                {/* Background grid */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width={totalW} height={totalH} fill="url(#grid)" />

                {/* Connections */}
                {/* Account → Session (Lookup) */}
                {(() => {
                  const { x1, y1, x2, y2 } = getConnectorPoints("Account", "ChapterEducationSession");
                  const mx = (x1 + x2) / 2;
                  return (
                    <g>
                      <path d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
                        fill="none" stroke="#4caf7d" strokeWidth={2} strokeDasharray="6,3" markerEnd="url(#arrowGreen)" opacity={0.7} />
                      <rect x={mx - 34} y={(y1 + y2) / 2 - 9} width={68} height={16} rx={4} fill="#0b0f1a" />
                      <text x={mx} y={(y1 + y2) / 2 + 3} textAnchor="middle" fill="#4caf7d" fontSize={9} fontFamily="'IBM Plex Mono', monospace">Lookup</text>
                    </g>
                  );
                })()}

                {/* Category picklist */}
                {(() => {
                  const from = entities["CategoryPicklist"]; const to = entities["ChapterEducationSession"];
                  const x1 = from.x; const y1 = from.y + getBoxHeight(from) / 2;
                  const x2 = to.x + BOX_W; const y2 = to.y + 120;
                  const mx = (x1 + x2) / 2;
                  return (
                    <g>
                      <path d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
                        fill="none" stroke="#9b59b6" strokeWidth={1.8} strokeDasharray="4,3" markerEnd="url(#arrowPurple)" opacity={0.6} />
                    </g>
                  );
                })()}

                {/* SessionFormat picklist */}
                {(() => {
                  const from = entities["SessionFormatPicklist"]; const to = entities["ChapterEducationSession"];
                  const x1 = from.x; const y1 = from.y + getBoxHeight(from) / 2;
                  const x2 = to.x + BOX_W; const y2 = to.y + 200;
                  const mx = (x1 + x2) / 2;
                  return (
                    <g>
                      <path d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
                        fill="none" stroke="#e67e22" strokeWidth={1.8} strokeDasharray="4,3" markerEnd="url(#arrowOrange)" opacity={0.6} />
                    </g>
                  );
                })()}

                {/* SpeakerType picklist */}
                {(() => {
                  const from = entities["SpeakerTypePicklist"]; const to = entities["ChapterEducationSession"];
                  const x1 = from.x; const y1 = from.y + getBoxHeight(from) / 2;
                  const x2 = to.x + BOX_W; const y2 = to.y + 280;
                  const mx = (x1 + x2) / 2;
                  return (
                    <g>
                      <path d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
                        fill="none" stroke="#e74c3c" strokeWidth={1.8} strokeDasharray="4,3" markerEnd="url(#arrowRed)" opacity={0.6} />
                    </g>
                  );
                })()}

                {/* Organisation picklist */}
                {(() => {
                  const from = entities["OrganisationPicklist"]; const to = entities["ChapterEducationSession"];
                  const x1 = from.x; const y1 = from.y + getBoxHeight(from) / 2;
                  const x2 = to.x + BOX_W; const y2 = to.y + 360;
                  const mx = (x1 + x2) / 2;
                  return (
                    <g>
                      <path d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
                        fill="none" stroke="#1abc9c" strokeWidth={1.8} strokeDasharray="4,3" markerEnd="url(#arrowTeal)" opacity={0.6} />
                    </g>
                  );
                })()}

                {/* Entity boxes */}
                {Object.entries(entities).map(([key, entity]) => (
                  <EntityBox key={key} eKey={key} entity={entity} selected={selected === key} onSelect={setSelected} />
                ))}

                {/* Legend */}
                <g transform="translate(32, 760)">
                  <rect x={0} y={0} width={460} height={36} rx={8} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
                  <line x1={14} y1={18} x2={44} y2={18} stroke="#4caf7d" strokeWidth={2} strokeDasharray="6,3" />
                  <text x={50} y={22} fill="#a0aec0" fontSize={10} fontFamily="'IBM Plex Sans', sans-serif">Lookup Relationship</text>
                  <line x1={170} y1={18} x2={200} y2={18} stroke="#9b59b6" strokeWidth={1.8} strokeDasharray="4,3" />
                  <text x={206} y={22} fill="#a0aec0" fontSize={10} fontFamily="'IBM Plex Sans', sans-serif">Picklist Reference (no FK in SF)</text>
                </g>
              </svg>
            </div>
          </div>
        )}

        {activeTab === "explanation" && (
          <div style={{ maxWidth: 820, display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              {
                color: "#4a90d9", title: "Chapter Education Sessions — Main Custom Object",
                body: "This is the central object. Every session record lives here. It holds all session details, speaker info, accreditation checkboxes, and references to lookup/picklist values. The auto-number field (session) replaces the old integer sessionId primary key — Salesforce generates this automatically in the format you configure (e.g. SES-0001)."
              },
              {
                color: "#4caf7d", title: "Account (Chapters) — Standard Object via Lookup",
                body: "In MSSQL you had a separate _Aplusify_ChapterEd_Chapters table with chapterId, regionId, chapterName, location. In Salesforce, Account is the standard object for organisations/chapters. The 'chapter' field on the Session object is a Lookup to Account. Chapter name and region are stored as Account fields. There is no separate Chapters table — this is collapsed into the Account object."
              },
              {
                color: "#9b59b6", title: "Category — Picklist (replaces Categories table)",
                body: "Previously this was a 3-column lookup table (categoryId, categoryName, categoryCode). In Salesforce, this becomes a Picklist field on the Session object. The category label is the categoryName (e.g. 'Financial Management') and the API value is the categoryCode (e.g. 'FM'). Since Salesforce picklists support both a display label and an API name, this maps perfectly. No separate object is needed."
              },
              {
                color: "#e67e22", title: "Session Format — Picklist (replaces Session_Formats table)",
                body: "The original table had sessionFormatId + sessionFormatName (Panel, Speaker, Workshop, Other). In Salesforce this becomes a simple Picklist field 'sessionFormatId' on the Session object with those 4 values. The integer ID is eliminated — the picklist API name serves as the stable identifier."
              },
              {
                color: "#e74c3c", title: "Speaker Type — Picklist (replaces Speaker_Types table)",
                body: "The original table had speakerTypeId, speakerTypeName, speakerTypeCode. In Salesforce this becomes a Picklist. The speakerTypeCode value can be used as the picklist API name (e.g. 'Business_Partner', 'ALA_Member'). Only 4 values so a picklist is ideal."
              },
              {
                color: "#1abc9c", title: "Organisation Name — Picklist (replaces Partners table)",
                body: "The Partners table had 14 records with organizationId, organizationName, organizationCode. In Salesforce this becomes a Picklist with 14 values on the Session object. The organizationCode becomes the API name and organizationName becomes the label."
              },
              {
                color: "#ffd700", title: "Why Integer IDs Are Eliminated for Picklists",
                body: "In MSSQL, integer foreign keys (categoryId=3, speakerTypeId=2, etc.) linked to separate lookup tables. In Salesforce picklists, there are NO integer IDs. Salesforce stores the picklist API value directly on the record. The 'ID' concept is replaced by the picklist API name which is a stable string identifier. This simplifies the schema significantly — you go from 5 tables down to 1 object with picklist fields."
              }, 
              {    
                color: "#6b7a99", title: "Accreditation Checkboxes (acc_clm, acc_cpe, etc.)",
                body: "The 7 bit/boolean fields (acc_clm, acc_clm_2, acc_cpe, acc_cle, acc_hrci, acc_shrm, acc_other) map directly to Salesforce Checkbox fields. acc_other_text maps to a Text field. These stay as individual fields on the Session object — no change needed. Alternatively they could be modelled as a multi-select picklist if desired."
              },
              {
                color: "#e74c3c", title: "Regions Table Eliminated — Region as Account Field",
                body: "The original MSSQL schema had a separate _ChapterEd_Regions table with regionId and regionName, and the Chapters table had a foreign key to regionId. In the Salesforce design, there is no separate Regions object. Instead, the region information is stored as a field on the Account (Chapter) record. This simplifies the schema since regions are just attributes of chapters rather than standalone entities."
              }
            ].map((card, i) => (
              <div key={i} style={{ background: "#0e1422", border: `1px solid rgba(255,255,255,0.07)`, borderLeft: `3px solid ${card.color}`, borderRadius: 8, padding: "16px 20px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: card.color, marginBottom: 8 }}>{card.title}</div>
                <div style={{ fontSize: 13, color: "#a0b0c8", lineHeight: 1.7 }}>{card.body}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "migration-notes" && (
          <div style={{ maxWidth: 820 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div style={{ background: "#0e1422", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "16px 20px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7a99", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>MSSQL Table → Salesforce Equivalent</div>
                {[
                  ["_ChapterED_Education_Sessions", "Chapter_Education_Session__c (Custom Object)"],
                  ["_ChapterEd_Chapters", "Account (Standard Object)"],
                  ["_ChapterEd_Regions", "Account field (Region) or custom field"],
                  ["_ChapterEd_Categories", "category__c (Picklist on Session)"],
                  ["_ChapterEd_Session_Formats", "sessionFormatId__c (Picklist on Session)"],
                  ["_ChapterEd_Speaker_Types", "speakerTypeId__c (Picklist on Session)"],
                  ["_ChapterEd_Partners", "organizationId__c (Picklist on Session)"],
                ].map(([old, newv], i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "flex-start" }}>
                    <div style={{ fontSize: 10.5, fontFamily: "monospace", color: "#e74c3c", minWidth: 200, lineHeight: 1.5 }}>{old}</div>
                    <div style={{ fontSize: 10, color: "#6b7a99" }}>→</div>
                    <div style={{ fontSize: 10.5, fontFamily: "monospace", color: "#4caf7d", lineHeight: 1.5 }}>{newv}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#0e1422", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "16px 20px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7a99", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>Field Type Mappings</div>
                {[
                  ["int (PK)", "Auto Number"],
                  ["int (FK to lookup)", "Picklist API Value"],
                  ["int (FK to chapters)", "Lookup(Account)"],
                  ["nvarchar", "Text / Long Text Area"],
                  ["smalldatetime", "Date/Time"],
                  ["float", "Number (16,2)"],
                  ["int (count)", "Number (18,0)"],
                  ["bit", "Checkbox"],
                  ["nvarchar (email)", "Email"],
                  ["nvarchar (phone)", "Phone"],
                ].map(([old, newv], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ fontSize: 10.5, fontFamily: "monospace", color: "#4a90d9" }}>{old}</div>
                    <div style={{ fontSize: 10.5, fontFamily: "monospace", color: "#ffd700" }}>{newv}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "#0e1422", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7a99", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>Key Design Decisions & Notes</div>
              {[
                { icon: "⚡", color: "#ffd700", text: "Auto Number replaces sessionId integer PK. Format it as SES-{0000} or similar. It is system-generated and immutable." },
                { icon: "🏛️", color: "#4caf7d", text: "Regions table is eliminated. Region data should be stored as a field on the Account (Chapter) record, not as a separate object. Use a Picklist or Text field on Account." },
                { icon: "🔗", color: "#4a90d9", text: "The 'chapter' lookup field creates a Master-Detail or Lookup relationship to Account. Use Lookup (not Master-Detail) to keep sessions independent if chapters are deleted." },
                { icon: "📋", color: "#9b59b6", text: "chapterPartnered in MSSQL was a bit (boolean). Your new design shows it as a Picklist — this is a valid upgrade if you need values beyond Yes/No (e.g. 'Partially', 'Pending')." },
                { icon: "🗂️", color: "#e67e22", text: "All picklist API names should be stable codes (FM, OM, HR etc.) not display labels, so reports and automations reference consistent values even if labels are renamed." },
                { icon: "✅", color: "#1abc9c", text: "The 7 accreditation checkboxes (acc_clm → acc_other) map cleanly to Salesforce Checkbox fields. Consider grouping them in a Section on the page layout for clarity." },
              ].map((note, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ fontSize: 16 }}>{note.icon}</div>
                  <div style={{ fontSize: 12, color: "#a0b0c8", lineHeight: 1.7 }}>{note.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 