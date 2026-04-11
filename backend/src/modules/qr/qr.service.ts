import QRCode from "qrcode";
import jwt from "jsonwebtoken";

export const generateDriverQR = async (driverId: string) => {
  try {
    // 🔐 token signé pour éviter falsification
    const token = jwt.sign(
      { driverId },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // 📦 QR payload sécurisé
    const qrData = `${process.env.APP_URL}/scan-driver?token=${token}`;

    const qrCode = await QRCode.toDataURL(qrData);

    return { qrCode, token };
  } catch (err) {
    throw new Error("QR generation failed");
  }
};