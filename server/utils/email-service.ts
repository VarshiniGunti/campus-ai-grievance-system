/**
 * Email Service for Campus AI Grievance System
 * In production, integrate with Nodemailer, SendGrid, or similar service
 */

export interface EmailNotification {
  to: string;
  studentName: string;
  grievanceId: string;
  status: "viewed" | "cleared";
  category: string;
  urgency: string;
  message?: string;
}

/**
 * Send email notification to student
 * Mock implementation - replace with actual email service
 */
export async function sendStatusNotification(
  notification: EmailNotification,
): Promise<boolean> {
  try {
    // Mock email service - logs to console
    console.log("📧 EMAIL NOTIFICATION SENT");
    console.log("─".repeat(60));
    console.log(`To: ${notification.to}`);
    console.log(`Student: ${notification.studentName}`);
    console.log(`Grievance ID: ${notification.grievanceId}`);
    console.log(`Status: ${notification.status.toUpperCase()}`);
    console.log(`Category: ${notification.category}`);
    console.log(`Urgency: ${notification.urgency}`);
    console.log(`─'.repeat(60)`);

    const subject = getEmailSubject(notification.status);
    const body = getEmailBody(notification);

    console.log(`Subject: ${subject}`);
    console.log(`Message:\n${body}`);
    console.log("─".repeat(60));

    // In production, uncomment and use actual email service:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: notification.to,
      subject,
      html: body
    };

    await transporter.sendMail(mailOptions);
    */

    return true;
  } catch (error) {
    console.error("Error sending email notification:", error);
    return false;
  }
}

/**
 * Get email subject based on status
 */
function getEmailSubject(status: "viewed" | "cleared"): string {
  if (status === "viewed") {
    return "✅ Your Grievance Has Been Reviewed";
  } else {
    return "🎉 Your Grievance Has Been Resolved";
  }
}

/**
 * Get email body HTML
 */
function getEmailBody(notification: EmailNotification): string {
  const { studentName, grievanceId, status, category, urgency, message } =
    notification;

  const statusMessage =
    status === "viewed"
      ? "Your grievance has been reviewed by our administration team."
      : "Your grievance has been resolved and cleared from our system.";

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ff6b5b 0%, #c233f0 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
    .header h1 { margin: 0; }
    .content { background: #f8f8f8; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #ff6b5b; border-radius: 4px; }
    .label { color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .value { color: #333; font-weight: bold; font-size: 16px; margin-top: 5px; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${status === "viewed" ? "✅ Grievance Reviewed" : "🎉 Grievance Resolved"}</h1>
    </div>
    
    <div class="content">
      <p>Hi <strong>${studentName}</strong>,</p>
      
      <p>${statusMessage}</p>
      
      ${message ? `<p>${message}</p>` : ""}
      
      <div class="info-box">
        <div class="label">Grievance ID</div>
        <div class="value">${grievanceId}</div>
      </div>
      
      <div class="info-box">
        <div class="label">Category</div>
        <div class="value">${category}</div>
      </div>
      
      <div class="info-box">
        <div class="label">Urgency Level</div>
        <div class="value">${urgency}</div>
      </div>
      
      <p>If you have any questions or concerns, please contact our grievance redressal team.</p>
      
      <p>Best regards,<br><strong>Campus AI Grievance System</strong></p>
    </div>
    
    <div class="footer">
      <p>© 2024 Campus AI Grievance Intelligence System. All rights reserved.</p>
      <p>This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send batch email notifications
 */
export async function sendBatchNotifications(
  notifications: EmailNotification[],
): Promise<number> {
  let successCount = 0;
  for (const notification of notifications) {
    const success = await sendStatusNotification(notification);
    if (success) successCount++;
  }
  return successCount;
}
