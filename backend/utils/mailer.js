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

async function sendBookingConfirmationEmail(to, bookingDetails) {
  const mailOptions = {
    from: "Mail",
    to: to,
    subject: 'Xác nhận thanh toán thành công',
    html: `
      <h2>Cảm ơn quý khách đã thanh toán đặt phòng thành công!</h2>
      <p>Thông tin đặt phòng của quý khách:</p>
      <ul>
        <li><strong>Mã đặt phòng:</strong> ${bookingDetails.BookingID}</li>
        <li><strong>Ngày nhận phòng:</strong> ${bookingDetails.checkin}</li>
        <li><strong>Ngày trả phòng:</strong> ${bookingDetails.checkout}</li>
        <li><strong>Loại phòng:</strong> ${bookingDetails.roomType}</li>
        <li><strong>Tổng chi phí:</strong> ${bookingDetails.totalCost} VND</li>
      </ul>
      <p>Chúng tôi rất mong được đón tiếp quý khách!</p>
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
