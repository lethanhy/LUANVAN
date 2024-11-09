// mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Use environment variable
    pass:  process.env.EMAIL_PASS,  // Use environment variable
  },
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

async function sendBookingConfirmationEmail(to, bookingDetails) {
  const mailOptions = {
    from: "Mail",
    to: to,
    subject: 'Xác nhận thanh toán thành công',
    html: `
       <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="color: #4CAF50; text-align: center; margin-bottom: 20px;">Cảm ơn quý khách đã thanh toán đặt phòng thành công!</h2>
      <p style="margin-bottom: 20px; font-size: 16px; color: #555;">Thông tin đặt phòng của quý khách:</p>
      <ul style="list-style-type: none; padding: 0; margin: 0; font-size: 15px; color: #333;">
        <li style="margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #ddd;">
          <strong style="color: #333;">Mã đặt phòng:</strong> ${bookingDetails.BookingID}
        </li>
        <li style="margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #ddd;">
          <strong style="color: #333;">Ngày nhận phòng:</strong> ${formatDate(bookingDetails.checkin)}
        </li>
        <li style="margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #ddd;">
          <strong style="color: #333;">Ngày trả phòng:</strong> ${formatDate(bookingDetails.checkout)}
        </li>
        <li style="margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #ddd;">
          <strong style="color: #333;">Loại phòng:</strong> ${bookingDetails.roomType}
        </li>
        <li style="margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #ddd;">
          <strong style="color: #333;">Tổng chi phí:</strong> <span style="color: #d9534f;">${bookingDetails.totalCost} VND</span>
        </li>
      </ul>
      <p style="margin-top: 20px; text-align: center; font-size: 15px; color: #777;">Địa chỉ: 28 Đường Thi Sách, Phường Thắng Tám, TP Vũng Tàu, BR-VT</p>
      <p style="margin-top: 20px; text-align: center; font-size: 15px; color: #777;">Chúng tôi rất mong được đón tiếp quý khách!</p>
    </div>
    `,
  };

  console.log('Email user:', process.env.EMAIL_USER);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email đã được gửi:', info.response);
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
  }
}

module.exports = { sendBookingConfirmationEmail };
