
export type ParsedRecipient = {
  email: string;
  display_name?: string;
};

export type ParseResult = {
  recipients: ParsedRecipient[];
  descartados: number;
};

export function parseRecipientsFile(content: string): ParseResult {
  const normalizedContent = content.replace(/^\uFEFF/, '').trim();

  if (!normalizedContent) {
    return { recipients: [], descartados: 0 };
  }

  const lines = normalizedContent.split(/\r?\n/);
  const firstLine = lines[0].trim();

  const separator =
    firstLine.includes(';') && !firstLine.includes(',')
      ? ';'
      : ',';

  const splitLine = (line: string): string[] =>
    line.split(separator).map((value) => value.trim().replace(/^"|"$/g, ''));

  const firstRow = splitLine(firstLine);
  const normalizeHeader = (value: string) =>
    value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const emailColumn = firstRow.findIndex((value) =>
    ['email', 'e-mail', 'correo', 'correo electronico'].includes(
      normalizeHeader(value),
    ),
  );

  const nameColumn = firstRow.findIndex((value) =>
    ['nombre', 'name', 'display_name', 'display name'].includes(
      normalizeHeader(value),
    ),
  );

 
const knownHeaders = [
  'email',
  'e-mail',
  'correo',
  'correo electronico',
  'nombre',
  'name',
  'display_name',
  'display name',
];

const hasRecognizedHeader = firstRow.some((value) =>
  knownHeaders.includes(normalizeHeader(value)),
);

if (hasRecognizedHeader && emailColumn === -1) {
  throw new Error('El archivo debe contener una columna de email.');
}

const hasHeader = emailColumn !== -1;
const actualEmailColumn = hasHeader ? emailColumn : 0;
const actualNameColumn = hasHeader ? nameColumn : 1;
const dataLines = hasHeader ? lines.slice(1) : lines;

  const recipients: ParsedRecipient[] = [];
  const seenEmails = new Set<string>();
  let descartados = 0;

  for (const line of dataLines) {
    if (!line.trim()) {
      continue;
    }

    const columns = splitLine(line);
    const email = (columns[actualEmailColumn] ?? '').trim().toLowerCase();
    const displayName = (columns[actualNameColumn] ?? '').trim();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail || seenEmails.has(email)) {
      descartados++;
      continue;
    }

    seenEmails.add(email);

    recipients.push({
      email,
      ...(displayName ? { display_name: displayName } : {}),
    });
  }

  return { recipients, descartados };
}
