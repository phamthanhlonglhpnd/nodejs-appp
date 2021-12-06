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
            <h3>Xin chào ${data.firstName} ${data.lastName}!</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên PolarbearBooking</p>
            <p>Thông tin chi tiết lịch khám bệnh</p>
            <div><b>Thời gian: ${data.time}</b></div>
            <div><b>Bác sĩ: ${data.doctorName}</b></div>
            <p>Nếu thông tin trên là đúng, vui lòng nhấn vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
            <p>Vui lòng chờ email xác nhận đặt lịch thành công từ hệ thống!</p>
            <div>
                <a href=${data.receiveLink}>Click here</a>
            </div>
            <p>Xin chân thành cảm ơn!</p>
        `
    }
    if(data.language==='en') {
        result = 
        `
            <h3>Dear ${data.lastName} ${data.firstName}!</h3>
            <p>You received this email because you booked a medical appointment on PolarbearBooking</p>
            <p>Details of the medical examination schedule</p>
            <div><b>Time: ${data.time}</b></div>
            <div><b>Doctor: ${data.doctorName}</b></div>
            <p>If the above information is correct, please click on the link below to confirm and complete the procedure to book an appointment</p>
            <p>Please wait for the confirmation email of successful booking from the system!</p>
            <div>
                <a href=${data.receiveLink}>Click here</a>
            </div>
            <p>Sincerely thank!</p>
        `
    }
    return result;
}

let sendConfirmEmail = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
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
                to: data.email, // list of receivers
                subject: getSubjectEmailConfirm(data), // Subject line
                html: getBodyEmailConfirm(data), 
                attachments: [
                    {
                        filename: 'text1.png',
                        content: data.image.split("base64,")[1],
                        encoding: 'base64'
                    }
                ]
              });
              resolve(true);
        } catch(e) {
            reject(e);
        }
    })
    
}

let getSubjectEmailConfirm = (data) => {
    let subject = '';
    if(data.language==='vi') {
        subject = 'Xác nhận lịch hẹn khám bệnh'
    }
    if(data.language==='en') {
        subject = 'Confirm the medical examination schedule'
    }
    return subject;
}

let getBodyEmailConfirm = (data) => {
    let result = '';
    if(data.language==='vi') {
        result = 
        `
            <h3>Xin chào ${data.firstName} ${data.lastName}!</h3>
            <p>Bạn nhận được email này vì hệ thống đã xác nhận đặt lịch khám bệnh thành công trên PolarbearBooking</p>
            <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm</p>
            <p>Xin chân thành cảm ơn!</p>
        `
    }
    if(data.language==='en') {
        result = 
        `
            <h3>Dear ${data.lastName} ${data.firstName}!</h3>
            <p>You received this email because the system has confirmed the successful appointment booking on PolarbearBooking</p>
            <p>Prescription/invoice information sent in attachment</p>
            <p>Sincerely thank!</p>
        `
    }
    return result;
}

async function main() {
    
  }

module.exports = {
    sendSimpleEmail,
    sendConfirmEmail
}