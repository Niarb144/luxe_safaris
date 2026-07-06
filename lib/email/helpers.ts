// lib/email/helpers.ts
// Shared email building blocks — keep header/footer/section styling and
// date formatting consistent across every transactional email
// (booking confirmation, inquiry, newsletter, etc).

export function emailHeader(subtitle: string) {
  return `
    <tr>
      <td style="background:#14201A; padding:32px 32px 28px 32px;">
        <p style="margin:0; font-family:Georgia,'Times New Roman',serif; font-size:20px; letter-spacing:1px; color:#B98A3E; font-weight:700;">
          LUXE PLAINS AFRICA SAFARIS
        </p>
        <p style="margin:6px 0 0 0; font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#ffffff;">
          ${subtitle}
        </p>
      </td>
    </tr>
  `;
}

export function emailSectionHeading(title: string) {
  return `
    <tr>
      <td style="padding:28px 0 6px 0;">
        <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#B98A3E; font-weight:700;">
          ${title}
        </p>
        <div style="height:1px; background:#e8e2d9; margin-top:10px;"></div>
      </td>
    </tr>
  `;
}

export function emailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0; font-family:Arial,Helvetica,sans-serif; font-size:14px; color:#6b7a6e; width:40%;">
        ${label}
      </td>
      <td style="padding:10px 0; font-family:Arial,Helvetica,sans-serif; font-size:14px; color:#14201A; font-weight:600;">
        ${value}
      </td>
    </tr>
  `;
}

export function emailFooter(referenceLabel: string, referenceValue: string) {
  return `
    <tr>
      <td style="background:#14201A; padding:16px 32px;">
        <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:12px; color:#B98A3E;">
          ${referenceLabel}: <span style="color:#ffffff;">${referenceValue}</span>
          &nbsp;&middot;&nbsp;
          <span style="color:#ffffff;">Received: ${formatReceivedAt()}</span>
        </p>
      </td>
    </tr>
  `;
}

export function emailButton(text: string, href: string) {
  return `
    <a href="${href}" style="display:inline-block; background:#B98A3E; color:#F2EDE3; text-decoration:none; font-family:Arial,Helvetica,sans-serif; font-size:14px; font-weight:600; padding:12px 24px; border-radius:6px;">
      ${text}
    </a>
  `;
}

export function formatTravelDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function formatReceivedAt() {
  return (
    new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }) +
    " at " +
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}