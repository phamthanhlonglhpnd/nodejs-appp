require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (data) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_APP, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"PolarbearBooking " <nguyenminhoanglhpnd@gmail.com>', // sender address 
        to: data.receiveEmail, // list of receivers
        subject: getSubjectEmail(data), // Subject line
        html: getBodyEmail(data)
        
      });
    
}

let getSubjectEmail = (data) => {
    let subject = '';
    if(data.language==='vi') {
        subject = 'Thông tin đặt lịch khám bệnh'
    }
    if(data.language==='en') {
        subject = 'Details of the medical examination schedule'
    }
    return subject;
}

let getBodyEmail = (data) => {
    let result = '';
    if(data.language==='vi') {
        result = 
        `
            <h3>Xin chào ${data.patientName}!</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên PolarbearBooking</p>
            <p>Thông tin chi tiết lịch khám bệnh</p>
            <div><b>Thời gian: ${data.time}</b></div>
            <div><b>Bác sĩ: ${data.doctorName}</b></div>
            <p>Nếu thông tin trên là đúng, vui lòng nhấn vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
            <div>
                <a href=${data.receiveLink}>Click here</a>
            </div>
            <p>Xin chân thành cảm ơn!</p>
        `
    }
    if(data.language==='en') {
        result = 
        `
            <h3>Dear ${data.patientName}!</h3>
            <p>You received this email because you booked a medical appointment on PolarbearBooking</p>
            <p>Details of the medical examination schedule</p>
            <div><b>Time: ${data.time}</b></div>
            <div><b>Doctor: ${data.doctorName}</b></div>
            <p>If the above information is correct, please click on the link below to confirm and complete the procedure to book an appointment</p>
            <div>
                <a href=${data.receiveLink}>Click here</a>
            </div>
            <p>Sincerely thank!</p>
        `
    }
    return result;
}

async function main() {
    
  }

module.exports = {
    sendSimpleEmail
}