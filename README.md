


# 🏥EZHealth - Digital Health Platform  

EZHealth is a comprehensive **digital health** and **telemedicine platform** that connects patients, doctors, and healthcare administrators. It offers seamless online appointment management, video consultations, secure payments, digital prescriptions, and intelligent AI-driven health assistance.  

## 📌 Features  
✔ **Doctor Dashboard:** Manage appointments, view patient history and update statuses.  
✔ **Telemedicine:** Remote video consultation via Jitsi.   
✔ **Patient Service:** Book or cancel appointments, consult with doctors.  
✔ **Payment Gateway:** Patient can pay consultation fee via Razorpay payment gateway during appointment booking.  
✔ **Modern UI:** Userfriendly and modern user interface.  
✔ **Admin Panel:** Oversee all appointments and verify new doctors.


## 🛠️ Tech Stack  
### **Backend:**  
- **Node.js** → Runtime environment

- **Express.js** → Web framework

- **MongoDB / Mongoose** → Database and ODM

- **JWT** → Authentication and authorization

- **Jitsi** → Real-time video calling

- **Payment Gateway Integration** (e.g. Razorpay) → Payments

- **Gemini APIs** → AI chatbot functionality

- **Cloud Services** (Render) → Hosting and deployment

- **Nodemailer** → Email notifications

### **Frontend:**  
- **React.js** → UI development

- **Context API** → State management

- **Tailwind CSS** → Styling the UI

- **Axios API** → API communication

- **Jitsi SDKs** → Video consultation

- **Vite / Webpack** → Build tools

## ⚙️ Installation & Setup  
### **1️⃣ Clone the repository**

```bash
  git clone https://github.com/tr-choudhury21/EZHealth-Frontend.git
```
    
### **2️⃣ Install Dependencies for frontend**

```bash
    npm install
```

### **3️⃣ Start the server for frontend**

```bash
    npm run dev
```

- The UI will be accessible at: http://localhost:5173/
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

- **For Backend**


`PORT = <server_running_port>`

`MONGO_URI = <your_mongodb_connection_string>`

`FRONTEND_URL = <frontend_url>`

`DASHBOARD_URL = <dashboard_url>`

`JWT_SECRET_KEY = <your-jwt-secret-key>`

`JWT_EXPIRES = <jwt-expiration-time>`

`COOKIE_EXPIRE = <cookie-expiration-time>`

`CLOUDINARY_CLOUD_NAME = <your_cloudinary_cloud-name>`

`CLOUDINARY_API_SECRET = <your_cloudinary_api-secret-key>`

`CLOUDINARY_API_KEY = <your_cloudinary_api-key>`

`EMAIL_USER = <your_email-username>`

`EMAIL_PASS = <your_email-generated-password>`

`RAZORPAY_KEY_ID = <your_razorpay_key-id>`

`RAZORPAY_KEY_SECRET = <your_razorpay_key-secret>`

`GEMINI_API_KEY = <your_gemini-api-key>`

- **For Frontend**

`VITE_RAZORPAY_KEY = <your_razorpay_key-id>`

`VITE_SERVER_URL = <your_server_url>`









## Contributing

Contributions are always welcome!

- Fork the project.

- Create a new branch
```bash
    git checkout -b feature/AmazingFeature
```
- Commit your changes
```bash
    git commit -m 'Add some new features'
```
- Push to the branch
```bash
    git push origin feature/AmazingFeature
```
- Open a pull request


Please adhere to this project's `code of conduct`.

## Project Link

[EZHealth - A Digital Healthcare Platform](https://ez-health-main.vercel.app/)


## 📜 License

This project is licensed under [MIT](https://choosealicense.com/licenses/mit/) License. Feel free to use and modify.

