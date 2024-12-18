// mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Use environment variable
    pass: process.env.EMAIL_PASS,  // Use environment variable
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

 // Function to calculate days between two dates
 function calculateDaysBetween(checkinDate, checkoutDate) {
  const start = new Date(checkinDate);
  const end = new Date(checkoutDate);

  // Tính thời gian chênh lệch (millisecond)
  const differenceInTime = end.getTime() - start.getTime();

  // Chuyển đổi millisecond sang ngày
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  // Làm tròn lên
  return Math.ceil(differenceInDays);
}

// Hàm tính số ngày giữa check-in và check-out
// function calculateStayDuration(checkinDate, checkoutDate) {
//   const checkin = new Date(checkinDate);
//   const checkout = new Date(checkoutDate);
//   const diffTime = checkout - checkin;  // Tính chênh lệch thời gian (milisecond)
//   const diffDays = diffTime / (1000 * 3600 * 24);  // Chuyển đổi milisecond thành số ngày
//   return diffDays;
// }

async function sendBookingConfirmationEmail(to, bookingDetails) {
  const stayDuration = calculateDaysBetween(bookingDetails.checkin, bookingDetails.checkout);

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
            <strong style="color: #333;">Số phòng:</strong> ${bookingDetails.roomNumber}
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
            <strong style="color: #333;">Tổng chi phí:</strong> <span style="color: #d9534f;">${bookingDetails.totalCost * stayDuration} VND</span>
          </li>
          <li style="margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #ddd;">
            <strong style="color: #333;">Số đêm lưu trú:</strong> ${stayDuration} đêm
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

async function sendCreateStaffConfirmationEmail(to, staff) {
 
  const mailOptions = {
    from: "Mail",
    to: to,
    subject: 'THÔNG TIN TÀI KHOẢN NHÂN VIÊN OCEAN BREZEE HOTEL',
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
        <p style="margin-bottom: 20px; font-size: 16px; color: #555;">Thông tin tài khoản đăng nhập của bạn là:</p>
        <ul style="list-style-type: none; padding: 0; margin: 0; font-size: 15px; color: #333;">
          <li style="margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #ddd;">
            <strong style="color: #333;">Tên nhân viên:</strong> ${staff.name}
          </li>
          <li style="margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #ddd;">
            <strong style="color: #333;">Mật khẩu:</strong> ${staff.password}
          </li>
          <li style="margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #ddd;">
            <strong style="color: #333;">Số điện thoại:</strong> ${staff.phone}
          </li>
          <li style="margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #ddd;">
            <strong style="color: #333;">Vị trí công việc:</strong> ${staff.role}
          </li>
           <li style="margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #ddd;">
            <strong style="color: #333;">Lưu ý:</strong> Bạn có thể thay đổi mật khẩu tài khoản.
          </li>
        </ul>
        <p style="margin-top: 20px; text-align: center; font-size: 15px; color: #777;">Chúng tôi rất vui khi chào đón bạn trở thành viên của Ocean Breeze hotel!</p>
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

module.exports = { sendBookingConfirmationEmail, sendCreateStaffConfirmationEmail };
