
import { parseRecipientsFile } from './parseRecipientsFile';

describe('parseRecipientsFile', () => {
  it('returns an empty result for an empty file', () => {
    expect(parseRecipientsFile('')).toEqual({
      recipients: [],
      descartados: 0,
    });
  });

  it('parses a CSV with email and name headers', () => {
    const csv =
      'email,nombre\nJUAN@example.com,Juan Pérez\nana@example.com,Ana';

    expect(parseRecipientsFile(csv)).toEqual({
      recipients: [
        { email: 'juan@example.com', display_name: 'Juan Pérez' },
        { email: 'ana@example.com', display_name: 'Ana' },
      ],
      descartados: 0,
    });
  });

  it('accepts semicolon-separated values', () => {
    const csv = 'email;nombre\njuan@example.com;Juan';

    expect(parseRecipientsFile(csv).recipients).toEqual([
      { email: 'juan@example.com', display_name: 'Juan' },
    ]);
  });

  it('discards invalid and duplicate emails', () => {
    const csv =
      'email,nombre\njuan@example.com,Juan\ninvalid,Pedro\njuan@example.com,Juan duplicado';

    expect(parseRecipientsFile(csv)).toEqual({
      recipients: [{ email: 'juan@example.com', display_name: 'Juan' }],
      descartados: 2,
    });
  });

  it('supports a UTF-8 BOM', () => {
    const csv = '\uFEFFemail,nombre\njuan@example.com,Juan';

    expect(parseRecipientsFile(csv).recipients).toEqual([
      { email: 'juan@example.com', display_name: 'Juan' },
    ]);
  });

  it('parses rows without headers', () => {
    const csv = 'juan@example.com,Juan Pérez';

    expect(parseRecipientsFile(csv).recipients).toEqual([
      { email: 'juan@example.com', display_name: 'Juan Pérez' },
    ]);
  });

  it('throws an error when headers exist without an email column', () => {
   expect(() =>
    parseRecipientsFile('nombre,empresa\nJuan,Acme'),
   ).toThrow('El archivo debe contener una columna de email.');
  });

});
