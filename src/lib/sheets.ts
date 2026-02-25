import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";
import { DelightEntry, DelightType } from "./types";

function getAuth() {
  let email: string | undefined;
  let key: string | undefined;

  const keyJsonPath = path.join(process.cwd(), "key.json");
  if (fs.existsSync(keyJsonPath)) {
    const keyFile = JSON.parse(fs.readFileSync(keyJsonPath, "utf-8"));
    email = keyFile.client_email;
    key = keyFile.private_key;
  } else {
    email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  }

  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !key || !sheetId) {
    throw new Error(
      "Missing Google Sheets credentials. Either place key.json in the project root or set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY env vars. GOOGLE_SHEET_ID is always required."
    );
  }

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  return { sheets, sheetId };
}

export async function getEntries(startDate: string, endDate: string): Promise<DelightEntry[]> {
  const { sheets, sheetId } = getAuth();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Sheet1!A2:E",
  });

  const rows = res.data.values || [];

  return rows
    .map((row, index) => ({
      rowIndex: index + 2,
      date: row[0] || "",
      delight: (row[1] || "") as DelightType,
      description: row[2] || "",
      wildcardName: row[3] || undefined,
      createdAt: row[4] || "",
    }))
    .filter((entry) => entry.date >= startDate && entry.date <= endDate);
}

export async function addEntry(entry: {
  date: string;
  delight: DelightType;
  description: string;
  wildcardName?: string;
}): Promise<void> {
  const { sheets, sheetId } = getAuth();

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Sheet1!A:E",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          entry.date,
          entry.delight,
          entry.description,
          entry.wildcardName || "",
          new Date().toISOString(),
        ],
      ],
    },
  });
}

export async function updateEntry(
  rowIndex: number,
  entry: {
    date: string;
    delight: DelightType;
    description: string;
    wildcardName?: string;
  }
): Promise<void> {
  const { sheets, sheetId } = getAuth();

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `Sheet1!A${rowIndex}:E${rowIndex}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          entry.date,
          entry.delight,
          entry.description,
          entry.wildcardName || "",
          new Date().toISOString(),
        ],
      ],
    },
  });
}

export async function deleteEntry(rowIndex: number): Promise<void> {
  const { sheets, sheetId } = getAuth();

  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
  });

  const sheet = spreadsheet.data.sheets?.[0];
  const sheetGid = sheet?.properties?.sheetId || 0;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheetGid,
              dimension: "ROWS",
              startIndex: rowIndex - 1,
              endIndex: rowIndex,
            },
          },
        },
      ],
    },
  });
}

export async function getAllEntries(): Promise<DelightEntry[]> {
  const { sheets, sheetId } = getAuth();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Sheet1!A2:E",
  });

  const rows = res.data.values || [];

  return rows.map((row, index) => ({
    rowIndex: index + 2,
    date: row[0] || "",
    delight: (row[1] || "") as DelightType,
    description: row[2] || "",
    wildcardName: row[3] || undefined,
    createdAt: row[4] || "",
  }));
}
